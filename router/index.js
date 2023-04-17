// Importar el módulo body-parser y el framework Express
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const fs = require("fs");

// Crear una instancia de Router
const router = express.Router();

const ProductosDb = require("../models/productos.js");

// Configuración de Multer para guardar las imagenes en el proyecto
const multer = require("multer");
const { type } = require("express/lib/response.js");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/uploads/");
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").pop();
    const nombreArchivo =
      req.body.Marca + req.body.Modelo.replace(/\s+/g, "-") + "." + extension;
    cb(null, nombreArchivo);
  },
});
const upload = multer({ storage: storage });

//RUTAS PARA RENDERIZAR LOS HTML
//Para el index
router.get("/", async (req, res) => {
 res.render("index.html");
});

//Para el administrador
router.get("/admin", async (req, res) => {
  res.render("administrador.html");
});

//Para el administrador
router.get("/admin_ventas", async (req, res) => {
  res.render("administrador_ventas.html");
});

//Vistas del usuario
router.get("/pagPrincipal", async (req, res) => {
  res.render("paginaPrincipal.html");
});

router.get("/pagPrincipal_productos", async (req, res) => {
  res.render("paginaPrincipal_Productos.html");
});

router.get("/pagPrincipal_contacto", async (req, res) => {
  res.render("paginaPrincipal_Contacto.html");
});

router.get("/pagPrincipal_signup", async (req, res) => {
  res.render("paginaPrincipal_signup.html");
});

router.get("/pagPrincipal_login", async (req, res) => {
  res.render("paginaPrincipal_login.html");
});


//METODOS PARA ADMINISTRADOR
router.get("/mostrarProductosAdmin", async (req, res) => {
  try {
    resultado = await ProductosDb.mostrarEnAdmin();
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar la lista de productos.");
  }
});

router.post("/agregarProducto", upload.single("imagen"), function (req, res) {
  const ArchivoImagen = req.file.filename;
  const Imagen = "/img/uploads/" + ArchivoImagen;

  const producto = {
    Marca: req.body.Marca,
    Modelo: req.body.Modelo,
    Capacidad: req.body.Capacidad,
    Precio: req.body.Precio,
    Cantidad: req.body.Cantidad,
    Imagen: Imagen,
    Estado: 0,
  };

  try {
    ProductosDb.agregarProducto(producto)
      .then((resultado) => {
        res.send(`<html><head><title>Respuesta del servidor</title></head><body>
        <script>
          <h3>El Producto Se Agrego Correctamente</h3>
            setTimeout(function() {
              window.close();
            }, 1500);
          </script>
        </body></html>`);
      })
      .catch((error) => {
        res.status(500).send("Error al agregar el producto");
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al activar o desactivar el producto.");
  }
});

router.post("/actualizarProducto", async (req, res) => {
  const datoActualizar = req.body.datoActualizar;
  const columa = req.body.columa;
  const IDActualizar = req.body.IDActualizar;

;

  try {
    ProductosDb.actualizarProducto(datoActualizar, columa, IDActualizar).then(
      (resultado) => {
        res.json(resultado);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el producto.");
  }
});

router.post("/eliminarProducto", (req, res) => {
  const id = req.body.IdEliminar;

  ProductosDb.eliminarProducto(id)
    .then((resultado) => {
      res.send(`<html><head><title>Respuesta del servidor</title></head><body>
        <script>
            setTimeout(function() {
              window.close();
            }, 1);
          </script>
        </body></html>`);
    })
    .catch((error) => {
      res.status(500).send("Error al eliminar el producto");
    });
});

router.post("/activarDesactivar", async (req, res) => {
  const ID = req.body.idActivarDesactivar;
  try {
    const resultado = await ProductosDb.activarDesactivar(ID);
    res.send(`<html><head><title>Respuesta del servidor</title></head><body>
        <script>
            setTimeout(function() {
              window.close();
            }, 1);
          </script>
        </body></html>`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al activar o desactivar el producto.");
  }
});

//ADMINISTRADOR (VENTAS)
router.get("/allVentas", async (req, res) => {
  try {
    // Mostrar todos los registros de ventas en la base de datos
    const resultado = await ProductosDb.allVentas();
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar la lista de ventas.");
  }
});

router.post("/buscarVentaPorId", async (req, res) => {
  try {
    // Buscar una venta por su ID en la base de datos
    const resultado = await ProductosDb.buscarVentaPorId(req.body.ID);
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al buscar la venta por ID.");
  }
});

router.post("/buscarVentaPorFecha", async (req, res) => {
  try {
    // Buscar ventas por fecha en la base de datos
    const resultado = await ProductosDb.buscarVentaPorFecha(req.body.Fecha);
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al buscar las ventas por fecha.");
  }
});

router.post("/buscarVentaEntreFechas", async (req, res) => {
  try {
    // Buscar ventas entre dos fechas en la base de datos
    const resultado = await ProductosDb.buscarVentaEntreFechas(
      req.body.Fecha1,
      req.body.Fecha2
    );
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Error al buscar las ventas entre las fechas proporcionadas.");
  }
});

router.post("/buscarVentaPorTotal", async (req, res) => {
  try {
    // Buscar ventas por total en la base de datos
    const resultado = await ProductosDb.buscarVentaPorTotal(
      req.body.Comparador,
      req.body.Total
    );
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al buscar las ventas por total.");
  }
});

router.post("/obtenerTicket", async (req, res) => {
  try {
    // Obtener un ticket de venta por ID de la base de datos
    const resultado = await ProductosDb.obtenerTicket(req.body.ID);
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener el ticket de venta.");
  }
});

//METODOS PARA USUARIO (PAGINA PRINCIPAL)
router.get("/mostrarProductosActivos", async (req, res) => {
  try {
    resultado = await ProductosDb.mostrarEnPagPrincipal();
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar la lista de productos.");
  }
});

//CARRITO
router.get("/buscarIDVentas", async (req, res) => {
  try {
    resultado = await ProductosDb.buscarIDVentas();
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener el ID.");
  }
});

router.get("/buscarPorId", async (req, res) => {
  const ID = req.query.ID;
  try {
    resultado = await ProductosDb.buscarPorId(ID);
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar la lista de productos.");
  }
});

router.post("/realizarVenta", async (req, res) => {
  try {
    await ProductosDb.crearVenta(req.body.usuarioId);
    await ProductosDb.realizarVenta(
      req.body.idVenta,
      req.body.productos,
      req.body.metodoPago
    );
    res.send(`Compra Realizada Con Éxito`);
  } catch (error) {
    console.error("Error en la compra:", error);
    res.status(500).send("Error en la compra");
  }
});

//USUARIOS
router.post("/crearUsuario", async (req, res) => {
  let username = req.body.username;
  let contraseña = req.body.contraseña;
  let telefono = req.body.telefono;
  let domicilio = req.body.domicilio;
  let email = req.body.email;

  ProductosDb.crearUsuario(username, contraseña, telefono, domicilio, email)
    .then(() => {
      res.send(`Usuario creado con éxito`);
    })
    .catch((error) => {
      console.error("Error al crear usuario:", error);

      if (error.errno == 1062) {
        res.status(500).send(`El nombre de usuario '${username}' ya existe`);
      } else {
        res.status(500).send(`Error al crear usuario: ${error.message}`);
      }
    });
});

router.post("/iniciarSesion", async (req, res) => {
  let username = req.body.username;
  let contraseña = req.body.contraseña;

  ProductosDb.iniciarSesion(username, contraseña)
    .then((resultados) => {
      res.json(resultados);
    })
    .catch((error) => {
      console.error("Error al iniciar sesión:", error);
      res.status(500).send("Nombre de usuario o contraseña incorrectos");
    });
});




// Exportar el módulo Router para que pueda ser utilizado en otros archivos
module.exports = router;
