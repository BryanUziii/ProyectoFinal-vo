const urlBase = "http://localhost:3000/";

let inputMarca = "";
let inputModelo = "";
let inputCapacidad = "";
let inputPrecio = "";
let inputCantidad = "";
let inputNombreImg = "";


//let btnEjemplo = document.getElementById("btnActivarDesactivar");

document.addEventListener("DOMContentLoaded", function () {
  //Para poder obtener los datos de los alumnos mediante axios
  axios
    .get(`${urlBase}mostrarProductosAdmin`)
    .then(function (response) {
      // La lista de alumnos está en response.data
      const productos = response.data;
      //console.log(productos);
      // Llamada a una función para mostrar los alumnos en el HTML
      mostrarProductos(productos);
    })
    .catch(function (error) {
      console.log(error);
    });
  });

// FUNCION PARA MOSTRAR LOS PRODUCTOS DISPONIBLES EN EL HTML PRODUCTOS
let mostrarProductos = (productos) => {
    // Obtén la referencia al <template> por su ID
    var templateTable = document.querySelector("#templateTable");
    // Obtén una referencia al contenedor donde se agregarán las copias del template
    var container = document.querySelector("#mostrarLista");
    // Recorre la lista de productos y crea elementos HTML para cada uno
    for (let i = 0; i < productos.length; i++) {
        let producto = productos[i];

        let card = templateTable.content.cloneNode(true);

        // Accede a los elementos del template clonado y modifica su contenido

        const imagenElement = card.querySelector("#Imagen");
        let imagentxt = producto.Imagen.slice(2);
        //imagenElement.src = urlImagen;

        // Realiza una petición GET para obtener una imagen desde el servidor
        axios
            .get(`${urlBase}${imagentxt}`, {
            responseType: "arraybuffer", // Especifica el tipo de respuesta como arraybuffer para imágenes
            })
            .then((response) => {
            // Convierte el arraybuffer en un blob
            const blob = new Blob([response.data], {
                type: response.headers["content-type"],
            });

            // Crea una URL de objeto para el blob
            const imgUrl = URL.createObjectURL(blob);

            // Crea un elemento de imagen en el DOM y establece la URL de la imagen
            imagenElement.src = imgUrl;

            })
            .catch((error) => {
            console.error("Error al obtener la imagen:", error);
            });

        let btnEliminar = card.querySelector("#btnEliminar");
        btnEliminar.value = producto.ID;
        
        let idElement = card.querySelector("#Id");
        idElement.textContent = producto.ID;

        let modeloElement = card.querySelector("#Modelo");
        modeloElement.textContent = producto.Modelo;

        let capacidadElement = card.querySelector("#Capacidad");
        capacidadElement.textContent = producto.Capacidad;

        let precioElement = card.querySelector("#Precio");
        precioElement.textContent = "$" + producto.Precio;

        let cantidadElement = card.querySelector("#Cantidad");
        cantidadElement.textContent = producto.Cantidad;

        // Este es para modificar el nombre de la "Marca" que sale al fondo de la tarjeta
        let modificarMarca = card.querySelector("#Marca");
        modificarMarca.textContent = producto.Marca;

        let estadoMarca = card.querySelector("#Estado");
        let btnActDesact = card.querySelector("#btnActDesact");
        btnActDesact.value = producto.ID;

        let btnActualizar = card.querySelector("#btnActualizar");
        btnActualizar.value = producto.ID;

        if (producto.Estado == 0){
          estadoMarca.textContent =  "Inactivo";
          btnActDesact.classList.add("btn-rotate_inactivo");
          btnActDesact.title = "ACTIVAR";


        } else {
            estadoMarca.textContent = "Activo";
            btnActDesact.classList.add("btn-rotate_activo");
            btnActDesact.title = "DESACTIVAR";
        }
         
        container.appendChild(card);
    }
}



  let recargarPagina = () => {
    setTimeout(function () {
      location.reload();
    }, 1);
  }


function confirmacion() {
  // Mostrar un cuadro de diálogo de confirmación
  var confirmacion = window.confirm(
    "¿Estás seguro de querer continuar? El producto se eliminara de forma permanente"
  );

  // Si el usuario confirma, permitir el envío del formulario
  // Si el usuario cancela, cancelar el envío del formulario y recargar la página
  if (confirmacion) {
    return true;
  } else {
    location.reload();
    return false;
  }
}

let funcActualizar = (boton) => {
  const input = document.getElementById("IDActualizar");
  let value = boton.value;
  console.log(`Value: ${value}`);

  input.value = value;
  console.log(`imput Value: ${input.value}`);
}