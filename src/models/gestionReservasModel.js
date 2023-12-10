// models/gestionReservasModel.js
const mongoose = require('mongoose');

const gestionReservasSchema = new mongoose.Schema({
  fecha_creacion: Date,
  fecha_reserva: Date,
  estado_reserva: String,
  nombre_cliente: String,
  telefono_cliente: String,
  documento_cliente: String,
  contrasena: String,
  correo: String,
}, { collection: 'gestion_reservas' });

const GestionReservas = mongoose.model('GestionReservas', gestionReservasSchema);

module.exports = GestionReservas;
