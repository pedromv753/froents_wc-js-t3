//se ejecuta cuando la pagina haya cargado completamente (DOM,CSS,IMAGENES,ETC)
//En caso desees ejecutar el JS apenas se haya cargado el DOM, puedes usar 2 tecnicas
// -> document.addEventListener('DOMContentLoaded',{});
//-> <script type="module" src="js/inicio.js" defer></script>
window.addEventListener('load', function(){
    
    //referenciar los controles del formulario
    const tipoDocumento = this.document.getElementById('tipoDocumento');
    const numeroDocumento = this.document.getElementById('numeroDocumento');
    const password = this.document.getElementById('password');
    const btnIngresar = this.document.getElementById('btnIngresar');
    const msgError = this.document.getElementById('msgError');
    const msgSucces = this.document.getElementById('msgSucces');
    const resultLogout = JSON.parse(this.localStorage.getItem('resultLogout'));

    if (resultLogout) {
        mostrarAlerta(`${resultLogout.mensajeError}`);
    }
    

    //implementar listener del boton
    btnIngresar.addEventListener('click',function(){
        //validar campos del formulario
        if(tipoDocumento.value === null || tipoDocumento.value.trim() === ''||
            numeroDocumento.value === null || numeroDocumento.value.trim() === ''||
            password.value === null || password.value.trim() === '' ){
                mostrarAlerta('Error: Debe completar correctamente sus credenciales');
                
                return;
            }
            ocultarAlerta();
            autenticar();
    });

});

function mostrarAlerta(mensaje){
    msgError.innerHTML = mensaje;
     msgError.style.display = 'block';
     setTimeout(() => {
        ocultarAlerta();
    }, 3000);
}
function ocultarAlerta(mensaje){
    msgError.innerHTML = '';
     msgError.style.display = 'none';
}
async function autenticar(){

    const url = 'http://localhost:8082/login/autenticar-async';
    const request = {
        tipoDocumento : tipoDocumento.value,
        numeroDocumento: numeroDocumento.value,
        password: password.value
    };

    try{
        const response = await fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(request)
    });
    if(!response.ok){
        mostrarAlerta('Error: Ocurrio un problema con la autenticacion');
        throw new Error(`Error: ${response.statusText}`);
    }
    //validar respuesta
    const result = await response.json();
    console.log('Respuesta del servidor: ', result);

    if(result.codigo === '00'){
        localStorage.setItem('result',JSON.stringify(result));
        localStorage.removeItem('resultLogout');
        window.location.replace('principal.html');
    }else{
        mostrarAlerta(result.mensaje);
    }
        

    }catch(error){
        console.log('Error: Ocurrió un problema ', error);
        mostrarAlerta('Error: Ocurrio un problema ')
    }
}