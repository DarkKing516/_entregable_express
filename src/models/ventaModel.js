const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';

const registrarVenta = async (ventaInfo) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('erikas_homemade');
    const collection = database.collection('ventas');
    const resultado = await collection.insertOne(ventaInfo);
    return resultado;
  } catch (error) {
    throw new Error('Error al registrar la venta:', error);
  } finally {
    await client.close();
  }
};

const encontrarVentasPorCliente = async (correoCliente) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('erikas_homemade');
    const collection = database.collection('ventas');
    const ventasCliente = await collection.find({ correo: correoCliente }).toArray();
    return ventasCliente;
  } catch (error) {
    throw new Error('Error al encontrar ventas por cliente:', error);
  } finally {
    await client.close();
  }
};

module.exports = { registrarVenta, encontrarVentasPorCliente };
