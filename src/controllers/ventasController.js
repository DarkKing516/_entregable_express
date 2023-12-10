const { MongoClient } = require('mongodb');
const ventaModel = require('../models/ventaModel');

const getVentasPage = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect(); // Conectar a la base de datos

    const database = client.db('erikas_homemade'); // Usar el nombre correcto de la base de datos
    const ventasCollection = database.collection('ventas');

    // Realizar operaciones con la colección de ventas...
    const ventas = await ventasCollection.find({}).toArray(); // Obtener todos los documentos de ventas

    // Obtener los pedidos y usuarios desde sus respectivas colecciones
    const pedidosCollection = database.collection('pedidos');
    const usuariosCollection = database.collection('configuracion');

    const pedidos = await pedidosCollection.find({}).toArray(); // Obtener todos los documentos de pedidos
    const usuarios = await usuariosCollection.find({}).toArray(); // Obtener todos los usuarios

    // Renderizar la vista con datos de ventas, pedidos y usuarios
    res.render('ventas', { ventas, pedidos, usuarios });
  } catch (error) {
    console.error('Error al obtener datos de la base de datos:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close(); // Cerrar la conexión
  }
};

const agregarVenta = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect(); // Conectar a la base de datos

    const database = client.db('erikas_homemade');
    const ventasCollection = database.collection('ventas');
    const pedidosCollection = database.collection('pedidos');
    const configuracionCollection = database.collection('configuracion');

    // Obtener datos de pedidos y configuración
    const pedidos = await pedidosCollection.find({}, { projection: { servicios: 1, productos: 1 } }).toArray();
    const usuarios = await configuracionCollection.find({}).toArray();

    const { fecha_venta, metodo_pago, total_venta, nombre, telefono, documento, correo, productos, usuario, pedido } = req.body;

    // Obtener datos del usuario seleccionado
    const usuarioSeleccionado = usuarios.find(user => user._id === usuario);
    const { nombre: nombreUsuario, telefono: telefonoUsuario, documento: documentoUsuario, correo: correoUsuario } = usuarioSeleccionado;

    // Obtener datos del pedido seleccionado
    const pedidoSeleccionado = pedidos.find(p => p._id === pedido);
    const { total_pedido, productos: productosPedido } = pedidoSeleccionado;

    // Construir el objeto de venta con los datos obtenidos
    const nuevaVenta = {
      fecha_venta,
      metodo_pago,
      total_venta,
      nombre: nombreUsuario,
      telefono: telefonoUsuario,
      documento: documentoUsuario,
      correo: correoUsuario,
      total_pedido,
      productos: productosPedido,
      // Otros campos de la venta según sea necesario
    };

    // Guardar la nueva venta en la colección de ventas
    await ventasCollection.insertOne(nuevaVenta);

    const ventasActualizadas = await ventasCollection.find({}).toArray();

    // Redireccionar a la página de ventas
    res.render('ventas', { ventas: ventasActualizadas }); // Reemplaza con la ruta correcta
  } catch (error) {
    console.error('Error al agregar la venta:', error);
    console.error(error); // Imprimir el objeto error completo para detalles adicionales
    res.status(500).send('Error interno del servidor al agregar la venta');
  } finally {
    await client.close(); // Cerrar la conexión
  }
};




module.exports = { getVentasPage, agregarVenta };
