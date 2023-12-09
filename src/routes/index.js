// src/routes/index.js
const express = require('express');
const router = express.Router();
const { getPedidosPage, getColeccion2Page, getColeccion3Page } = require('../controllers/pedidosController');
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
router.get('/coleccion2', getColeccion2Page);
router.get('/coleccion3', getColeccion3Page);

module.exports = router;
