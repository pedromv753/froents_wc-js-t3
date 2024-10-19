window.addEventListener('load', function () {
    const msgSucces = this.document.getElementById('msgSucces');
    const msgError = this.document.getElementById('msgError');
    const result = JSON.parse(this.localStorage.getItem('result'));
    const btnLogout = this.document.getElementById('btnLogout');
    const resultLogout = JSON.parse(this.localStorage.getItem('resultLogout'));
    // mostrar nombre de usuario en alerta
    mostrarAlerta(`Bienvenido ${result.nombreUsuario}`);
    
    
    if (resultLogout) {
        mostrarError(`${resultLogout.mensajeError}`);
    }

    btnLogout.addEventListener('click', function (event) {
        event.preventDefault();  // Prevenir que el enlace navegue por defecto
        logout();  // Llamar a la función logout
    });

});
function mostrarError(mensaje){
    msgError.innerHTML = mensaje;
     msgError.style.display = 'block';
     setTimeout(() => {
        ocultarAlerta();
    }, 3000);
}
function mostrarAlerta(mensaje) {
    msgSucces.innerHTML = mensaje;
    msgSucces.style.display = 'block';
    setTimeout(() => {
        ocultarAlerta();
    }, 5000);
}
function ocultarAlerta(mensaje){
    msgError.innerHTML = '';
     msgError.style.display = 'none';
}


async function logout() {
    //Consumiendo con FeignClient
    const url = 'http://localhost:8082/loginfeign/logout-async';
   // Consumir con WebClient const url = 'http://localhost:8082/login/logout-async';

    const result = JSON.parse(localStorage.getItem('result'));
    console.log(result)

    if (!result) {
        console.error("No se encontró el item 'result' en localStorage.");
        return;
    }
    const responseBody = {
        tipoDocumento: result.tipoDocumento,
        numeroDocumento: result.numeroDocumento
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(responseBody)
        });
        if (!response.ok) {
            console.error('Error al cerrar sesión: ', response.statusText);
            throw new Error(`Error: ${response.statusText}`);
        }

        const resultLogout = await response.json();
        console.log(resultLogout)
        console.log('Respuesta del servidor: ', resultLogout);

        if (resultLogout.resultado === true) {
            localStorage.setItem('resultLogout', JSON.stringify(resultLogout));
            localStorage.removeItem('result');
            window.location.replace('index.html');
        } else {
            localStorage.setItem('resultLogout', JSON.stringify(resultLogout));
            mostrarError(resultLogout.mensajeError);
        }
    } catch (error) {
        console.error('Error: Ocurrio un problema ', error);
        mostrarAlerta('Error: Ocurrio un problema ')
    }
};