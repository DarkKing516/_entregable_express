// src/controllers/pedidosController.js
const { MongoClient, ObjectId } = require('mongodb');

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
  // Obtener servicios y productos del cuerpo de la solicitud
  const servicios = req.body.servicios ? JSON.parse(req.body.servicios) : [];
  const productos = req.body.productos ? JSON.parse(req.body.productos) : [];

  // Calcular total y subtotales
  let totalPedido = 0;

  const serviciosConSubtotales = servicios.map(servicio => {
    const cantidad = parseInt(servicio.cantidadServicio);
    const precio = parseFloat(servicio.precioServicio);
    const subtotal = cantidad * precio;

    // Update tipoServicio field to include tipoServicio and estadoTipoServicio
    const tipoServicio = {
      tipoServicio: servicio.tipoServicio,
      estadoTipoServicio: servicio.estadoTipoServicio,
    };

    totalPedido += subtotal;

    return { ...servicio, tipoServicio, subtotal };
  });

  const productosConSubtotales = productos.map(producto => {
    const cantidad = parseInt(producto.cantidadProducto);
    const precio = parseFloat(producto.precioProducto);
    const subtotal = cantidad * precio;

    // Update tipoProducto field to include tipoProducto and estadoTipoProducto
    const tipoProducto = {
      tipoProducto: producto.tipoProducto,
      estadoTipoProducto: producto.estadoTipoProducto,
    };

    totalPedido += subtotal;

    return { ...producto, tipoProducto, subtotal };
  });

  // Crear el objeto del pedido con servicios y productos
  const pedido = {
    servicios: serviciosConSubtotales,
    productos: productosConSubtotales,
    fecha_creacion: obtenerFechaActual(),
    fecha_pedido: req.body.fechaPedido,
    total_pedido: totalPedido,
    estado_pedido: 'por hacer',
    nombre_usuario: req.body.nombreUsuario,
  };

  // Insertar el pedido en la base de datos
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const pedidosCollection = database.collection('pedidos');

    await pedidosCollection.insertOne(pedido);

    res.redirect('/pedidos'); // Redirigir a la página de pedidos o donde sea necesario
  } catch (error) {
    console.error('Error al insertar el pedido en la base de datos:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};


const verDetallePedido = async (req, res) => {
  const pedidoId = req.params.id;

  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const pedidosCollection = database.collection('pedidos');
    const usuariosCollection = database.collection('configuracion');
    const usuarios = await usuariosCollection.find({}).toArray();


    // Obtener el pedido por ID
    const pedido = await pedidosCollection.findOne({ _id: new ObjectId(pedidoId) });

    if (!pedido) {
      // Manejar el caso en el que el pedido no se encuentre
      res.status(404).send('Pedido no encontrado');
      return;
    }

    // Renderizar la vista con detalles del pedido
    res.render('detallePedido', { pedido, usuarios });
  } catch (error) {
    console.error('Error al obtener el detalle del pedido:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};

const eliminarPedido = async (req, res) => {
  const pedidoId = req.params.id;

  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const pedidosCollection = database.collection('pedidos');

    // Eliminar el pedido por ID
    await pedidosCollection.deleteOne({ _id: new ObjectId(pedidoId) });

    res.redirect('/pedidos'); // Redirigir a la página de pedidos después de eliminar
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};

const actualizarPedido = async (req, res) => {
  const pedidoId = req.params.pedidoId;

  // Extraer servicios y productos del cuerpo de la solicitud
  const servicios = req.body.servicios.map(servicio => ({
    tipoServicio: servicio.tipoServicio,
    estadoTipoServicio: servicio.estadoTipoServicio,
    nombreServicio: servicio.nombreServicio,
    estadoServicio: servicio.estadoServicio,
    cantidadServicio: parseInt(servicio.cantidadServicio),
    precioServicio: parseFloat(servicio.precioServicio),
    subtotalServicio: parseFloat(servicio.subtotalServicio),
  }));

  const productos = req.body.productos.map(producto => ({
    tipoProducto: producto.tipoProducto,
    estadoTipoProducto: producto.estadoTipoProducto,
    nombreProducto: producto.nombreProducto,
    estadoProducto: producto.estadoProducto,
    cantidadProducto: parseInt(producto.cantidadProducto),
    precioProducto: parseFloat(producto.precioProducto),
    subtotalProducto: parseFloat(producto.subtotalProducto),
  }));

  // Calcular total del pedido
  let totalPedido = 0;
  servicios.forEach(servicio => {
    totalPedido += servicio.subtotalServicio;
  });
  productos.forEach(producto => {
    totalPedido += producto.subtotalProducto;
  });

  // Crear objeto de pedido actualizado
  const pedidoActualizado = {
    servicios: servicios,
    productos: productos,
    fecha_pedido: req.body.fechaPedido,
    total_pedido: totalPedido,
    estado_pedido: req.body.estadoPedido,
    nombre_usuario: req.body.nombreUsuario,
  };

  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const pedidosCollection = database.collection('pedidos');

    // Corrige la creación de ObjectId aquí
    await pedidosCollection.updateOne({ _id: new ObjectId(pedidoId) }, { $set: pedidoActualizado });

    res.redirect('/pedidos'); // Redirigir a la página de pedidos o donde sea necesario
  } catch (error) {
    console.error('Error al actualizar el pedido en la base de datos:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};



module.exports = { getPedidosPage, agregarPedido, verDetallePedido, eliminarPedido, actualizarPedido };