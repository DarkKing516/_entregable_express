// src/controllers/reservasController.js
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const PDFDocument = require('pdfkit');


// Función para obtener la fecha actual en formato 'YYYY-MM-DD'
const obtenerFechaActual = () => {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const day = fecha.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getReservasPage = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri);

  try {
    await client.connect(); // Conectar a la base de datos
    const database = client.db('erikas_homemade');
    const configuracionCollection = database.collection('configuracion');
    const reservasCollection = database.collection('gestion_reservas');

    // Obtener la lista de configuraciones para el menú desplegable
    const configuraciones = await configuracionCollection.find({}).toArray();
    // Obtener la lista de reservas
    const reservas = await reservasCollection.find({}).toArray();
    const reservasFormateadas = reservas.map(reserva => {
      return {
        ...reserva,
        fecha_creacion: reserva.fecha_creacion instanceof Date ? reserva.fecha_creacion.toISOString().split('T')[0] : reserva.fecha_creacion,
        fecha_reserva: reserva.fecha_reserva instanceof Date ? reserva.fecha_reserva.toISOString().split('T')[0] : reserva.fecha_reserva,
      };
    });

    // Renderizar la vista con datos
    res.render('reservas', { configuraciones, reservas: reservasFormateadas });
  } catch (error) {
    console.error('Error al obtener datos de la base de datos:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close(); // Cerrar la conexión
  }
};

const agregarReserva = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri);

  try {
    await client.connect(); // Conectar a la base de datos

    const database = client.db('erikas_homemade');
    const reservasCollection = database.collection('gestion_reservas');
    const configuracionCollection = database.collection('configuracion');

    // Obtener datos del formulario
    const {
      fechaReserva,
      estadoReserva,
      nombreCliente,
      telefonoCliente,
      // Otros campos que ingreses manualmente
    } = req.body;

    // Validar la fecha de reserva
    const fechaReservaObj = new Date(fechaReserva);
    const fechaActual = new Date();

    if (fechaReservaObj <= fechaActual) {
      return res.status(400).send('La fecha de reserva debe ser mayor a la fecha actual.');
    }

    // Obtener la configuración del cliente seleccionado
    const configuracionCliente = await configuracionCollection.findOne({ nombre: nombreCliente });

    // Validar si se encontró la configuración del cliente
    if (!configuracionCliente) {
      throw new Error('No se encontró la configuración para el cliente seleccionado');
    }

    // Crear la nueva reserva
    const nuevaReserva = {
      fecha_creacion: new Date(), // Utilizar la fecha actual al momento de la creación
      fecha_reserva: new Date(fechaReserva),
      estado_reserva: estadoReserva,
      nombre_cliente: nombreCliente,
      telefono_cliente: telefonoCliente,
      documento_cliente: configuracionCliente.documento,
      contraseña: configuracionCliente.contraseña,
      correo: configuracionCliente.correo,
      // Otros campos que ingreses manualmente
    };

    // Insertar la nueva reserva en la base de datos
    await reservasCollection.insertOne(nuevaReserva);

    res.redirect('/reservas'); // Redirigir a la página de reservas después de agregar la reserva
  } catch (error) {
    console.error('Error al agregar reserva:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close(); // Cerrar la conexión
  }
};


const eliminarReserva = async (req, res) => {
    const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
    const client = new MongoClient(uri);
  
    try {
      await client.connect(); // Conectar a la base de datos
  
      const database = client.db('erikas_homemade');
      const reservasCollection = database.collection('gestion_reservas');
  
      const reservaId = req.params.id; // Obtener el ID de la reserva desde los parámetros
  
      // Utilizar ObjectId directamente como una función
      await reservasCollection.deleteOne({ _id: new ObjectId(reservaId) });
  
      res.redirect('/reservas'); // Redirigir a la página de reservas después de eliminar la reserva
    } catch (error) {
      console.error('Error al eliminar reserva:', error);
      res.status(500).send('Error interno del servidor');
    } finally {
      await client.close(); // Cerrar la conexión
    }
};


const verDetalleEdicionReserva = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const reservasCollection = database.collection('gestion_reservas');

    const reservaId = req.params.id;

    // Obtener la información de la reserva a editar
    const reserva = await reservasCollection.findOne({ _id: new ObjectId(reservaId) });

    // Renderizar la vista de edición con la información de la reserva
    res.render('editarReserva', { reserva });
  } catch (error) {
    console.error('Error al obtener información de la reserva para editar:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};

const guardarEdicionReserva = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const reservasCollection = database.collection('gestion_reservas');

    const reservaId = req.params.id;
    const { fechaReserva, estadoReserva } = req.body;

    // Actualizar la reserva en la base de datos
    await reservasCollection.updateOne(
      { _id: new ObjectId(reservaId) },
      { $set: { fecha_reserva: fechaReserva, estado_reserva: estadoReserva } }
    );

    res.redirect('/reservas'); // Redirigir a la página de reservas después de guardar la edición
  } catch (error) {
    console.error('Error al guardar la edición de la reserva:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};


const generarPDFReservas = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const reservasCollection = database.collection('gestion_reservas');

    // Obtener todas las reservas
    const reservas = await reservasCollection.find({}).toArray();

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=reservas.pdf');
    doc.pipe(res);

    // Agregar contenido al PDF
    const fechaActual = new Date().toLocaleDateString();
    doc.moveDown();
    doc.fontSize(16).text(`Reporte de Reservas - Fecha: ${fechaActual}`, { align: 'center' });
    doc.moveDown();

    // Variable para el número de página
    let pageNumber = 1;

    reservas.forEach((reserva) => {
      // Agregar número de página y nombre de empresa en todas las páginas
      doc.moveDown();

      doc.fontSize(14).text(`Reserva ID: ${reserva._id}`, { underline: true });
      doc.moveDown();

      doc.fontSize(12).text(`Fecha Creación: ${reserva.fecha_creacion}`);
      doc.fontSize(12).text(`Fecha Reserva: ${reserva.fecha_reserva}`);
      doc.fontSize(12).text(`Total: ${reserva.total_reserva}`);
      doc.fontSize(12).text(`Estado: ${reserva.estado_reserva}`);
      doc.fontSize(12).text(`Cliente: ${reserva.nombre_cliente}`);
      doc.moveDown();

      // Agregar detalles de servicios, productos u otra información específica de tus reservas
      // ...

      doc.moveDown();
      doc.moveDown();

      // Incrementar número de página
      pageNumber++;

      // Agregar número de página y nombre de empresa en el footer
      const footerText = `Tu información de contacto o dirección`;
      doc.text(`Página ${pageNumber}`, { align: 'right', continued: true });
      const footerHeight = 20;
      doc.text(footerText, { align: 'left', width: 410, height: footerHeight, underline: true, lineGap: 5 });

      // Agregar salto de página si hay más reservas
      if (pageNumber <= reservas.length) {
        doc.addPage();
      }
    });

    // Finalizar y enviar el PDF
    doc.end();
  } catch (error) {
    console.error('Error al generar el PDF de reservas:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};




// Otras funciones necesarias...

module.exports = {
  getReservasPage,
  agregarReserva,
  eliminarReserva,
  verDetalleEdicionReserva,
  guardarEdicionReserva,
  generarPDFReservas,
  /* otras funciones */
};