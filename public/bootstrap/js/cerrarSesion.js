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
