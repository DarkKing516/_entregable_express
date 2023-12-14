// src/controllers/pedidosController.js
const { MongoClient, ObjectId } = require('mongodb');

// Función para obtener datos de la colección de pedidos
const getPedidosPage = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect(); // Conectar a la base de datos

    const database = client.db('erikas_homemade');
    const pedidosCollection = database.collection('pedidos');
    const usuariosCollection = database.collection('configuracion');

    // Realizar operaciones con las colecciones...
    const pedidos = await pedidosCollection.find({}).toArray();
    const usuarios = await usuariosCollection.find({}).toArray();

    // Renderizar la vista con datos
    res.render('pedidos', { pedidos, usuarios, fechaActual: obtenerFechaActual() });
  } catch (error) {
    console.error('Error al obtener datos de la base de datos:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close(); // Cerrar la conexión
  }
};

// Función para obtener la fecha actual en formato 'YYYY-MM-DD'
const obtenerFechaActual = () => {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const day = fecha.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const agregarPedido = async (req, res) => {
  // Obtener servicios y productos del cuerpo de la solicitud
  console.log('Datos de servicios:', req.body.servicios);

  const servicios = req.body.servicios ? JSON.parse(req.body.servicios) : [];
  const productos = req.body.productos ? JSON.parse(req.body.productos) : [];

  // Calcular total y subtotales
  let totalPedido = 0;

  const serviciosConSubtotales = servicios.map(servicio => {
    const cantidad = parseInt(servicio.cantidadServicio);
    const precio = parseFloat(servicio.precioServicio);
    const subtotal = cantidad * precio;

    // Update tipoServicio field to include tipoServicio and estadoTipoServicio
    const tipoServicio = {
      tipoServicio: servicio.tipoServicio,
      estadoTipoServicio: servicio.estadoTipoServicio,
    };

    totalPedido += subtotal;

    return { ...servicio, tipoServicio, subtotal };
  });

  const productosConSubtotales = productos.map(producto => {
    const cantidad = parseInt(producto.cantidadProducto);
    const precio = parseFloat(producto.precioProducto);
    const subtotal = cantidad * precio;

    // Update tipoProducto field to include tipoProducto and estadoTipoProducto
    const tipoProducto = {
      tipoProducto: producto.tipoProducto,
      estadoTipoProducto: producto.estadoTipoProducto,
    };

    totalPedido += subtotal;

    return { ...producto, tipoProducto, subtotal };
  });

  // Crear el objeto del pedido con servicios y productos
  const pedido = {
    servicios: serviciosConSubtotales,
    productos: productosConSubtotales,
    fecha_creacion: obtenerFechaActual(),
    fecha_pedido: req.body.fechaPedido,
    total_pedido: totalPedido,
    estado_pedido: 'por hacer',
    nombre_usuario: req.body.nombreUsuario,
  };

  // Insertar el pedido en la base de datos
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const pedidosCollection = database.collection('pedidos');

    await pedidosCollection.insertOne(pedido);

    res.redirect('/pedidos'); // Redirigir a la página de pedidos o donde sea necesario
  } catch (error) {
    console.error('Error al insertar el pedido en la base de datos:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};


const verDetallePedido = async (req, res) => {
  const pedidoId = req.params.id;

  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const pedidosCollection = database.collection('pedidos');
    const usuariosCollection = database.collection('configuracion');
    const usuarios = await usuariosCollection.find({}).toArray();


    // Obtener el pedido por ID
    const pedido = await pedidosCollection.findOne({ _id: new ObjectId(pedidoId) });

    if (!pedido) {
      // Manejar el caso en el que el pedido no se encuentre
      res.status(404).send('Pedido no encontrado');
      return;
    }

    // Renderizar la vista con detalles del pedido
    res.render('detallePedido', { pedido, usuarios });
  } catch (error) {
    console.error('Error al obtener el detalle del pedido:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};


const eliminarPedido = async (req, res) => {
  const pedidoId = req.params.id;

  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const pedidosCollection = database.collection('pedidos');

    // Eliminar el pedido por ID
    await pedidosCollection.deleteOne({ _id: new ObjectId(pedidoId) });

    res.redirect('/pedidos'); // Redirigir a la página de pedidos después de eliminar
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};

const editarPedido = async (req, res) => {
  const pedidoId = req.params.id;

  // Obtener los datos actualizados del formulario de edición
  const { fechaPedido, estadoPedido, nombreUsuario, servicios, productos } = req.body;
  if (!servicios || !productos) {
    // Manejar el caso en que servicios o productos sea undefined
    res.status(400).send('La solicitud no incluye la información necesaria');
    return;
  }
  console.log(servicios)
  // Puedes agregar más validaciones según tus necesidades

  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const pedidosCollection = database.collection('pedidos');

    // Obtener el pedido por ID
    const pedido = await pedidosCollection.findOne({ _id: new ObjectId(pedidoId) });

    if (!pedido) {
      // Manejar el caso en que el pedido no se encuentre
      res.status(404).send('Pedido no encontrado');
      return;
    }

    // Actualizar los campos del pedido con los nuevos valores
    pedido.fecha_pedido = fechaPedido;
    pedido.estado_pedido = estadoPedido;
    pedido.nombre_usuario = nombreUsuario;

    // Actualizar servicios
    pedido.servicios = servicios.map((servicioActualizado) => ({
      tipoServicio: servicioActualizado.tipoServicio,
      estadoTipoServicio: servicioActualizado.estadoTipoServicio,
      estadoServicio: servicioActualizado.estadoServicio,
      nombreServicio: servicioActualizado.nombreServicio,
      cantidadServicio: servicioActualizado.cantidadServicio,
      precioServicio: servicioActualizado.precioServicio,
      subtotal: servicioActualizado.cantidadServicio * servicioActualizado.precioServicio,
    }));

    // Actualizar productos
    pedido.productos = productos.map((productoActualizado) => ({
      tipoProducto: productoActualizado.tipoProducto,
      estadoTipoProducto: productoActualizado.estadoTipoProducto,
      estadoProducto: productoActualizado.estadoProducto,
      nombreProducto: productoActualizado.nombreProducto,
      cantidadProducto: productoActualizado.cantidadProducto,
      precioProducto: productoActualizado.precioProducto,
      subtotal: productoActualizado.cantidadProducto * productoActualizado.precioProducto,
    }));

    // Recalcular el total del pedido
    pedido.total_pedido = pedido.servicios.reduce((total, servicio) => total + servicio.subtotal, 0)
      + pedido.productos.reduce((total, producto) => total + producto.subtotal, 0);

    // Actualizar el documento en la base de datos
    await pedidosCollection.updateOne({ _id: new ObjectId(pedidoId) }, { $set: pedido });

    res.redirect(`/pedido/${pedidoId}`); // Redirigir a la página de detalle del pedido actualizado
  } catch (error) {
    console.error('Error al editar el pedido:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};


const PDFDocument = require('pdfkit');

const generarPDFPedidos = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const pedidosCollection = database.collection('pedidos');

    // Obtener todos los pedidos
    const pedidos = await pedidosCollection.find({}).toArray();

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();
    doc.pipe(res); // Enviar el PDF como respuesta HTTP

    // Agregar contenido al PDF
    const fechaActual = new Date().toLocaleDateString();
    doc.moveDown();
    doc.fontSize(16).text(`Reporte de Pedidos - Fecha: ${fechaActual}`, { align: 'center' });
    doc.moveDown();

    // Variable para el número de página
    let pageNumber = 1;

    pedidos.forEach((pedido) => {
      // Agregar número de página y nombre de empresa en todas las páginas
      // doc.text('Nombre de la Empresa', 20, 20, { align: 'left' }); // Ajusta la posición según sea necesario
      // doc.text(`Página ${pageNumber}`, { align: 'right', continued: true });
      // Encabezado en cada página
      doc.text('Erika´s Homemade', { align: 'left' });

      doc.moveDown();

      doc.fontSize(14).text(`Pedido ID: ${pedido._id}`, { underline: true });
      doc.moveDown();

      doc.fontSize(12).text(`Fecha Creación: ${pedido.fecha_creacion}`);
      doc.fontSize(12).text(`Fecha Pedido: ${pedido.fecha_pedido}`);
      doc.fontSize(12).text(`Total: ${pedido.total_pedido}`);
      doc.fontSize(12).text(`Estado: ${pedido.estado_pedido}`);
      doc.fontSize(12).text(`Usuario: ${pedido.nombre_usuario}`);
      doc.moveDown();

      // Agregar detalles de servicios
      doc.fontSize(14).text('Servicios:');
      pedido.servicios.forEach((servicio) => {
        doc.fontSize(12).text(`- ${servicio.nombreServicio}: ${servicio.cantidadServicio} x $${servicio.precioServicio} = $${servicio.subtotal}`);
      });
      doc.moveDown();

      // Agregar detalles de productos
      doc.fontSize(14).text('Productos:');
      pedido.productos.forEach((producto) => {
        doc.fontSize(12).text(`- ${producto.nombreProducto}: ${producto.cantidadProducto} x $${producto.precioProducto} = $${producto.subtotal}`);
      });

      doc.moveDown();
      doc.moveDown();

      // Incrementar número de página
      pageNumber++;

      // Agregar número de página y nombre de empresa en el footer
      const footerText = `Erika's HomeMade Cra 58 # 69 - 22 piso 11`;
      doc.text(`Página ${pageNumber}`, { align: 'right', continued: true });
      const footerHeight = 20;
      doc.text(footerText, { align: 'left', width: 410, height: footerHeight, underline: true, lineGap: 5 });

      // Agregar salto de página si hay más pedidos
      if (pageNumber <= pedidos.length) {
        doc.addPage();
      }
    });

    // Finalizar y enviar el PDF
    doc.end();
  } catch (error) {
    console.error('Error al generar el PDF de pedidos:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};


module.exports = { getPedidosPage, agregarPedido, verDetallePedido, eliminarPedido, editarPedido, generarPDFPedidos };
