// src/controllers/configuracionController.js
const { MongoClient } = require('mongodb');
const usuarioModel = require('../models/usuarioModel');
const { obtenerPermisosSegunRol } = require('../models/usuarioModel'); // Agrega esta línea para importar la función


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

    // Verificar si se seleccionó un rol específico
    if (!nuevoUsuario.rol) {
      // Si no se seleccionó un rol, asignar automáticamente el rol "cliente"
      nuevoUsuario.rol = 'cliente';
    }

    // Asignar los permisos correspondientes al rol (puedes adaptar esta lógica según tus necesidades)
    nuevoUsuario.permisos = obtenerPermisosSegunRol(nuevoUsuario.rol);

    await usuarioModel.registrarUsuario(nuevoUsuario);

    // Redirige directamente a index.ejs después del registro exitoso
    res.redirect('/');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send(`Error interno del servidor: ${error.message}`);
  }
};



const eliminarUsuario = async (req, res) => {
  const usuarioId = req.params.id;

  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const configuracionCollection = database.collection('configuracion');

    // Eliminar el usuario por ID
    await configuracionCollection.deleteOne({ _id: new ObjectId(usuarioId) });

    res.redirect('/configuracion');
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};





module.exports = { getConfiguracionPage, registrarUsuario, eliminarUsuario };


