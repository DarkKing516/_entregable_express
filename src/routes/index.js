// src/routes/index.js
const express = require('express');
const router = express.Router();
const { getPedidosPage } = require('../controllers/pedidosController');
const { getVentasPage, agregarVenta } = require('../controllers/ventasController');
const { registrarUsuario, iniciarSesion, cerrarSesion } = require('../controllers/authController');

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










router.get('/danilo', getPedidosPage);










router.get('/pelos', getVentasPage);
router.post('/agregarVentas', agregarVenta)










router.get('/murcia', getPedidosPage);

module.exports = router;
