// src/controllers/configuracionController.js
const { MongoClient, ObjectId } = require('mongodb');
const usuarioModel = require('../models/usuarioModel');
const PDFDocument = require('pdfkit');
const fs = require('fs');
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


const agregarUsuario = async (req, res) => {
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
    res.redirect('/configuracion');
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

    const usuarioId = req.params.id;
    const { nombre, correo, telefono, documento, estado_usuario, rol } = req.body;

    const nuevosPermisos = obtenerPermisosSegunRol(rol);

    const result = await usuariosCollection.updateOne(
      { _id: new ObjectId(usuarioId) },
      {
        $set: {
          nombre,
          correo,
          telefono,
          documento,
          estado_usuario,
          rol,
          permisos: nuevosPermisos, // Actualizar los permisos según el nuevo rol
        },
      }
    );

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


const generarReportePDF = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const configuracionCollection = database.collection('configuracion');

    // Obtener todas las ventas
    const usuarios = await configuracionCollection.find({}).toArray();

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();

    // Crear un buffer para el PDF
    const buffer = await new Promise((resolve, reject) => {
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', error => reject(error));

      // Agregar contenido al PDF
      let pageNumber = 1;

      usuarios.forEach((usuario, index) => {
        if (index > 0) {
          doc.addPage();
          pageNumber++;
        }

        doc.fontSize(16).text('Reporte de usuarios', { align: 'center' });
        doc.moveDown();

        doc.fontSize(14).text(`Usuario ID: ${usuario._id}`, { underline: true });
        doc.moveDown();

        doc.fontSize(12).text(`Rol: ${usuario.rol}`);
        doc.fontSize(12).text(`Nombre: ${usuario.nombre}`);
        doc.fontSize(12).text(`Correo: ${usuario.correo}`);
        doc.fontSize(12).text(`Teléfono: ${usuario.telefono}`);
        doc.fontSize(12).text(`Documento: ${usuario.documento}`);
        doc.fontSize(12).text(`Contraseña: ${'*'.repeat(usuario.contraseña.length)}`);
        doc.fontSize(12).text(`Estado: ${usuario.estado_usuario}`);
        doc.fontSize(13).text(`Permisos:`);
        // Ajustar la posición inicial de las columnas
        let columnX1 = 65;
        let columnX2 = 300;
        let currentColumn = columnX1;

        if (usuario.permisos && usuario.permisos.length > 0) {
          usuario.permisos.forEach(permiso => {
            // Alternar entre las dos columnas
            doc.fontSize(10).text(`- ${permiso.nombre_permiso}`, currentColumn);
            currentColumn = (currentColumn === columnX1) ? columnX2 : columnX1;
          });
        } else {
          doc.fontSize(12).text(`No hay permisos asignados`);
        }
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();

        // Pie de página con la información de la empresa y el paginado
        doc.fontSize(10).text('Erika\'s Homemade - Calle 84 numero 57-31', { align: 'left' });
        doc.fontSize(8).text(`Página ${pageNumber}`, { align: 'right' });

        doc.moveDown();
        doc.moveDown();
      });

      // Finalizar el documento PDF
      doc.end();
    });

    // Configurar encabezados y enviar el buffer como respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=informe.pdf');
    res.send(buffer);

  } catch (error) {
    console.error('Error al generar el PDF de usuarios:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};


module.exports = { getConfiguracionPage, agregarUsuario, actualizarUsuarios, verPermisos, actualizarPermisos, eliminarUsuario, obtenerDatosUsuario, generarReportePDF };



