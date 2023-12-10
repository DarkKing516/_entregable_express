const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const registrarVenta = async (ventaInfo) => {
  try {
    await client.connect();
    const database = client.db('erikas_homemade');
    const collection = database.collection('ventas');
    const resultado = await collection.insertOne(ventaInfo);
    return resultado;
  } finally {
    await client.close();
  }
};

const encontrarVentasPorCliente = async (correoCliente) => {
  try {
    await client.connect();
    const database = client.db('erikas_homemade');
    const collection = database.collection('ventas');
    const ventasCliente = await collection.find({ correo: correoCliente }).toArray();
    return ventasCliente;
  } finally {
    await client.close();
  }
};

module.exports = { registrarVenta, encontrarVentasPorCliente };
