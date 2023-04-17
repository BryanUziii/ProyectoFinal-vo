// Importar los módulos necesarios
const conexion = require("./conexion.js");

const ProductosDb = {};

// FUNCIONES PARA EL ADMINISTRADOR
ProductosDb.mostrarEnAdmin = function mostrarEnAdmin() {
  return new Promise((resolve, reject) => {
    conexion.query(
      "SELECT * FROM Productos WHERE Eliminado = 0",
      function (error, res, campos) {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
      }
    );
  });
};


ProductosDb.agregarProducto = function agregarProducto(producto) {
  return new Promise((resolve, reject) => {
    var sqlConsulta = "INSERT INTO Productos SET ?";
    conexion.query(sqlConsulta, producto, function (err, res) {
      if (err) {
        console.log("Surgió un error: " + err.message);
        reject(err);
      } else {
        resolve({
          Marca: producto.Marca,
          Modelo: producto.Modelo,
          Capacidad: producto.Capacidad,
          Precio: producto.Precio,
          Cantidad: producto.Cantidad,
          Imagen: producto.Imagen,
          Estado: producto.Estado,
        });
      }
    });
  });
};

ProductosDb.actualizarProducto = function actualizarProducto(datoActualizar,columa, ID) {
  return new Promise((resolve, reject) => {
    var sqlConsulta = `UPDATE Productos SET ${columa} = ? WHERE ID = ?`;
    conexion.query(sqlConsulta, [datoActualizar, ID], function (err, res) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(`${columa} actualizad@ con exito`);
      }
    });
  });
};

ProductosDb.eliminarProducto = function eliminarProducto(ID) {
  return new Promise((resolve, reject) => {
    var sqlConsulta = "UPDATE Productos SET Eliminado = true WHERE ID = ?";
    conexion.query(sqlConsulta, [ID], function (err, res) {
      if (err) {
        console.log("Surgió un error: ", err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

ProductosDb.activarDesactivar = function activarDesactivar(ID) {
  return new Promise((resolve, reject) => {
    var sqlConsulta = "UPDATE Productos SET Estado = 1 - Estado WHERE ID = ?";
    conexion.query(sqlConsulta, [ID], function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

// FUNCIONES PARA ADMINISTRADOR PAGINA DE VENTAS REALIZADAS
ProductosDb.allVentas = function allVentas() {
  return new Promise((resolve, reject) => {
    var sqlConsulta = "SELECT * FROM Venta";
    conexion.query(sqlConsulta, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

ProductosDb.buscarVentaPorId = function buscarVentaPorId(ID) {
  return new Promise((resolve, reject) => {
    var sqlConsulta = "SELECT * FROM Venta WHERE ID = ?";
    conexion.query(sqlConsulta, [ID], function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

ProductosDb.buscarVentaPorFecha = function buscarVentaPorFecha(Fecha) {
  return new Promise((resolve, reject) => {
    var sqlConsulta = "SELECT * FROM Venta WHERE Fecha = ?";
    conexion.query(sqlConsulta, [Fecha], function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

ProductosDb.buscarVentaEntreFechas = function buscarVentaEntreFechas(Fecha1, Fecha2) {
  return new Promise((resolve, reject) => {
    var sqlConsulta = "SELECT * FROM Venta WHERE Fecha BETWEEN ? AND ?";
    conexion.query(sqlConsulta, [Fecha1, Fecha2], function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

ProductosDb.buscarVentaPorTotal = function buscarVentaPorTotal(Comparador, Total) {
  return new Promise((resolve, reject) => {
    var sqlConsulta = `SELECT * FROM Venta WHERE Total ${Comparador}= ?`;
    conexion.query(sqlConsulta, [Total], function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

ProductosDb.obtenerTicket = function obtenerTicket(ID) {
  return new Promise((resolve, reject) => {
    var sqlConsulta = `CALL ObtenerTicket(?)`;
    conexion.query(sqlConsulta, [ID], function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

// FUNCIONES PARA USUARIOS DEL LADO DEL CLIENTE
ProductosDb.crearUsuario = function crearUsuario(username, contraseña, telefono, domicilio, email) {
  return new Promise((resolve, reject) => {
    var sqlConsulta = "INSERT INTO Usuarios (Nombre, Contrasena, Telefono, Domicilio, Correo) VALUES (?, ?, ?, ?, ?)";
    conexion.query(sqlConsulta, [username, contraseña, telefono, domicilio, email], function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

ProductosDb.iniciarSesion = function iniciarSesion(username, contraseña) {
  return new Promise((resolve, reject) => {
    var sqlConsulta = "SELECT ID, Nombre FROM Usuarios WHERE Nombre = ? AND Contrasena = ?";
    conexion.query(sqlConsulta, [username, contraseña], function (err, res) {
      if (err) {
        reject(err);
      } else {
        if (res.length > 0) {
          resolve(res);
        } else {
          reject("Nombre de usuario o contraseña incorrectos");
        }
      }
    });
  });
};

// FUNCIONES PARA LA PAGINA PRINCIPAL EN ESPECIFICO PARA PRODUCTOS
ProductosDb.mostrarEnPagPrincipal = function mostrarEnPagPrincipal() {
  return new Promise((resolve, reject) => {
    conexion.query('SELECT ID, Marca, Modelo, Capacidad, Precio, Cantidad, Imagen FROM Productos WHERE Estado = 1 AND Eliminado = 0', function(error, res) {
      if (error) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
};

// Este es para saber que ID de ventas es el siguiente
ProductosDb.buscarIDVentas = function buscarIDVentas() {
  return new Promise((resolve, reject) => {
    conexion.query(
      "SELECT MAX(ID) as ultimoIDVenta FROM Venta",
      function (error, resultados) {
        if (error) {
          reject(error);
        } else {
          resolve(resultados);
        }
      }
    );
  });
};

// Para mostrar buscar por ID (Carrito)
ProductosDb.buscarPorId = function buscarPorId(ID) {
  return new Promise((resolve, reject) => {
    // Se define la consulta SQL para realizar corte de caja
    var sqlConsulta = "SELECT * FROM Productos WHERE ID = ?";
    conexion.query(sqlConsulta, [ID], function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

// (Carrito)
ProductosDb.crearVenta = function crearVenta(UsuarioID) {
  return new Promise((resolve, reject) => {
    var sqlConsulta =
      "INSERT INTO Venta (Fecha, Total, UsuarioID) VALUES (CURDATE(), 0, ?);";
    conexion.query(sqlConsulta,[UsuarioID], function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

// (Carrito)
ProductosDb.realizarVenta = function realizarVenta(idVenta, productos, metodoPago) {
  return new Promise((resolve, reject) => {
    var sqlConsulta = 
    "INSERT INTO DetalleVenta (VentaID, ProductoID, Cantidad, PrecioUnitario, Subtotal, MetodoPago)VALUES (?, ?, ?, ?, ?, ?);";
    productos.forEach((producto) => {
      conexion.query(
        sqlConsulta,
        [
          idVenta,
          producto.id,
          producto.cantidad,
          producto.precio,
          producto.cantidad * producto.precio,
          metodoPago,
        ],
        function (err, res) {
          if (err) {
            console.log("Surgió un error: ", err);
            reject(err);
          } else {
            console.log("Venta realizada");
          }
        }
      );
    });
    resolve();
  });
};

module.exports = ProductosDb;
