// src/controllers/pedidosController.js
const { MongoClient } = require('mongodb');
const usuarioModel = require('../models/usuarioModel'); 

// Función para obtener datos de la colección de pedidos
const getConfiguracionPage = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect(); // Conectar a la base de datos

    const database = client.db('erikas_homemade'); // Usar el nombre correcto de la base de datos
    const configuracionCollection = database.collection('configuracion');

    // Realizar operaciones con las colecciones...
    const usuarios = await configuracionCollection.find({}).toArray(); // Obtener todos los usuarios

    // Renderizar la vista con datos
    res.render('configuracion', { usuarios });
  } catch (error) {
    console.error('Error al obtener datos de la base de datos:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close(); // Cerrar la conexión
  }
};

const registrarUsuario = async (req, res) => {
  const nuevoUsuario = req.body; // Asegúrate de tener las propiedades correctas en el body de la solicitud
  try {
    const resultado = await usuarioModel.registrarUsuario(nuevoUsuario);
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', resultado });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
};

module.exports = { getConfiguracionPage, registrarUsuario, usuarioModel };


