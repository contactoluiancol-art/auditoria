
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
'TU_SUPABASE_KEY';





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
// VARIABLES GLOBALES
// ======================

const dashboardOriginal =

document.getElementById(
  'mainContent'
).innerHTML;





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

