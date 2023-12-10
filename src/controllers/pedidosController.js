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
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect(); // Conectar a la base de datos

    const database = client.db('erikas_homemade');
    const pedidosCollection = database.collection('pedidos');

    // Obtener datos del formulario
    const {
      fechaPedido,
      tipoServicio,
      nombreServicio,
      estadoServicio,
      cantidadServicio,
      precioServicio,
      tipoProducto,
      nombreProducto,
      estadoProducto,
      cantidadProducto,
      precioProducto,
      nombreUsuario,
    } = req.body;

    // Validaciones adicionales si es necesario

    // Calcular subtotales y total
    const subtotalServicio = cantidadServicio * precioServicio;
    const subtotalProducto = cantidadProducto * precioProducto;
    const totalPedido = subtotalServicio + subtotalProducto;

    // Crear el nuevo pedido
    const nuevoPedido = {
      servicios: [{
        tipo_servicio: {
          nombre_tipo_servicio: tipoServicio,
          estado_tipo_servicio: estadoServicio,
        },
        nombre_servicio: nombreServicio,
        estado_servicio: estadoServicio,
        cantidad_servicio: cantidadServicio,
        precio_servicio: precioServicio,
        estado_servicio_catalogo: estadoServicio,
        subtotal: subtotalServicio,
      }],
      productos: [{
        tipo_producto: {
          nombre_tipo_producto: tipoProducto,
          estado_tipo_producto: estadoProducto,
        },
        nombre_producto: nombreProducto,
        estado_producto: estadoProducto,
        cantidad_producto: cantidadProducto,
        precio_producto: precioProducto,
        estado_producto_catalogo: estadoProducto,
        subtotal: subtotalProducto,
      }],
      fecha_creacion: obtenerFechaActual(),
      fecha_pedido: fechaPedido,
      total_pedido: totalPedido,
      estado_pedido: 'por hacer',
      nombre_usuario: nombreUsuario,
    };

    // Insertar el nuevo pedido en la base de datos
    await pedidosCollection.insertOne(nuevoPedido);
    console.log('pedidosCollection:', nuevoPedido);
    // console.log('pedidosCollection:', pedidosCollection);

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