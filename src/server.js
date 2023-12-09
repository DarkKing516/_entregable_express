// src/server.js
const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000;

// Configuración de middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Rutas
const routes = require('./routes');
app.use('/', routes);

// Ruta para la vista principal
app.get('/', (req, res) => {
  res.render('index');  // La vista 'index' debe estar en el directorio 'views'
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});