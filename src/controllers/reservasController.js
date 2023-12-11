// src/controllers/reservasController.js
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

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

    // Renderizar la vista con datos
    res.render('reservas', { configuraciones, reservas });
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

    // Obtener la configuración del cliente seleccionado
    const configuracionCliente = await configuracionCollection.findOne({ nombre: nombreCliente });

    // Validar si se encontró la configuración del cliente
    if (!configuracionCliente) {
      throw new Error('No se encontró la configuración para el cliente seleccionado');
    }

    // Crear la nueva reserva
    const nuevaReserva = {
      fecha_creacion: obtenerFechaActual(),
      fecha_reserva: fechaReserva,
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
// Otras funciones necesarias...

module.exports = { getReservasPage, agregarReserva, eliminarReserva /* otras funciones */ };
