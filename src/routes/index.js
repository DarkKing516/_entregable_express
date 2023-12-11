// src/routes/index.js
const express = require('express');
const router = express.Router();

const usuarioModel = require('../models/usuarioModel'); 
const { getPedidosPage, agregarPedido, verDetallePedido, eliminarPedido } = require('../controllers/pedidosController');
const { getConfiguracionPage, registrarUsuario, eliminarUsuario} = require('../controllers/configuracionController');
const { iniciarSesion, cerrarSesion } = require('../controllers/authController');
const { getVentasPage, agregarVenta } = require('../controllers/ventasController');
const { getReservasPage, agregarReserva, eliminarReserva } = require('../controllers/reservasController');

// Rutas
router.get('/', (req, res) => {
  res.render('index');
});

router.post('/configuracion', async (req, res) => {
  const nuevoUsuario = req.body;
  try {
    const resultado = await usuarioModel.registrarUsuario(nuevoUsuario);
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', resultado });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});


router.get('/signin', (req, res) => {
  // Si el usuario ya ha iniciado sesión, redirige a la página principal
  if (res.locals.usuarioAutenticado) {
    res.redirect('/');
  } else {
    res.render('signin');
  }
});

router.get('/signup', (req, res) => {
  // Si el usuario ya ha iniciado sesión, redirige a la página principal
  if (res.locals.usuarioAutenticado) {
    res.redirect('/');
  } else {
    res.render('signup');
  }
});

// Registro, inicio y cierre de sesión
router.post('/signup', registrarUsuario);
router.post('/signin', iniciarSesion);
router.get('/signout', cerrarSesion); // Ruta para cerrar sesión

router.get('/pedidos', getPedidosPage);
router.post('/agregarPedido', agregarPedido);
router.get('/pedido/:id', verDetallePedido);
router.get('/eliminarPedido/:id', eliminarPedido);



router.get('/configuracion', getConfiguracionPage);
router.post('/registrarUsuario', registrarUsuario);
router.delete('/eliminarUsuario/:id', eliminarUsuario);











router.get('/pelos', getVentasPage);
router.post('/agregarVenta', agregarVenta)










router.get('/reservas', getReservasPage);
router.post('/agregarReserva', agregarReserva); // Agrega esta línea para manejar las solicitudes POST para agregar reservas
router.delete('/eliminarReserva/:id', eliminarReserva);

module.exports = router;
