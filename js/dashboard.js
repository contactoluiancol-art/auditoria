
// ======================
// VALIDAR LIBRERIA SUPABASE
// ======================

if(!window.supabase){

  alert(
    'Supabase no cargó correctamente'
  );

}





// ======================
// CONEXION GLOBAL SUPABASE
// ======================

const supabaseUrl =
'https://hurxdjoiafkjoyrmyhbd.supabase.co';



const supabaseKey =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1cnhkam9pYWZram95cm15aGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MzgxMTMsImV4cCI6MjA5NTMxNDExM30.Z6fRiWft3eSEVNZbWflmcvVcHAJTAEA37tPdp4LRnTg';





// ======================
// CLIENTE GLOBAL
// ======================

window.supabaseClient =

window.supabase.createClient(

  supabaseUrl,
  supabaseKey

);





// ======================
// USUARIO LOGUEADO
// ======================

window.usuarioLogueado =

JSON.parse(

  localStorage.getItem(
    'usuarioLogueado'
  )

);





// ======================
// VALIDAR SESION
// ======================

if(!window.usuarioLogueado){

  window.location.href =
  'index.html';

}





// ======================
// PERMISOS GLOBALES
// ======================

window.permisosUsuario = {};





// ======================
// MOSTRAR USUARIO
// ======================

document.getElementById(
  'usuarioNombre'
).innerText =

window.usuarioLogueado.usuario +

' | ' +

window.usuarioLogueado.rol;





// ======================
// FUNCION GLOBAL PERMISOS
// ======================

window.tienePermiso = function(

  modulo,
  accion

){

  // ======================
  // ADMIN
  // ======================

  if(

    window.usuarioLogueado &&
    window.usuarioLogueado.rol === 'admin'

  ){

    return true;

  }





  // ======================
  // VALIDAR
  // ======================

  if(

    !window.permisosUsuario ||

    !window.permisosUsuario[modulo]

  ){

    return false;

  }





  return Boolean(

    window.permisosUsuario[modulo][accion]

  );

};





// ======================
// APLICAR PERMISOS
// ======================

async function aplicarPermisos(){

  try{

    // ======================
    // ADMIN
    // ======================

    if(

      window.usuarioLogueado.rol === 'admin'

    ){

      return;

    }





    // ======================
    // CONSULTAR
    // ======================

    const response =

    await window.supabaseClient

    .from('permisos')

    .select('*')

    .eq(

      'usuario',

      window.usuarioLogueado.usuario

    );





    const permisos =
    response.data || [];





    // ======================
    // LIMPIAR
    // ======================

    window.permisosUsuario = {};





    // ======================
    // MAPA
    // ======================

    permisos.forEach(item => {

      window.permisosUsuario[
        item.modulo
      ] = {

        ver:
        item.ver,

        crear:
        item.crear,

        editar:
        item.editar,

        eliminar:
        item.eliminar

      };

    });

  }

  catch(error){

    console.log(error);

  }

}





// ======================
// INICIO
// ======================

aplicarPermisos();
```
