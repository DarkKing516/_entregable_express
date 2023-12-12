// src/controllers/authController.js
const usuarioModel = require('../models/usuarioModel');

const registrarUsuario = async (req, res) => {
  try {
    const usuario = req.body;
    const resultado = await usuarioModel.registrarUsuario(usuario);
    res.redirect('/');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
};

const iniciarSesion = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const usuario = await usuarioModel.encontrarUsuarioPorCredenciales(correo, contraseña);
    if (usuario) {
      // Almacena información de usuario en la sesión
      req.session.usuario = usuario;
      res.redirect('/');
    } else {
      res.status(401).send('Credenciales incorrectas');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send('Error interno del servidor');
  }
};

const cerrarSesion = (req, res) => {
  // Elimina la información del usuario de la sesión al cerrar sesión
  req.session.usuario = null;
  res.redirect('/');
};

module.exports = { registrarUsuario, iniciarSesion, cerrarSesion };
