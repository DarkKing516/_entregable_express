// src/controllers/configuracionController.js
const { MongoClient } = require('mongodb');
const usuarioModel = require('../models/usuarioModel');

// Función para obtener datos de la colección de configuracion
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
  try {
    const nuevoUsuario = req.body;

    // Asignar rol "cliente" y permisos asociados
    nuevoUsuario.rol = [{ nombre_rol: 'cliente' }];
    nuevoUsuario.permisos = [
      { nombre_permiso: 'ver mi perfil', estado_permiso: true },
      // Otros permisos asociados al rol "cliente"
    ];

    await usuarioModel.registrarUsuario(nuevoUsuario);

    // Redirige directamente a index.ejs después del registro exitoso
    res.redirect('/');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
};


const eliminarUsuario = async (req, res) => {
  const userId = req.params.id;

  try {
    const resultado = await usuarioModel.eliminarUsuario(userId);
    res.json({ success: true, resultado });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};





module.exports = { getConfiguracionPage, registrarUsuario, eliminarUsuario };


