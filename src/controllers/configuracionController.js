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


const actualizarUsuarios = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const usuariosCollection = database.collection('configuracion');

    const usuarioId = req.params.id; // ID del usuario que se desea editar
    const { nombre, correo, telefono, documento, estado_usuario } = req.body; // Datos actualizados del usuario desde el cuerpo de la solicitud

    console.log('Datos recibidos para actualizar:', req.body);

    const result = await usuariosCollection.updateOne(
      { _id: new ObjectId(usuarioId) },
      {
        $set: {
          nombre,
          correo,
          telefono,
          documento,
          estado_usuario
        },
      }
    );

    console.log('Resultado de la actualización:', result);

    if (result.matchedCount === 0) {
      console.log('El usuario no fue encontrado o no se actualizó');
      res.status(404).send('El usuario no fue encontrado o no se actualizó');
      return;
    }

    res.redirect('/configuracion');
    console.log('Usuario actualizado correctamente');
  } catch (error) {
    console.error('Error al editar el usuario:', error);
    res.status(500).send(`Error interno del servidor al editar el usuario: ${error}`);
  } finally {
    await client.close();
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
  const nuevosPermisos = req.body.permisos || []; // Asegúrate de manejar correctamente el caso en el que no se envíen permisos

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
      const nuevoPermiso = nuevosPermisos.find(np => np === usuarioPermiso.nombre_permiso);
      usuarioPermiso.estado_permiso = nuevoPermiso ? true : false;
    });

    // Actualizar el documento en la base de datos
    await configuracionCollection.updateOne({ _id: new ObjectId(configuracionId) }, { $set: { permisos: configuracion.permisos } });

    return res.redirect('/configuracion');
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

    // Eliminar el configuracion por I
    await configuracionCollection.deleteOne({ _id: new ObjectId(configuracionId) });

    res.redirect('/configuracion'); // Redirigir a la página de configuracion después de eliminar
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};

const obtenerDatosUsuario = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const configuracionCollection = database.collection('configuracion');

    const usuarioId = req.params.id; // ID del usuario que se desea editar

    // Obtener los datos del usuario específico
    const usuario = await configuracionCollection.findOne({ _id: new ObjectId(usuarioId) });

    if (!usuario) {
      console.log('Usuario no encontrado');
      res.status(404).send('Usuario no encontrado');
      return;
    }

    // Redirigir a la página de edición con los datos del usuario
    res.render('editarUsuario', { usuario }); // 'editarUsuario' es el nombre de tu vista
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).send('Error interno del servidor al obtener los datos del usuario');
  } finally {
    await client.close();
  }
};



module.exports = { getConfiguracionPage, registrarUsuario, actualizarUsuarios, verPermisos, actualizarPermisos, eliminarUsuario, obtenerDatosUsuario };



