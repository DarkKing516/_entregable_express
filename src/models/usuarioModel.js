// src/models/usuarioModel.js
const { MongoClient, ObjectID } = require('mongodb');

const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const registrarUsuario = async (usuario) => {
  try {
    await client.connect();
    const database = client.db('erikas_homemade');
    const collection = database.collection('usuarios');
    const resultado = await collection.insertOne(usuario);
    return resultado;
  } finally {
    await client.close();
  }
};

const encontrarUsuarioPorCredenciales = async (email, password) => {
  try {
    await client.connect();
    const database = client.db('erikas_homemade');
    const collection = database.collection('usuarios');
    const usuario = await collection.findOne({ email, password });
    return usuario;
  } finally {
    await client.close();
  }
};

module.exports = { registrarUsuario, encontrarUsuarioPorCredenciales };
