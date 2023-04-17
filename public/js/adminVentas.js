// const urlBase = "http://localhost:3000/";

const formBuscarPorId = document.getElementById("formBuscarPorId");
const formBuscarPorFecha = document.getElementById("formBuscarPorFecha");
const formBuscarEntreFechas = document.getElementById("formBuscarEntreFechas");
const formBuscarPorTotal = document.getElementById("formBuscarPorTotal");
// const form = document.getElementById("myForm");

document.addEventListener("DOMContentLoaded", function () {
  //Para poder obtener los datos de los alumnos mediante axios
  axios
    .get(`/allVentas`)
    .then(function (response) {
      // La lista de ventas
      const allVentas = response.data;

      // Llamada a una función
        mostrarVentas(allVentas);
    })
    .catch(function (error) {
      console.log(error);
    });
});

let imprimirTabla = (mostrarVentas) => {
  // Obtén la referencia al <template> por su ID
  var templateTable = document.querySelector("#template-tablaVentas");
  // Obtén una referencia al contenedor donde se agregarán las copias del template
  var container = document.querySelector("#mostrarListaVentas");
  container.innerHTML = "";

  for (let i = 0; i < mostrarVentas.length; i++) {
    let venta = mostrarVentas[i];

    let card = templateTable.content.cloneNode(true);

    // Accede a los elementos del template clonado y modifica su contenido
    let idElement = card.querySelector("#tablaVentas-id");
    idElement.textContent = venta.ID;

    let fechaElement = card.querySelector("#tablaVentas-fecha");
    var fecha = new Date(venta.Fecha);

    // Obtiene los componentes de la fecha
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1; // Los meses en JavaScript son base 0, por lo que se suma 1
    var año = fecha.getFullYear();

    // Formatea la fecha en el formato "dd/mm/yyyy"
    var fechaCorregida = dia + "/" + mes + "/" + año;

    fechaElement.textContent = fechaCorregida;

    let totalElement = card.querySelector("#tablaVentas-total");
    totalElement.textContent = `$${venta.Total}`;

    let boton = card.getElementById("tablaVentas-btnVerDatos");
     boton.setAttribute("value", `${venta.ID}`);

    container.appendChild(card);
  }
}
 

// FUNCION PARA MOSTRAR LOS VENTAS REALIZADAS
let mostrarVentas = (allVentas) => {
  // Verificar si el objeto está vacío con un if
  if (Object.keys(allVentas).length === 0) {
    alert(`No se encontraron ventas`);
  } else {
    imprimirTabla(allVentas);
  }
};

let buscarVentaPorId = () => {

    let id = document.getElementById("inputBuscarXId").value;

    axios
      .post(`/buscarVentaPorId`, {
        ID: id, // Corrección del formato del objeto
      })
      .then((response) => {
        // Maneja la respuesta del servidor

        let venta = response.data;

        // Verificar si el objeto está vacío con un if
        if (Object.keys(venta).length === 0) {
          alert(`No se encontraron ventas`);
        } else {
          imprimirTabla(venta);
        }
      })
      .catch((error) => {
        // Maneja el error de la solicitud
        console.error(error);
      });
}

let buscarPorFecha = () => {
const fecha = document.getElementById("inputFecha1").value;

    axios
      .post(`/buscarVentaPorFecha`, {
        Fecha: fecha, // Corrección del formato del objeto
      })
      .then((response) => {
        // Maneja la respuesta del servidor

        let ventas = response.data;

        // Verificar si el objeto está vacío con un if
        if (Object.keys(ventas).length === 0) {
          alert(`No se encontraron ventas`);
        } else {
          imprimirTabla(ventas);
        }
      })
      .catch((error) => {
        // Maneja el error de la solicitud
        console.error(error);
      });
}

let buscarEntreFechas = () => {
  let fecha1 = document.getElementById("inputFecha2").value;
  let fecha2 = document.getElementById("inputFecha3").value;

  axios
    .post(`/buscarVentaEntreFechas`, {
      Fecha1: fecha1,
      Fecha2: fecha2,
    })
    .then((response) => {
      // Maneja la respuesta del servidor

      let ventas = response.data;

      // Verificar si el objeto está vacío con un if
      if (Object.keys(ventas).length === 0) {
        alert(`No se encontraron ventas`);
      } else {
        imprimirTabla(ventas);
      }
    })
    .catch((error) => {
      // Maneja el error de la solicitud
      console.error(error);
    });
}

let buscarPorTotal = () => {
  let comparador = document.getElementById("inputMenorMayor").value;
  let total = document.getElementById("inputTotal").value;

  axios
    .post(`/buscarVentaPorTotal`, {
      Comparador: comparador,
      Total: total,
    })
    .then((response) => {
      // Maneja la respuesta del servidor

      let ventas = response.data;

      // Verificar si el objeto está vacío con un if
      if (Object.keys(ventas).length === 0) {
        alert(`No se encontraron ventas`);
      } else {
        imprimirTabla(ventas);
      }
    })
    .catch((error) => {
      // Maneja el error de la solicitud
      console.error(error);
    });
}



// Agrega un evento de envío (submit) al formulario
formBuscarPorId.addEventListener("submit", function (event) {
  // Previene el envío automático del formulario
  event.preventDefault();

  // Llama a la función que deseas ejecutar en lugar de enviar el formulario
  buscarVentaPorId();
});

// Agrega un evento de envío (submit) al formulario
formBuscarPorFecha.addEventListener("submit", function (event) {
  // Previene el envío automático del formulario
  event.preventDefault();

  // Llama a la función que deseas ejecutar en lugar de enviar el formulario
  buscarPorFecha();
});

// Agrega un evento de envío (submit) al formulario
formBuscarEntreFechas.addEventListener("submit", function (event) {
  // Previene el envío automático del formulario
  event.preventDefault();

  // Llama a la función que deseas ejecutar en lugar de enviar el formulario
  buscarEntreFechas();
});

// Agrega un evento de envío (submit) al formulario
formBuscarPorTotal.addEventListener("submit", function (event) {
  // Previene el envío automático del formulario
  event.preventDefault();

  // Llama a la función que deseas ejecutar en lugar de enviar el formulario
  buscarPorTotal();
});


let mostrarTicket = (boton) =>{
    let id = boton.value;
    let ticketCodigo = document.getElementById("ticket-id");
    ticketCodigo.innerHTML = id;

        axios
          .post(`/obtenerTicket`, {
            ID: id, // Corrección del formato del objeto
          })
          .then((response) => {
            // Maneja la respuesta del servidor

            let datosDeVenta = response.data[0];

            // Verificar si el objeto está vacío con un if
            if (Object.keys(datosDeVenta).length === 0) {
              alert(`No se encontraron ventas`);
              location.reload();
            } else {
              //PRIMERO MUUESTRO LA INFORMACION DEL CLIENTE
              // Obtén la referencia al <template> por su ID
              var templateTicket = document.querySelector("#template-ticket");

              // Obtén una referencia al contenedor donde se agregarán las copias del template
              var container = document.querySelector("#mostrarTicket");
              container.innerHTML = "";

              let ticket = templateTicket.content.cloneNode(true);

              // Accede a los elementos del template clonado y modifica su contenido
              let fechaElement = ticket.querySelector("#ticket-fecha");
              var fecha = new Date(datosDeVenta[0].Fecha);

              // Obtiene los componentes de la fecha
              var dia = fecha.getDate();
              var mes = fecha.getMonth() + 1; // Los meses en JavaScript son base 0, por lo que se suma 1
              var año = fecha.getFullYear();

              // Formatea la fecha en el formato "dd/mm/yyyy"
              var fechaCorregida = dia + "/" + mes + "/" + año;

              fechaElement.textContent = fechaCorregida;

              let userNombreElement =
                ticket.querySelector("#ticket-userNombre");
              userNombreElement.textContent = datosDeVenta[0].Nombre;

              let userTelefonoElement = ticket.querySelector(
                "#ticket-userTelefono"
              );
              userTelefonoElement.textContent = datosDeVenta[0].Telefono;

              let userDomicilioElement = ticket.querySelector(
                "#ticket-userDomicilio"
              );
              userDomicilioElement.textContent = datosDeVenta[0].Domicilio;

              let userCorreoElement =
                ticket.querySelector("#ticket-userCorreo");
              userCorreoElement.textContent = datosDeVenta[0].Correo;

              let metodoPagoElement =
                ticket.querySelector("#ticket-metodoPago");
              metodoPagoElement.textContent = datosDeVenta[0].MetodoPago;

              container.appendChild(ticket);

              //AHORA SE MUESTRA LA INFORMACION DE LOS PRODUCTOS QUE COMPRO
              var templateListaTicket = document.querySelector(
                "#template-ticket-produtos"
              );

              var container2 = document.querySelector("#ticket-listaProductos");

              container2.innerHTML = "";

              for (var i = 0; i < datosDeVenta.length; i++) {
                var venta = datosDeVenta[i];

                let listaProductos =
                  templateListaTicket.content.cloneNode(true);

                let nombreProductoElement = listaProductos.querySelector(
                  "#ticket-productoDatos"
                );
                nombreProductoElement.textContent = `${venta.Marca} | ${venta.Modelo} ${venta.Capacidad}`;

                let cantidadProductoElement = listaProductos.querySelector(
                  "#ticket-productoCantidad"
                );
                cantidadProductoElement.textContent = `Cantidad: ${venta.Cantidad}`;

                let precioProductoElement = listaProductos.querySelector(
                  "#ticket-productoPrecio"
                );
                precioProductoElement.textContent = `$${venta.Subtotal}`;

                container2.appendChild(listaProductos);
              }

              document.getElementById("ticket-total").innerHTML =
                datosDeVenta[0].Total;
            }
          })
          .catch((error) => {
            // Maneja el error de la solicitud
            console.error(error);
          });

}