// src/models/usuarioModel.js
const { MongoClient, ObjectId } = require('mongodb');


const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const registrarUsuario = async (usuario) => {
  try {
    await client.connect();
    const database = client.db('erikas_homemade');
    const collection = database.collection('configuracion');

    // Por defecto, asignar permisos al rol "cliente"
    const rolCliente = await collection.findOne({ 'rol.nombre_rol': 'cliente' });

    // Verificar si se encontró el rol "cliente" antes de acceder a las propiedades
    if (rolCliente) {
      usuario.permisos = rolCliente.permisos;
    } else {
      console.error('No se encontró el rol "cliente" en la base de datos.');
      // Puedes manejar este caso según tus necesidades
    }

    const resultado = await collection.insertOne(usuario);
    return resultado;
  } finally {
    await client.close();
  }
};


const encontrarUsuarioPorCredenciales = async (correo, contraseña) => {
  try {
    await client.connect();
    const database = client.db('erikas_homemade');
    const collection = database.collection('configuracion');
    const usuario = await collection.findOne({ correo, contraseña });
    return usuario;
  } finally {
    await client.close();
  }
};

const eliminarUsuario = async (userId) => {
  console.log(`Intentando eliminar usuario con ID: ${userId}`);
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const configuracionCollection = database.collection('configuracion');

    const result = await configuracionCollection.deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 1) {
      console.log('Resultado de la eliminación:', result);
      return true;
    } else {
      console.log(`Usuario con ID ${userId} no encontrado`);
      return false;
    }
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    throw error;
  } finally {
    await client.close();
  }
};


module.exports = { registrarUsuario, encontrarUsuarioPorCredenciales, eliminarUsuario};
