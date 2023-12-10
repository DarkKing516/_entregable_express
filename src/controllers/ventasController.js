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

module.exports = { getVentasPage };
