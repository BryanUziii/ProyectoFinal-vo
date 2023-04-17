// const urlBase = "http://localhost:3000/";

const usuario = JSON.parse(localStorage.getItem("usuario"));


const btnsIniciarSesion = document.getElementById("btnsIniciarSesion");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
const mostrarNombreUsuario = document.getElementById("nombreUsuario");

document.addEventListener("DOMContentLoaded", function () {
  if (usuario == null) {
    console.log("Sin Usuario");
  } else {
    console.log(`Usuario: ${usuario.ID}`);
    btnsIniciarSesion.classList.add("ocultar");
    btnCerrarSesion.classList.remove("ocultar");
    mostrarNombreUsuario.innerHTML = "";
    mostrarNombreUsuario.innerHTML = usuario.Nombre;
  }
});

// ES PARA CERRAR SESION PERO TODAVIA NO SE DONDE PONERLO
let cerrarSesión = () => {
  // Limpiar el usuario del localStorage
  let nombre = usuario.Nombre;
  localStorage.removeItem("usuario");

  // Verificar si el usuario ha sido eliminado
  if (!localStorage.getItem("usuario")) {

    alert(`¡Hasta luego, ${nombre}! ¡Que tengas un excelente día!`);
    location.reload();
  } else {
    alert("Sucedio un error al cerrar sesión");
    location.reload();
  }
};


