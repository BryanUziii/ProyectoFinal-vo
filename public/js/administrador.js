// const urlBase = "http://localhost:5500/"; 

let inputMarca = "";
let inputModelo = "";
let inputCapacidad = "";
let inputPrecio = "";
let inputCantidad = "";
let inputNombreImg = "";

let formActualizarProducto = document.getElementById("formActualizarProducto");
const inputActualizar = document.getElementById("inputModificarProducto");
let ColumnaActualizar = '';
let IDActualzar = '';

document.addEventListener("DOMContentLoaded", function () {
  // Para poder obtener los datos de los productos mediante axios
  axios
    .get(`/mostrarProductosAdmin`)
    .then(function (response) {
      // La lista de productos está en response.data
      const productos = response.data;
      // Llamada a una función para mostrar los productos en el HTML
      mostrarProductos(productos);
    })
    .catch(function (error) {
      console.log(error);
    });
});


// FUNCION PARA MOSTRAR LOS PRODUCTOS DISPONIBLES EN EL HTML PRODUCTOS
let mostrarProductos = (productos) => {
  // Obtén la referencia al <template> por su ID
  const templateTable = document.querySelector("#templateTable");
  // Obtén una referencia al contenedor donde se agregarán las copias del template
  const container = document.querySelector("#mostrarLista");

  // Recorrer la lista de productos y crea elementos HTML para cada uno
  for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];

    const card = templateTable.content.cloneNode(true);

    // Accede a los elementos del template clonado y modifica su contenido
    const imagenElement = card.querySelector("#Imagen");
    imagenElement.src = producto.Imagen;
    console.log(`${producto.Imagen}`);

    const btnEliminar = card.querySelector("#btnEliminar");
    btnEliminar.value = producto.ID;

    const idElement = card.querySelector("#Id");
    idElement.textContent = producto.ID;

    const modificarMarca = card.querySelector("#Marca");
    modificarMarca.textContent = producto.Marca;
    const btnActualizarMarca = card.querySelector("#btnActualizarMarca");
    btnActualizarMarca.value = producto.ID;

    const modeloElement = card.querySelector("#Modelo");
    modeloElement.textContent = producto.Modelo;
    const btnActualizarModelo = card.querySelector("#btnActualizarModelo");
    btnActualizarModelo.value = producto.ID;

    const capacidadElement = card.querySelector("#Capacidad");
    capacidadElement.textContent = producto.Capacidad;
    const btnActualizarCapacidad = card.querySelector("#btnActualizarCapacidad");
    btnActualizarCapacidad.value = producto.ID;

    const precioElement = card.querySelector("#Precio");
    precioElement.textContent = "$" + producto.Precio;
    const btnActualizarPrecio = card.querySelector("#btnActualizarPrecio");
    btnActualizarPrecio.value = producto.ID;

    const cantidadElement = card.querySelector("#Cantidad");
    cantidadElement.textContent = producto.Cantidad;
    const btnActualizarCantidad = card.querySelector("#btnActualizarCantidad");
    btnActualizarCantidad.value = producto.ID;



    const estadoMarca = card.querySelector("#Estado");
    const btnActDesact = card.querySelector("#btnActDesact");
    btnActDesact.value = producto.ID;


    if (producto.Estado == 0) {
      estadoMarca.textContent = "Inactivo";
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
};


let getID = (boton) => {
  ColumnaActualizar = boton.name;
  IDActualzar = boton.value;

    document.getElementById("lblModifColum").innerHTML = ` ${ColumnaActualizar}`;
    document.getElementById("lblModifID").innerHTML = IDActualzar;


    switch (ColumnaActualizar) {
      case "Marca":
        // Código a ejecutar si ColumnaActualizar es igual a "Marca"
        inputActualizar.placeholder = "Nueva Marca";
        inputActualizar.type = "text";
        inputActualizar.value = "";
        break;
      case "Modelo":
        // Código a ejecutar si ColumnaActualizar es igual a "Modelo"
        inputActualizar.placeholder = "Nuevo Modelo";
        inputActualizar.type = "text";
        inputActualizar.value = "";
        break;
      case "Capacidad":
        // Código a ejecutar si ColumnaActualizar es igual a "Capacidad"
        inputActualizar.placeholder = "Nueva Capacidad";
        inputActualizar.type = "text";
        inputActualizar.value = "";
        break;
      case "Precio":
        // Código a ejecutar si ColumnaActualizar es igual a "Precio"
        inputActualizar.placeholder = "Nuevo Precio";
        inputActualizar.type = "number";
        inputActualizar.value = "";
        break;
      case "Cantidad":
        // Código a ejecutar si ColumnaActualizar es igual a "Cantidad"
        inputActualizar.placeholder = "Nueva Cantidad";
        inputActualizar.type = "number";
        inputActualizar.value = "";
        break;
      default:
        // Código a ejecutar si ColumnaActualizar no coincide con ninguno de los casos anteriores
        break;
    }
}


function confirmacion() {
  // Mostrar un cuadro de diálogo de confirmación
  var confirmacion = window.confirm("¿Estás seguro de querer continuar?");

  // Si el usuario confirma, permitir el envío del formulario
  // Si el usuario cancela, cancelar el envío del formulario y recargar la página
  if (confirmacion) {
    return true;
  } else {
    location.reload();
    return false;
  }
}


formActualizarProducto.addEventListener("submit", function (event) {
  event.preventDefault(); // Evitar el comportamiento predeterminado del formulario

  let datoActualizar = document.getElementById("inputModificarProducto").value;
  console.log(datoActualizar);

  // Enviar una solicitud POST con Axios
  axios
    .post("/actualizarProducto", {
      datoActualizar: datoActualizar,
      columa: ColumnaActualizar,
      IDActualizar: IDActualzar,
    })
    .then(function (response) {
      alert(response.data);
      location.reload();
      // Hacer algo con la respuesta del servidor
    })
    .catch(function (error) {
      console.error("Error al enviar la solicitud:", error);
      // Manejar errores
    });
});