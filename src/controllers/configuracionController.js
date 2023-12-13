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
  const nuevosPermisos = req.body.permisos;

  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('erikas_homemade');
    const configuracionCollection = database.collection('configuracion');

    // Obtener la configuración por ID
    const configuracion = await configuracionCollection.findOne({ _id: new ObjectId(configuracionId) });

    if (!configuracion) {
      return res.status(404).json({ mensaje: 'Configuración no encontrada' });
    }

    // Actualizar permisos existentes
    configuracion.permisos.forEach(usuarioPermiso => {
      const nuevoPermiso = nuevosPermisos.find(np => np.nombre_permiso === usuarioPermiso.nombre_permiso);

      if (nuevoPermiso) {
        // Si el nuevoPermiso está presente, actualizar el estado, de lo contrario, establecer en 'false'
        usuarioPermiso.estado_permiso = nuevoPermiso.estado_permiso || false;
      } else {
        // Si no se encuentra el nuevoPermiso, establecer en 'false'
        usuarioPermiso.estado_permiso = false;
      }
    });

    // Actualizar el documento en la base de datos
    await configuracionCollection.updateOne({ _id: new ObjectId(configuracionId) }, { $set: { permisos: configuracion.permisos } });

    return res.status(200).json({ mensaje: 'Permisos actualizados con éxito' });
  } catch (error) {
    console.error('Error al actualizar permisos:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
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



