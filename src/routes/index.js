// src/routes/index.js
const express = require('express');
const router = express.Router();
const { getPedidosPage } = require('../controllers/pedidosController');
const { getConfiguracionPage, registrarUsuario, usuarioModel } = require('../controllers/configuracionController');
const { iniciarSesion, cerrarSesion } = require('../controllers/authController');

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










router.get('/configuracion', getConfiguracionPage);
router.post('/configuracion', registrarUsuario);










router.get('/pelos', getPedidosPage);










router.get('/murcia', getPedidosPage);

module.exports = router;
