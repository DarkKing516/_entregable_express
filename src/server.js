// src/server.js
const express = require('express');
const session = require('express-session'); // Importa express-session
const app = express();
const path = require('path');

const PORT = 3000;

// Configuración de middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configuración de express-session
app.use(
  session({
    secret: 'miClaveSecreta', // Puedes cambiar esto a una cadena más segura
    resave: false,
    saveUninitialized: true
  })
);

// Middleware para pasar información del usuario autenticado a las vistas
app.use((req, res, next) => {
  // Supongamos que la información del usuario autenticado se encuentra en req.session.usuario
  res.locals.usuarioAutenticado = req.session.usuario;
  next();
});

// Rutas
const routes = require('./routes');
app.use('/', routes);

// Ruta para la vista principal
app.get('/', (req, res) => {
  res.render('index'); // La vista 'index' debe estar en el directorio 'views'
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
