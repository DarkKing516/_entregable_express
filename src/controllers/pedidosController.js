// src/controllers/pedidosController.js
const { MongoClient } = require('mongodb');

// Conexión a MongoDB
const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Función para obtener datos de la colección de pedidos
const getPedidosPage = async (req, res) => {
  try {
    await client.connect(); // Conectar a la base de datos

    const database = client.db('erikas_homemade'); // Usar el nombre correcto de la base de datos
    const collection = database.collection('pedidos');

    // Realizar operaciones con la colección...
    const pedidos = await collection.find({}).toArray(); // Ejemplo: Obtener todos los documentos

    // Renderizar la vista con datos
    res.render('pedidos', { pedidos });
  } catch (error) {
    console.error('Error al obtener datos de la base de datos:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close(); // Cerrar la conexión
  }
};

const getColeccion2Page = (req, res) => {
  // Lógica para obtener datos de la colección 2
  res.send('Página de la Colección 2');
};

const getColeccion3Page = (req, res) => {
  // Lógica para obtener datos de la colección 3
  res.send('Página de la Colección 3');
};

module.exports = { getPedidosPage, getColeccion2Page, getColeccion3Page };
