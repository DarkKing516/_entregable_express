// src/controllers/configuracionController.js
const { MongoClient, ObjectId } = require('mongodb');
const usuarioModel = require('../models/usuarioModel');
const { obtenerPermisosSegunRol } = require('../models/usuarioModel');


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
    if (!nuevoUsuario.estado_usuario) {
      nuevoUsuario.estado_usuario = 'Activo';
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

const verPermisos = async (req, res) => {
  const configuracionId = req.params.id;

  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const configuracionCollection = database.collection('configuracion');

    // Obtener el pedido por ID
    const configuracion = await configuracionCollection.findOne({ _id: new ObjectId(configuracionId) });

    if (!configuracion) {
      // Manejar el caso en el que los permisos no se encuentren
      res.status(404).send('Permisos no encontrados');
      return;
    }

    // Renderizar la vista con detalles del configuracion
    res.render('permisos', { configuracion });
  } catch (error) {
    console.error('Error al obtener los permisos:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};

const actualizarPermisos = async (req, res) => {
  const configuracionId = req.params.id;
  const nuevosPermisos = req.body.permisos || [];

  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const configuracionCollection = database.collection('configuracion');

    // Obtener los permisos actuales del usuario
    const usuario = await configuracionCollection.findOne({ _id: new ObjectId(configuracionId) });
    const permisosActuales = usuario.permisos || [];

    // Filtrar solo los permisos seleccionados que existen en la base de datos
    const permisosSeleccionados = nuevosPermisos.filter(id => permisosActuales.includes(id));

    // Actualizar los permisos del usuario
    await configuracionCollection.updateOne(
      { _id: new ObjectId(configuracionId) },
      { $set: { permisos: permisosSeleccionados.map(id => ObjectId(id)) } }
    );

    res.redirect('/configuracion'); // Redirigir a la página de configuracion después de actualizar permisos
  } catch (error) {
    console.error('Error en actualizarPermisos:', error);
    res.status(500).send(`Error interno del servidor: ${error.message}`);
  } finally {
    await client.close();
  }
};



const eliminarUsuario = async (req, res) => {
  const configuracionId = req.params.id;

  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const configuracionCollection = database.collection('configuracion');

    // Eliminar el configuracion por ID
    await configuracionCollection.deleteOne({ _id: new ObjectId(configuracionId) });

    res.redirect('/configuracion'); // Redirigir a la página de configuracion después de eliminar
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};

module.exports = { getConfiguracionPage, registrarUsuario, verPermisos, actualizarPermisos, eliminarUsuario };



