// src/models/usuarioModel.js
const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Función para obtener los permisos según el rol
function obtenerPermisosSegunRol(rol) {
  switch (rol) {
    case 'cliente':
      return [
        { nombre_permiso: 'acceder al sistema', estado_permiso: true },
        { nombre_permiso: 'cerrar sesión', estado_permiso: true },
        { nombre_permiso: 'recuperar mi contraseña', estado_permiso: true },
        { nombre_permiso: 'Crear un pedido', estado_permiso: true },
        { nombre_permiso: 'ver los pedidos', estado_permiso: true },
        { nombre_permiso: 'Buscar un pedido', estado_permiso: true },
        { nombre_permiso: 'Asociar un producto o servicio al detalle pedido', estado_permiso: true },
        { nombre_permiso: 'Agregar mi registro', estado_permiso: true },
        { nombre_permiso: 'Modificar algunos datos del registro', estado_permiso: true },
        { nombre_permiso: 'Cambiar el estado de mi perfil a habilitado y deshabilitado', estado_permiso: true },
        { nombre_permiso: 'Agregar el registro de nuevos clientes', estado_permiso: true },
        { nombre_permiso: 'listar todos los clientes', estado_permiso: true },
        { nombre_permiso: 'buscar los clientes', estado_permiso: true },
        { nombre_permiso: 'modificar la info de los clientes', estado_permiso: true },
        { nombre_permiso: 'Cambiar el estado de los registros a habilitado y deshabilitado', estado_permiso: true },
        { nombre_permiso: 'Agendar una nueva cita', estado_permiso: true },
        { nombre_permiso: 'Listar mis citas agendadas', estado_permiso: true },
        { nombre_permiso: 'Buscar mis citas agendadas', estado_permiso: true },
        { nombre_permiso: 'Editar mis citas', estado_permiso: true },
        { nombre_permiso: 'Anular mis citas', estado_permiso: true },
      ];
    case 'administrador':
      return [
        { nombre_permiso: 'crear un nuevo rol', estado_permiso: true },
        { nombre_permiso: 'listar roles', estado_permiso: true },
        { nombre_permiso: 'ver permisos asociados a un rol', estado_permiso: true },
        { nombre_permiso: 'buscar permisos asociados a un rol', estado_permiso: true },
        { nombre_permiso: 'actualizar los roles', estado_permiso: true },
        { nombre_permiso: 'eliminar un rol', estado_permiso: true },
        { nombre_permiso: 'asociar permisos a un rol', estado_permiso: true },
        { nombre_permiso: 'desasociar un Permiso de un Rol', estado_permiso: true },
        { nombre_permiso: 'crear un nuevo usuario', estado_permiso: true },
        { nombre_permiso: 'listar usuarios', estado_permiso: true },
        { nombre_permiso: 'ver usuarios', estado_permiso: true },
        { nombre_permiso: 'buscar usuarios', estado_permiso: true },
        { nombre_permiso: 'actualizar la información', estado_permiso: true },
        { nombre_permiso: 'eliminar un usuario', estado_permiso: true },
        { nombre_permiso: 'acceder al sistema', estado_permiso: true },
        { nombre_permiso: 'cerrar sesión', estado_permiso: true },
        { nombre_permiso: 'recuperar mi contraseña', estado_permiso: true },
        { nombre_permiso: 'Crear un nuevo servicio', estado_permiso: true },
        { nombre_permiso: 'ver los servicios', estado_permiso: true },
        { nombre_permiso: 'buscar los servicios', estado_permiso: true },
        { nombre_permiso: 'Editar un servicio', estado_permiso: true },
        { nombre_permiso: 'cambiar el estado de un servicio', estado_permiso: true },
        { nombre_permiso: 'cambiar el estado del catalogo de un servicio', estado_permiso: true },
        { nombre_permiso: 'Asociar un tipo de servicio a un servicio', estado_permiso: true },
        { nombre_permiso: 'Ver los productos', estado_permiso: true },
        { nombre_permiso: 'Agregar los productos', estado_permiso: true },
        { nombre_permiso: 'Editar los productos', estado_permiso: true },
        { nombre_permiso: 'Deshabilitar/ Habilitar los productos', estado_permiso: true },
        { nombre_permiso: 'Buscar los productos', estado_permiso: true },
        { nombre_permiso: 'Asociar un tipo de producto a un producto', estado_permiso: true },
        { nombre_permiso: 'Crear los tipos de producto', estado_permiso: true },
        { nombre_permiso: 'Listar los tipos de productos', estado_permiso: true },
        { nombre_permiso: 'Editar un tipo de producto', estado_permiso: true },
        { nombre_permiso: 'Eliminar un tipo de producto', estado_permiso: true },
        { nombre_permiso: 'Crear un nuevo tipo de servicio', estado_permiso: true },
        { nombre_permiso: 'ver los tipos de servicios', estado_permiso: true },
        { nombre_permiso: 'buscar los tipos de servicios', estado_permiso: true },
        { nombre_permiso: 'Editar un tipo de servicio', estado_permiso: true },
        { nombre_permiso: 'Crear los pedidos', estado_permiso: true },
        { nombre_permiso: 'ver los pedidos', estado_permiso: true },
        { nombre_permiso: 'Buscar los pedidos', estado_permiso: true },
        { nombre_permiso: 'actualizar el estado', estado_permiso: true },
        { nombre_permiso: 'Asociar un pedido a un cliente', estado_permiso: true },
        { nombre_permiso: 'Asociar un producto o servicio al detalle pedido', estado_permiso: true },
        { nombre_permiso: 'Anular un pedido', estado_permiso: true },
        { nombre_permiso: 'Crear un pedido', estado_permiso: true },
        { nombre_permiso: 'ver los pedidos', estado_permiso: true },
        { nombre_permiso: 'Buscar un pedido', estado_permiso: true },
        { nombre_permiso: 'Asociar un producto o servicio al detalle pedido', estado_permiso: true },
        { nombre_permiso: 'Generar informe de ventas', estado_permiso: true },
        { nombre_permiso: 'Ver estadisticas de las ventas', estado_permiso: true },
        { nombre_permiso: 'Agregar ventas', estado_permiso: true },
        { nombre_permiso: 'Buscar ventas', estado_permiso: true },
        { nombre_permiso: 'Listar ventas', estado_permiso: true },
        { nombre_permiso: 'Ver las compras', estado_permiso: true },
        { nombre_permiso: 'Buscar las compras', estado_permiso: true },
        { nombre_permiso: 'Agregar mi registro', estado_permiso: true },
        { nombre_permiso: 'listar la informacion de mi perfil', estado_permiso: true },
        { nombre_permiso: 'Modificar algunos datos del registro', estado_permiso: true },
        { nombre_permiso: 'Cambiar el estado de mi perfil a habilitado y deshabilitado', estado_permiso: true },
        { nombre_permiso: 'Agregar el registro de nuevos clientes', estado_permiso: true },
        { nombre_permiso: 'listar todos los clientes', estado_permiso: true },
        { nombre_permiso: 'buscar los clientes', estado_permiso: true },
        { nombre_permiso: 'modificar la info de los clientes', estado_permiso: true },
        { nombre_permiso: 'Cambiar el estado de los registros a habilitado y deshabilitado', estado_permiso: true },
        { nombre_permiso: 'Agendar una nueva cita', estado_permiso: true },
        { nombre_permiso: 'Listar mis citas agendadas', estado_permiso: true },
        { nombre_permiso: 'Buscar mis citas agendadas', estado_permiso: true },
        { nombre_permiso: 'Editar mis citas', estado_permiso: true },
        { nombre_permiso: 'Anular mis citas', estado_permiso: true },
        { nombre_permiso: 'Agendar citas a los clientes', estado_permiso: true },
        { nombre_permiso: 'Listar todas las citas del aplicativo', estado_permiso: true },
        { nombre_permiso: 'Buscar todas las citas del aplicativo', estado_permiso: true },
        { nombre_permiso: 'Editar las citas del aplicativo', estado_permiso: true },
        { nombre_permiso: 'Anular las citas del aplicativo', estado_permiso: true },
        // ... Agregar más permisos según sea necesario
      ];
    default:
      return [];
  }
}

const registrarUsuario = async (usuario) => {
  try {
    await client.connect();
    const database = client.db('erikas_homemade');
    const collection = database.collection('configuracion');

    // Asignar permisos al usuario según el rol
    usuario.permisos = obtenerPermisosSegunRol(usuario.rol);

    const resultado = await collection.insertOne(usuario);
    return resultado;
  } finally {
    await client.close();
  }
};

const encontrarUsuarioPorCredenciales = async (correo, contraseña) => {
  try {
    await client.connect();
    const database = client.db('erikas_homemade');
    const collection = database.collection('configuracion');
    const usuario = await collection.findOne({ correo, contraseña });
    return usuario;
  } finally {
    await client.close();
  }
};

module.exports = { registrarUsuario, encontrarUsuarioPorCredenciales, obtenerPermisosSegunRol };
