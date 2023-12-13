// src/controllers/authController.js
const usuarioModel = require('../models/usuarioModel');

// const registrarUsuario = async (req, res) => {
//   try {
//     const nuevoUsuario = req.body;

//     // Asignar rol "cliente" y permisos asociados
//     nuevoUsuario.rol = [{ nombre_rol: 'cliente' }];
//     nuevoUsuario.permisos = [
//       { nombre_permiso: 'ver_mi_perfil', estado_permiso: true },
//       // Otros permisos asociados al rol "cliente"
//     ];

//     const resultado = await usuarioModel.registrarUsuario(nuevoUsuario);
//     res.redirect('/'); // Redirige al index después de un registro exitoso
//   } catch (error) {
//     console.error('Error al registrar usuario:', error);
//     res.status(500).send('Error interno del servidor');
//   }
// };

const iniciarSesion = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const usuario = await usuarioModel.encontrarUsuarioPorCredenciales(correo, contraseña);

    if (usuario) {
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

module.exports = {iniciarSesion, cerrarSesion };
