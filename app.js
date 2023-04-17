// Importar los módulos necesarios ucademy
const http = require("http");
const express = require("express");
const bodyparser = require("body-parser");
const fs = require("fs");
const cors = require("cors"); // Importar el paquete cors

// Importar las rutas definidas en el archivo index.js dentro de la carpeta router
const misRutas = require("./router/index");
const path = require("path");

// Crear una instancia de Express
const app = express();

// Habilitar CORS para todas las rutas y orígenes
app.use(cors());

// Configurar body-parser para analizar el cuerpo del mensaje en formato JSON
app.use(bodyparser.json());

// Establecer el motor de plantillas como EJS
app.set("view engine", "ejs");

// Establecer la carpeta pública para servir archivos estáticos
app.use(express.static(path.join(__dirname, "/public")));
// Establecer la carpeta pública para servir archivos estáticos (imágenes)
// const directorioImagenes = path.join(__dirname, "public", "uploads");
// app.use(express.static(directorioImagenes));

// Analizar los cuerpos de las solicitudes HTTP
app.use(bodyparser.urlencoded({ extended: true }));

// Registrar el motor de plantillas EJS para la extensión html
app.engine("html", require("ejs").renderFile);

// Usar las rutas definidas en misRutas
app.use(misRutas);

// Agregar un middleware para manejar solicitudes no encontradas (404)
app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + "/public/error.html");
});

const server = http.createServer((req, res) => {
  // Obtén la ruta del archivo solicitado por el cliente
  const filePath = path.join(__dirname, "public/uploads", req.url);

  // Verifica si el archivo existe
  fs.exists(filePath, (exists) => {
    if (exists) {
      // Si el archivo existe, establece las cabeceras de respuesta adecuadas para el tipo de archivo
      const contentType = getContentType(filePath);
      res.writeHead(200, {
        "Content-Type": contentType,
      });

      // Crea un stream de lectura del archivo y lo envía como respuesta
      fs.createReadStream(filePath).pipe(res);
    } else {
      // Si el archivo no existe, envía una respuesta de error
      res.writeHead(404);
      res.end("Archivo no encontrado");
    }
  });
});

// Iniciar el servidor en el puerto 3000 y mostrar un mensaje en la consola
const puerto = 5500;
app.listen(puerto, () => {
  console.log("Iniciando Puerto Proyecto Final");
});

// Función para obtener el tipo de contenido (MIME type) del archivo
function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}
