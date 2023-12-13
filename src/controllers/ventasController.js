const { MongoClient, ObjectId } = require('mongodb');
const PDFDocument = require('pdfkit');

const getVentasPage = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect(); // Conectar a la base de datos

    const database = client.db('erikas_homemade');
    const ventasCollection = database.collection('ventas');

    // Realizar operaciones con la colección de ventas...
    const ventas = await ventasCollection.find({}).toArray(); // Obtener todos los documentos de ventas

    // Obtener los pedidos y usuarios desde sus respectivas colecciones
    const pedidosCollection = database.collection('pedidos');
    const usuariosCollection = database.collection('configuracion');

    const pedidos = await pedidosCollection.find({}).toArray(); // Obtener todos los documentos de pedidos
    const usuarios = await usuariosCollection.find({}).toArray(); // Obtener todos los usuarios

    // Renderizar la vista con datos de ventas, pedidos y usuarios
    res.render('ventas', { ventas, pedidos, usuarios });
  } catch (error) {
    console.error('Error al obtener datos de la base de datos:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close(); // Cerrar la conexión
  }
};

const agregarVenta = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect(); // Conectar a la base de datos

    const database = client.db('erikas_homemade');
    const ventasCollection = database.collection('ventas');
    const pedidosCollection = database.collection('pedidos');
    const configuracionCollection = database.collection('configuracion');

    // Obtener datos de pedidos y configuración
    const pedidos = await pedidosCollection.find({}, { projection: { servicios: 1, productos: 1, total_pedido: 1 } }).toArray();
    const usuarios = await configuracionCollection.find({}).toArray();

    const { metodo_pago, total_venta, usuario, pedido } = req.body;

    // Convertir ID de usuario y pedido a ObjectId con 'new'
    const usuarioId = new ObjectId(usuario);
    const pedidoId = new ObjectId(pedido);

    // Obtener datos del usuario y pedido seleccionado
    const usuarioSeleccionado = usuarios.find(user => user._id.equals(usuarioId));
    const pedidoSeleccionado = pedidos.find(p => p._id.equals(pedidoId));

    if (!usuarioSeleccionado || !pedidoSeleccionado) {
      console.error('No se encontró el usuario o el pedido');
      res.status(404).send('Usuario o pedido no encontrado');
      return;
    }

    console.log(pedidoSeleccionado);

    // Obtener la fecha actual
    const fecha_venta = new Date().toISOString(); // Configurar la fecha actual como valor predeterminado para fecha_venta

    // Construir el objeto de venta con los datos obtenidos
    const nuevaVenta = {
      fecha_venta,
      metodo_pago,
      total_venta,
      nombre: usuarioSeleccionado.nombre,
      telefono: usuarioSeleccionado.telefono,
      documento: usuarioSeleccionado.documento,
      correo: usuarioSeleccionado.correo,
      total_pedido: pedidoSeleccionado.total_pedido,
      productos: pedidoSeleccionado.productos,
      servicios: pedidoSeleccionado.servicios,
      // Otros campos de la venta según sea necesario
    };

    // Guardar la nueva venta en la colección de ventas
    await ventasCollection.insertOne(nuevaVenta);

    const ventasActualizadas = await ventasCollection.find({}).toArray();

    // Redireccionar a la página de ventas
    res.redirect('/pelos');
  } catch (error) {
    console.error('Error al agregar la venta:', error);
    console.error(error); // Imprimir el objeto error completo para detalles adicionales
    res.status(500).send('Error interno del servidor al agregar la venta');
  } finally {
    await client.close(); // Cerrar la conexión
  }
};


const eliminarVenta = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const ventasCollection = database.collection('ventas');

    const ventaId = req.params.id;

    const result = await ventasCollection.deleteOne({ _id: new ObjectId(ventaId) });
    if (result.deletedCount === 0) {
      console.log('La venta no fue encontrada o no se eliminó');
      res.status(404).send('La venta no fue encontrada o no se eliminó');
      return;
    }

    console.log('Venta eliminada correctamente');
    res.redirect('/pelos');
  } catch (error) {
    console.error('Error al eliminar la venta:', error);
    res.status(500).send('Error interno del servidor al eliminar la venta');
  } finally {
    await client.close();
  }
};

const obtenerDatosVenta = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const ventasCollection = database.collection('ventas');

    const ventaId = req.params.id; // ID de la venta que se desea editar

    // Obtener los datos de la venta específica
    const venta = await ventasCollection.findOne({ _id: new ObjectId(ventaId) });

    if (!venta) {
      console.log('Venta no encontrada');
      res.status(404).send('Venta no encontrada');
      return;
    }

    // Redirigir a la página de edición con los datos de la venta

    res.render('formularioEditarVenta', { venta }); // 'formularioEditarVenta' es el nombre de tu vista
  } catch (error) {
    console.error('Error al obtener los datos de la venta:', error);
    res.status(500).send('Error interno del servidor al obtener los datos de la venta');
  } finally {
    await client.close();
  }
};

const actualizarVentas = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const ventasCollection = database.collection('ventas');

    const ventaId = req.params.id; // ID de la venta que se desea editar
    const { fecha_venta, metodo_pago, nombre, telefono, documento, correo, productos, servicios } = req.body; // Datos actualizados de la venta desde el cuerpo de la solicitud

    // Verificar los datos recibidos
    console.log('Productos:', productos);
    console.log('Servicios:', servicios);

    // Calcular el total de precios de productos y servicios
    let totalProductos = 0;
    let totalServicios = 0;

    // Revisar los datos de productos
    productos.forEach((producto) => {
      console.log('Producto:', producto);
      totalProductos += parseFloat(producto.precioProducto) * 1; // Convertir el precio a número y multiplicar por 1
    });

    // Revisar los datos de servicios
    servicios.forEach((servicio) => {
      console.log('Servicio:', servicio);
      totalServicios += parseFloat(servicio.precioServicio) * 1; // Convertir el precio a número y multiplicar por 1
    });

    const totalPedido = totalProductos + totalServicios; // Total del pedido

    console.log('Total de Productos:', totalProductos);
    console.log('Total de Servicios:', totalServicios);
    console.log('Total del Pedido:', totalPedido);

    // Actualizar total_pedido y total_venta en la venta
    const result = await ventasCollection.updateOne(
      { _id: new ObjectId(ventaId) },
      {
        $set: {
          fecha_venta,
          metodo_pago,
          nombre,
          telefono,
          documento,
          correo,
          total_pedido: totalPedido,
          total_venta: totalPedido, // En este caso, se actualiza total_venta con el mismo valor de total_pedido
          productos,
          servicios,
          // Otros campos que desees actualizar
        },
      }
    );

    if (result.matchedCount === 0) {
      console.log('La venta no fue encontrada o no se actualizó');
      res.status(404).send('La venta no fue encontrada o no se actualizó');
      return;
    }

    res.redirect('/pelos'); // Redirigir a la página deseada después de editar
    console.log('Venta actualizada correctamente');
  } catch (error) {
    console.error('Error al editar la venta:', error);
    res.status(500).send('Error interno del servidor al editar la venta');
  } finally {
    await client.close();
  }
};


const generarPDFVentas = async (req, res) => {
  const uri = 'mongodb+srv://jhomai7020:1097183614@sena.kpooaa3.mongodb.net/erikas_homemade';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('erikas_homemade');
    const ventasCollection = database.collection('ventas');

    // Obtener todas las ventas
    const ventas = await ventasCollection.find({}).toArray();

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();
    doc.pipe(res); // Enviar el PDF como respuesta HTTP

    let pageNumber = 1; // Número de página inicial

    // Agregar contenido al PDF
    ventas.forEach((venta, index) => {
      if (index > 0) {
        doc.addPage(); // Agregar una nueva página para cada venta
        pageNumber++;
      }

      doc.fontSize(16).text('Reporte de Ventas', { align: 'center' });
      doc.moveDown();

      doc.fontSize(14).text(`Venta ID: ${venta._id}`, { underline: true });
      doc.moveDown();

      doc.fontSize(12).text(`Fecha Venta: ${venta.fecha_venta}`);
      doc.fontSize(12).text(`Método Pago: ${venta.metodo_pago}`);
      doc.fontSize(12).text(`Total Venta: ${venta.total_venta}`);
      doc.fontSize(12).text(`Total Pedido: ${venta.total_pedido}`);
      doc.fontSize(12).text(`Nombre: ${venta.nombre}`);
      doc.fontSize(12).text(`Teléfono: ${venta.telefono}`);
      doc.fontSize(12).text(`Documento: ${venta.documento}`);
      doc.fontSize(12).text(`Correo: ${venta.correo}`);
      doc.moveDown();

      // Agregar detalles de productos o servicios (dependiendo de tu estructura de datos)
      // Por ejemplo:
      doc.fontSize(14).text('Detalles:');
      venta.productos.forEach((producto) => {
        doc.fontSize(12).text(`- ${producto.nombreProducto}: Cantidad: ${producto.cantidadProducto}, Precio: $${producto.precioProducto}, Subtotal: $${producto.subtotal}`);
      });
      venta.servicios.forEach((servicio) => {
        doc.fontSize(12).text(`- ${servicio.nombreServicio}: Cantidad: ${servicio.cantidadServicio}, Precio: $${servicio.precioServicio}, Subtotal: $${servicio.subtotal}`);
      });
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      doc.moveDown();
      // Pie de página con la información de la empresa y el paginado
      doc.fontSize(10).text('Erika\'s Homemade - Calle 84 numero 57-31', { align: 'left' });
      doc.fontSize(8).text(`Página ${pageNumber}`, { align: 'right' });

      doc.moveDown();
      doc.moveDown();
    });

    // Finalizar y enviar el PDF
    doc.end();
  } catch (error) {
    console.error('Error al generar el PDF de ventas:', error);
    res.status(500).send('Error interno del servidor');
  } finally {
    await client.close();
  }
};


module.exports = { getVentasPage, agregarVenta, eliminarVenta, actualizarVentas, obtenerDatosVenta, generarPDFVentas };
