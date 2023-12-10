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
    const ventas = await ventasCollection.find({}).toArray(); // Ejemplo: Obtener todos los documentos de ventas

    // Renderizar la vista con datos de ventas
    res.render('ventas', { ventas });
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

    const database = client.db('erikas_homemade'); // Usar el nombre correcto de la base de datos
    const ventasCollection = database.collection('ventas');

    // Obtener los datos de la nueva venta desde la solicitud (req)
    const { fecha_venta, metodo_pago, total_venta, total_pedido, nombre, telefono, documento, correo, productos } = req.body;

    // Construir el objeto de venta
    const nuevaVenta = {
      fecha_venta,
      metodo_pago,
      total_venta,
      total_pedido,
      nombre,
      telefono,
      documento,
      correo,
      productos
      // Agregar otros campos de la venta según sea necesario
    };

    // Agregar la nueva venta a la colección de ventas en la base de datos
    await ventasCollection.insertOne(nuevaVenta);

    // Redireccionar a la página de ventas después de agregar la venta
    res.redirect('./views/ventas.js'); // Reemplazar con la ruta correcta
  } catch (error) {
    console.error('Error al agregar la venta:', error);
    res.status(500).send('Error interno del servidor al agregar la venta');
  } finally {
    await client.close(); // Cerrar la conexión
  }
};


module.exports = { getVentasPage, agregarVenta};
