// src/routes/index.js
const express = require('express');
const router = express.Router();
const { getPedidosPage, agregarPedido, verDetallePedido, eliminarPedido, editarPedido } = require('../controllers/pedidosController'); // Asegúrate de tener el controlador necesario
const { getVentasPage, agregarVenta, eliminarVenta, actualizarVentas, obtenerDatosVenta} = require('../controllers/ventasController');
const { getConfiguracionPage } = require('../controllers/configuracionController');
const { registrarUsuario, iniciarSesion, cerrarSesion } = require('../controllers/authController');
const { getReservasPage, agregarReserva, eliminarReserva, actualizarReserva, obtenerDetallesReserva } = require('../controllers/reservasController');


// Rutas
router.get('/', (req, res) => {
  res.render('index');
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
router.post('/editarPedido/:id', editarPedido);


router.get('/configuracion', getConfiguracionPage);










router.get('/pelos', getVentasPage);
router.post('/agregarVenta', agregarVenta)
router.post('/eliminarVenta/:id', eliminarVenta);
router.get('/editarVenta/:id', obtenerDatosVenta);
router.post('/actualizarVenta/:id', actualizarVentas);










router.get('/reservas', getReservasPage);
router.post('/agregarReserva', agregarReserva); // Agrega esta línea para manejar las solicitudes POST para agregar reservas
router.delete('/eliminarReserva/:id', eliminarReserva);
router.get('/obtenerDetallesReserva/:id', obtenerDetallesReserva);
router.put('/actualizarReserva/:id', actualizarReserva);


module.exports = router;
