// src/routes/index.js
const express = require('express');
const router = express.Router();
const { getPedidosPage, getColeccion2Page, getColeccion3Page } = require('../controllers/pedidosController');

// Rutas
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/signin', (req, res) => {res.render('signin');});
router.get('/signup', (req, res) => {res.render('signup');});
router.get('/pedidos', getPedidosPage);
router.get('/coleccion2', getColeccion2Page);
router.get('/coleccion3', getColeccion3Page);

module.exports = router;