// src/controllers/pedidosController.js
const { MongoClient } = require('mongodb');

// Función para obtener datos de la colección de pedidos
const getPedidosPage = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect(); // Conectar a la base de datos

    const database = client.db('erikas_homemade'); // Usar el nombre correcto de la base de datos
    const pedidosCollection = database.collection('pedidos');
    const usuariosCollection = database.collection('configuracion');

    // Realizar operaciones con las colecciones...
    const pedidos = await pedidosCollection.find({}).toArray(); // Ejemplo: Obtener todos los documentos
    const usuarios = await usuariosCollection.find({}).toArray(); // Obtener todos los usuarios

    // Renderizar la vista con datos
    res.render('pedidos', { pedidos, usuarios });
  } catch (error) {
    console.error('Error al obtener datos de la base de datos:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close(); // Cerrar la conexión
  }
};

module.exports = { getPedidosPage };
