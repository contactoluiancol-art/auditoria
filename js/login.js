
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





// ======================
// OCULTAR MODULO
// ======================

function ocultarModulo(id){

  const elemento =

  document.getElementById(id);



  if(elemento){

    elemento.style.display =
    'none';

  }

}





// ======================
// OCULTAR CARD
// ======================

function ocultarCard(id){

  const card =

  document.getElementById(id);



  if(card){

    card.style.display =
    'none';

  }

}





// ======================
// MOSTRAR MODULO
// ======================

function mostrarElemento(id){

  const elemento =

  document.getElementById(id);



  if(elemento){

    elemento.style.display =
    '';

  }

}





// ======================
// MOSTRAR CARD
// ======================

function mostrarCard(id){

  const card =

  document.getElementById(id);



  if(card){

    card.style.display =
    '';

  }

}





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

      mostrarElemento(
        'inventarioMenu'
      );

      mostrarElemento(
        'recepcionMenu'
      );

      mostrarElemento(
        'auditoriasMenu'
      );

      mostrarElemento(
        'usuariosMenu'
      );

      mostrarElemento(
        'historialMenu'
      );



      mostrarCard(
        'cardInventario'
      );

      mostrarCard(
        'cardRecepcion'
      );

      mostrarCard(
        'cardAuditorias'
      );

      mostrarCard(
        'cardUsuarios'
      );

      mostrarCard(
        'cardHistorial'
      );



      return;

    }





    // ======================
    // CONSULTAR PERMISOS
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





    // ======================
    // INVENTARIO
    // ======================

    if(

      window.tienePermiso(
        'inventario',
        'ver'
      )

    ){

      mostrarElemento(
        'inventarioMenu'
      );



      mostrarCard(
        'cardInventario'
      );

    }

    else{

      ocultarModulo(
        'inventarioMenu'
      );



      ocultarCard(
        'cardInventario'
      );

    }





    // ======================
    // RECEPCION
    // ======================

    if(

      window.tienePermiso(
        'recepcion',
        'ver'
      )

    ){

      mostrarElemento(
        'recepcionMenu'
      );



      mostrarCard(
        'cardRecepcion'
      );

    }

    else{

      ocultarModulo(
        'recepcionMenu'
      );



      ocultarCard(
        'cardRecepcion'
      );

    }





    // ======================
    // AUDITORIAS
    // ======================

    if(

      window.tienePermiso(
        'auditorias',
        'ver'
      )

    ){

      mostrarElemento(
        'auditoriasMenu'
      );



      mostrarCard(
        'cardAuditorias'
      );

    }

    else{

      ocultarModulo(
        'auditoriasMenu'
      );



      ocultarCard(
        'cardAuditorias'
      );

    }





    // ======================
    // USUARIOS
    // ======================

    if(

      window.tienePermiso(
        'usuarios',
        'ver'
      )

    ){

      mostrarElemento(
        'usuariosMenu'
      );



      mostrarCard(
        'cardUsuarios'
      );

    }

    else{

      ocultarModulo(
        'usuariosMenu'
      );



      ocultarCard(
        'cardUsuarios'
      );

    }





    // ======================
    // HISTORIAL
    // ======================

    if(

      window.tienePermiso(
        'historial',
        'ver'
      )

    ){

      mostrarElemento(
        'historialMenu'
      );



      mostrarCard(
        'cardHistorial'
      );

    }

    else{

      ocultarModulo(
        'historialMenu'
      );



      ocultarCard(
        'cardHistorial'
      );

    }

  }

  catch(error){

    console.log(error);

  }

}





// ======================
// GUARDAR HISTORIAL
// ======================

window.guardarHistorial = async function(

  accion,
  modulo,
  descripcion

){

  try{

    await window.supabaseClient

    .from('historial')

    .insert([

      {

        usuario:
        window.usuarioLogueado.usuario,

        accion:
        accion,

        modulo:
        modulo,

        descripcion:
        descripcion

      }

    ]);

  }

  catch(error){

    console.log(error);

  }

};

