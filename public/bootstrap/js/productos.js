const urlBase = "http://localhost:3000/";
const usuario = JSON.parse(localStorage.getItem("usuario"));
const btnsIniciarSesion = document.getElementById("btnsIniciarSesion");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
const mostrarNombreUsuario = document.getElementById("nombreUsuario");

const tablaCarrito = document.getElementById("tablaCarrito");
const lblCarritoVacio = document.getElementById("lblCarritoVacio");
const totalCarrito = document.getElementById(`carrito-total`);
let idVentas = '';




document.addEventListener("DOMContentLoaded", function () {
  //PARA PODER ACCEDER A LOS PRODUCTOS MEDIANTE AXIOS
  axios
    .get(`${urlBase}mostrarProductosActivos`)
    .then(function (response) {
      // LA LISTA DE LOS PRODUCTOS ESTA EN response.data
      const productos = response.data;

      // LLAMADA A UNA FUNCION PARA MOSTRAR LOS ALUMNOS EN EL HTML
      mostrarProductos(productos);
    })
    .catch(function (error) {
      console.log(error);
    });

  //PARA PODER OBTENER EL ID DE VENTAS
  axios
    .get(`${urlBase}bucarIDVentas`)
    .then(function (response) {
      idVentas = response.data; // Utilizar el operador + para convertir a número
       idVentas = idVentas[0].ultimoIDVenta + 1;
    })
    .catch(function (error) {
      console.log(error);
    });

    //ESTE LUEGO SE QUITA
    console.log(usuario);
    if (usuario == null) {
      console.log("Sin Usuario");
    } else {
        btnsIniciarSesion.classList.add("ocultar");
        btnCerrarSesion.classList.remove("ocultar");
        mostrarNombreUsuario.innerHTML = '';
        mostrarNombreUsuario.innerHTML = usuario.Nombre;
    }
});

// FUNCION PARA MOSTRAR LOS PRODUCTOS DISPONIBLES EN EL HTML PRODUCTOS
let mostrarProductos = (productos) => {
  // Obtén la referencia al <template> por su ID
  var templateCard = document.querySelector("#templateCard");
  // Obtén una referencia al contenedor donde se agregarán las copias del template
  var container = document.querySelector("#mostrarProductos");
  // Recorre la lista de productos y crea elementos HTML para cada uno
  for (let i = 0; i < productos.length; i++) {
    let producto = productos[i];

    let card = templateCard.content.cloneNode(true);

    // Accede a los elementos del template clonado y modifica su contenido

    const imagenElement = card.querySelector("#Imagen");
    let imagentxt = productos[i].imagen.slice(1);
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

    let modeloElement = card.querySelector("#Modelo");
    modeloElement.textContent = producto.modelo;

    let capacidadElement = card.querySelector("#Capacidad");
    capacidadElement.textContent = producto.capacidad;

    let precioElement = card.querySelector("#Precio");
    precioElement.textContent = "$" + producto.precio;

    let cantidadElement = card.querySelector("#Cantidad");
    cantidadElement.textContent = producto.cantidad;

    let btnAggCarritoElement = card.querySelector("#btnAggCarrito");
    btnAggCarritoElement.value = producto.id;

    // Este es para modificar el nombre de la "Marca" que sale al fondo de la tarjeta
    let modificarMarca = card.querySelector(".card");
    // Modifica el valor del atributo data-text
    modificarMarca.setAttribute("data-text", producto.marca);

    // Agrega el template clonado al contenedor
    // Agrega el template clonado al DOM
    container.appendChild(card);
  }
};

// CREACION DE LA CLASE CARRITO CON SUS METODOS
class CarritoDeCompras {
  constructor() {
    this.productos = []; // Array para almacenar los productos en el carrito
    this.total = 0; // Variable para almacenar el total de la compra
    this.idVenta = idVentas;
  }

  // Método para agregar un producto al carrito
  agregarProducto(producto) {
    // Verificar si el producto ya existe en el carrito
    const productoExistente = this.productos.find((p) => p.id == producto.id);
    if (productoExistente) {
      console.log(`El producto con ID ${producto.id} ya está en el carrito.`);
      mostrarToast2();
      return; // No agregar el producto al carrito si ya existe
    }

    mostrarToast();

    // Actualizar la lista de productos en el carrito
    this.productos.push(producto);
    this.total += producto.precio;

    console.log(`${producto.nombre} | ${producto.capacidad}`);

    // Obtener las referencias a los elementos del DOM
    const templateCarrito = document.querySelector("#templateCarrito");
    const container = document.querySelector("#mostrarProductosCarrito");
    let card = templateCarrito.content.cloneNode(true);

    const eliminarElement = card.querySelector("#td");
    eliminarElement.classList.add(`td-${producto.id}`);

    const btnEliminarElement = card.querySelector("#carrito-btnEliminar");
    btnEliminarElement.value = `${producto.id}`;

    const nombreElement = card.querySelector("#carrito-Producto");
    nombreElement.textContent = `${producto.nombre} | ${producto.capacidad}`;

    const precioElement = card.querySelector("#carrito-Precio");
    precioElement.textContent = `$${producto.precio}`;

    const imagenElement = card.querySelector("#carrito-Imagen");
    imagenElement.src = producto.imagen;

    const disponibilidadElement = card.querySelector("#carrito-Cantidad");
    disponibilidadElement.id = `input-${producto.id}`;
    disponibilidadElement.max = producto.disponibilidad;

    const btnDisminuirElement = card.querySelector("#btnDisminuir");
    const btnIncrementoElement = card.querySelector("#btnIncremento");
    btnDisminuirElement.value = `${producto.id}`;
    btnIncrementoElement.value = `${producto.id}`;

    container.appendChild(card);

    // Actualizar el total en el carrito
    totalCarrito.innerHTML = `$${this.total}`;
  }

  modificarCantidadAComprar(id, cantidadNew) {
    this.productos.forEach((producto) => {
      if (producto.id == id) {
        const cantidadActual = producto.cantidad;

        // Calcular la diferencia entre la cantidad actual y la nueva cantidad
        const diferencia = cantidadNew - cantidadActual;

        // Actualizar el total en base a la diferencia
        this.total += producto.precio * diferencia;

        // Actualizar la cantidad del producto
        producto.cantidad = cantidadNew;

        // Actualizar el elemento HTML que muestra el total del carrito
        totalCarrito.innerHTML = `$${this.total}`;

        // Limpiar la consola y mostrar el contenido actualizado del carrito
        console.clear();
        this.mostrarContenido();
      }
    });
  }

  // Método para eliminar un producto del carrito
  eliminarProducto(idProducto) {
    let index = -1; // Inicializar el índice en -1

    // Utilizar el método findIndex() para encontrar el índice del producto a eliminar
    index = this.productos.findIndex((producto) => producto.id == idProducto);

    if (index !== -1) {
      // Si se encontró el producto
      console.clear();

      // Restar el precio del producto del total
      this.total -=
        this.productos[index].precio * this.productos[index].cantidad;

      // Eliminar el producto del arreglo usando el método splice()
      this.productos.splice(index, 1);

      // Actualizar el elemento HTML que muestra el total del carrito
      totalCarrito.innerHTML = `$${this.total}`;

      // Limpiar la consola y mostrar el contenido actualizado del carrito
      this.mostrarContenido();
    }
  }

  // // Método para calcular el total de la compra con descuentos, si los hubiera
  // calcularTotalConDescuento(descuento) {
  //   return this.total * (1 - descuento);
  // }

  // Método para vaciar el carrito
  vaciarCarrito() {
    // Vaciar la lista de productos y resetear el total a 0
    this.productos = [];
    this.total = 0;

    // Mostrar el mensaje de carrito vacío y ocultar la tabla de productos en el carrito
    lblCarritoVacio.classList.remove("ocultar");
    tablaCarrito.classList.add("ocultar");

    // Vaciar el contenido del contenedor de productos en el carrito en el DOM
    document.getElementById("mostrarProductosCarrito").innerHTML = "";
  }

  // Método para mostrar el contenido del carrito en la consola
  mostrarContenido() {
    console.log("Contenido del carrito:");
    console.log("-----------------------");

    // Iterar sobre la lista de productos en el carrito e imprimir sus detalles
    this.productos.forEach((producto) => {
      console.log(
        `ID: ${producto.id}, Producto: ${producto.nombre}, Precio: $${producto.precio}, Disponibles: ${producto.disponibilidad}, Cantidad a comprar: ${producto.cantidad}`
      );
    });

    console.log("-----------------------");
    console.log(`Total: $${this.total}`);
  }

  // Método para realizar la venta
  async realizarVenta() {
    try {
      // console.log(this.productos);
      console.log(idVentas); // Corregido de this.idVentas

      // Realizar una solicitud POST a la URL de base con los productos en el cuerpo de la solicitud
      const response = await axios.post(`${urlBase}realizarCompra`, {
        productos: this.productos,
        idVenta: idVentas,
      });

      // Procesar la respuesta
      console.log(response.data);
      this.vaciarCarrito(); // Vaciar el carrito después de realizar la venta
    } catch (error) {
      console.error("Error al realizar la compra:", error); // Cambiado de alert() a console.error()
    }
  }
}

// CREACION DE LA INSTANCIA CARRITO
const miCarrito = new CarritoDeCompras();

let AggProducto = async (boton) => {
  tablaCarrito.classList.remove("ocultar");
  lblCarritoVacio.classList.add("ocultar");

  let ID = parseInt(boton.value);
  let urlImagen;

  try {
    // Realizar una solicitud GET para buscar un producto por ID
    const response = await axios.get(`${urlBase}buscarPorId`, {
      params: { ID: ID }, // Enviar el ID como parámetro en la URL
    });
    var infoProducto = response.data;

    let imagentxt = infoProducto[0].Imagen.slice(1);

    // Realizar una solicitud GET para obtener la imagen del producto desde el servidor
    const responseImagen = await axios.get(`${urlBase}${imagentxt}`, {
      responseType: "arraybuffer", // Especificar el tipo de respuesta como arraybuffer para imágenes
    });

    // Convertir el arraybuffer en un blob
    const blob = new Blob([responseImagen.data], {
      type: responseImagen.headers["content-type"],
    });

    // Crear una URL de objeto para el blob
    const imgUrl = URL.createObjectURL(blob);

    // Establecer la URL de la imagen en una variable
    urlImagen = imgUrl;

    const producto = {
      id: infoProducto[0].ID,
      nombre: infoProducto[0].Modelo,
      capacidad: infoProducto[0].Capacidad,
      precio: infoProducto[0].Precio,
      disponibilidad: infoProducto[0].Cantidad,
      imagen: urlImagen,
      cantidad: 1, // Cantidad a comprar, inicializada en 1
    };

    // Agregar producto al carrito
    miCarrito.agregarProducto(producto);
  } catch (error) {
    console.error("Error al buscar el producto:", error); // Mostrar un mensaje de error en caso de fallo
  }
};

let EliminarProducto = (boton) => {
  let idProducto = boton.value;

  // Obtener el elemento que se desea eliminar
  var elementoEliminar = document.querySelector(`.td-${idProducto}`);

  // Eliminar el elemento usando el método remove()
  elementoEliminar.remove();

  // Eliminar el producto del carrito
  miCarrito.eliminarProducto(idProducto);

  // Obtener una referencia al elemento tbody
  let tbodyElement = document.getElementById("mostrarProductosCarrito");

  // Verificar si el tbody está vacío
  if (tbodyElement.childElementCount === 0) {
    lblCarritoVacio.classList.remove("ocultar");
    tablaCarrito.classList.add("ocultar");
  }
};

let VaciarCarrito = () => {
  miCarrito.vaciarCarrito();
};

let MostrarContenidoCarrito = () => {
  miCarrito.mostrarContenido();
};

let RealizarVenta = () => {
  miCarrito.realizarVenta();
};

// FUNCION PARA MOSTRAR MENSAJE CUANDO SE AGREGO UN PRODUCTO AL CARRITO
let mostrarToast = () => {
  var toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = "¡Producto Añadido Al Carrito!";
  document.body.appendChild(toast);

  // Añadir la clase "show" para animar la entrada del toast
  setTimeout(function () {
    toast.classList.add("show");
  }, 100);

  // Ocultar el toast después de 3 segundos
  setTimeout(function () {
    toast.classList.remove("show");

    // Eliminar el elemento del DOM después de la animación de salida
    setTimeout(function () {
      toast.parentNode.removeChild(toast);
    }, 300);
  }, 3000);
};
// FUNCION PARA MOSTRAR MENSAJE CUANDO SE QUIERE AGREGAR UN PRODUCTO YA EXISTENTE EN EL CARRITO
let mostrarToast2 = () => {
  var toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = "¡El Producto Ya Esta En El Carrito!";
  document.body.appendChild(toast);

  // Añadir la clase "show" para animar la entrada del toast
  setTimeout(function () {
    toast.classList.add("show");
  }, 100);

  // Ocultar el toast después de 3 segundos
  setTimeout(function () {
    toast.classList.remove("show");

    // Eliminar el elemento del DOM después de la animación de salida
    setTimeout(function () {
      toast.parentNode.removeChild(toast);
    }, 300);
  }, 3000);
};

//BOTONES PARA QUE LOS LA CANTIDAD DEL INPUT DE CARRITO INCREMENTE O DECREMENTE
let modificarCantidadCarrito = (boton, operacion) => {
  let idInput = boton.value;
  let input = document.getElementById(`input-${idInput}`);
  let cantidad = parseInt(input.value);
  let cantidadMax = parseInt(input.max);

  if (operacion === "incrementar") {
    // Sumar 1 a la cantidad si no se ha alcanzado la cantidad máxima
    if (cantidad < cantidadMax) {
      cantidad += 1;
    }
  } else if (operacion === "diminuir") {
    // Restar 1 a la cantidad si no se ha alcanzado el mínimo de 1
    if (cantidad > 1) {
      cantidad -= 1;
    }
  }

  input.value = cantidad;
  miCarrito.modificarCantidadAComprar(idInput, cantidad);
};


// ES PARA CERRAR SESION PERO TODAVIA NO SE DONDE PONERLO
let cerrarSesión = () => {
  // Limpiar el usuario del localStorage
  let nombre = usuario.Nombre;
  localStorage.removeItem("usuario");

  // Verificar si el usuario ha sido eliminado
  if (!localStorage.getItem("usuario")) {
    alert(`Hasta la proxima ${nombre}`);
    location.reload();
  } else {
    alert("Sucedio un error al cerrar sesión");
    location.reload();
  }
};