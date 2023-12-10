// src/controllers/pedidosController.js
const { MongoClient } = require('mongodb');

// Función para obtener datos de la colección de pedidos
const getPedidosPage = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect(); // Conectar a la base de datos

    const database = client.db('erikas_homemade');
    const pedidosCollection = database.collection('pedidos');
    const usuariosCollection = database.collection('configuracion');

    // Realizar operaciones con las colecciones...
    const pedidos = await pedidosCollection.find({}).toArray();
    const usuarios = await usuariosCollection.find({}).toArray();

    // Renderizar la vista con datos
    res.render('pedidos', { pedidos, usuarios, fechaActual: obtenerFechaActual() });
  } catch (error) {
    console.error('Error al obtener datos de la base de datos:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close(); // Cerrar la conexión
  }
};

// Función para obtener la fecha actual en formato 'YYYY-MM-DD'
const obtenerFechaActual = () => {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const day = fecha.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const agregarPedido = async (req, res) => {
  console.log('req.body:', req.body);
  const {
    fechaPedido,
    nombreUsuario,
  } = req.body;

  // Obtener el número de servicios y productos
  const numServicios = req.body.numServicios || 0;
  const numProductos = req.body.numProductos || 0;

  const servicios = [];
  const productos = [];

  // Iterar sobre los campos de servicios
  for (let i = 1; i <= numServicios; i++) {
    servicios.push({
      tipo_servicio: {
        nombre_tipo_servicio: req.body[`tipoServicio${i}`],
        estado_tipo_servicio: req.body[`estadoTipoServicio${i}`],
      },
      nombre_servicio: req.body[`nombreServicio${i}`],
      estado_servicio: req.body[`estadoServicio${i}`],
      cantidad_servicio: req.body[`cantidadServicio${i}`],
      precio_servicio: req.body[`precioServicio${i}`],
      subtotal: req.body[`cantidadServicio${i}`] * req.body[`precioServicio${i}`],
    });
  }

  // Iterar sobre los campos de productos
  for (let i = 1; i <= numProductos; i++) {
    productos.push({
      tipo_producto: {
        nombre_tipo_producto: req.body[`tipoProducto${i}`],
        estado_tipo_producto: req.body[`estadoTipoProducto${i}`],
      },
      nombre_producto: req.body[`nombreProducto${i}`],
      estado_producto: req.body[`estadoProducto${i}`],
      cantidad_producto: req.body[`cantidadProducto${i}`],
      precio_producto: req.body[`precioProducto${i}`],
      subtotal: req.body[`cantidadProducto${i}`] * req.body[`precioProducto${i}`],
    });
  }

  // Calcular total
  const totalPedido = servicios.reduce((total, servicio) => total + servicio.subtotal, 0)
    + productos.reduce((total, producto) => total + producto.subtotal, 0);

  // Crear el nuevo pedido
  const nuevoPedido = {
    servicios,
    productos,
    fecha_creacion: obtenerFechaActual(),
    fecha_pedido: fechaPedido,
    total_pedido: totalPedido,
    estado_pedido: 'por hacer',
    nombre_usuario: nombreUsuario,
  };

  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect(); // Conectar a la base de datos

    const database = client.db('erikas_homemade');
    const pedidosCollection = database.collection('pedidos');

    // Insertar el nuevo pedido en la base de datos
    await pedidosCollection.insertOne(nuevoPedido);

    res.redirect('/pedidos'); // Redirigir a la página de pedidos después de agregar el pedido
  } catch (error) {
    console.error('Error al agregar pedido:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close(); // Cerrar la conexión
  }
};


const eliminarPedido = async (req, res) => {
  const { id } = req.params;

  try {
    const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const database = client.db('erikas_homemade');
    const pedidosCollection = database.collection('pedidos');

    // Cambia esta línea en la función eliminarPedido
    await pedidosCollection.deleteOne({ _id: new MongoClient.ObjectID(id) });

    res.redirect('/pedidos');
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    if (client) {
      await client.close();
    }
  }
};

module.exports = { getPedidosPage, agregarPedido, eliminarPedido /* otras funciones */ };