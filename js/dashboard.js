// ======================
// VALIDAR LIBRERIA SUPABASE
// ======================

if(!window.supabase){

  alert(
    'Supabase no cargó correctamente'
  );

  throw new Error(
    'Supabase no cargó correctamente'
  );

}





// ======================
// CONEXION GLOBAL SUPABASE
// ======================

const supabaseUrl =
'https://hurxdjoiafkjoyrmyhbd.supabase.co';



const supabaseKey =
'eyJhbGciOiJIUzI1NiIsInJlYiI6Imh1cnhkam9pYWZram95cm15aGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MzgxMTMsImV4cCI6MjA5NTMxNDExM30.Z6fRiWft3eSEVNZbWflmcvVcHAJTAEA37tPdp4LRnTg';





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
// MAIN CONTENT
// ======================

const mainContent =

document.getElementById(
  'mainContent'
);





// ======================
// DASHBOARD ORIGINAL
// ======================

const dashboardOriginal =

mainContent
? mainContent.innerHTML
: '';





// ======================
// PERMISOS GLOBALES
// ======================

window.permisosUsuario = {};





// ======================
// MOSTRAR USUARIO
// ======================

const usuarioNombre =

document.getElementById(
  'usuarioNombre'
);





if(usuarioNombre){

  usuarioNombre.innerText =

  window.usuarioLogueado.usuario +

  ' | ' +

  window.usuarioLogueado.rol;

}





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
// MOSTRAR ELEMENTO
// ======================

function mostrarElemento(id){

  const elemento =

  document.getElementById(id);





  if(elemento){

    elemento.style.display = '';

  }

}





// ======================
// OCULTAR ELEMENTO
// ======================

function ocultarElemento(id){

  const elemento =

  document.getElementById(id);





  if(elemento){

    elemento.style.display = 'none';

  }

}





// ======================
// MOSTRAR CARD
// ======================

function mostrarCard(id){

  const card =

  document.getElementById(id);





  if(card){

    card.style.display = '';

  }

}





// ======================
// OCULTAR CARD
// ======================

function ocultarCard(id){

  const card =

  document.getElementById(id);





  if(card){

    card.style.display = 'none';

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





    if(response.error){

      console.log(
        response.error
      );

      return;

    }





    const permisos =
    response.data || [];





    // ======================
    // LIMPIAR
    // ======================

    window.permisosUsuario = {};





    // ======================
    // MAPA
    // ======================

    permisos.forEach(function(item){

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

      ocultarElemento(
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

      ocultarElemento(
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

      ocultarElemento(
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

      ocultarElemento(
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

      ocultarElemento(
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





// ======================
// RENDER NOTIFICACIONES
// ======================

function renderNotificaciones(){

  const lista =

  document.getElementById(
    'listaNotificaciones'
  );



  if(!lista){

    return;

  }



  const notificaciones =

  JSON.parse(

    localStorage.getItem(
      'notificaciones'
    )

  ) || [];



  lista.innerHTML = '';



  // ======================
  // SIN NOTIFICACIONES
  // ======================

  if(notificaciones.length === 0){

    lista.innerHTML =

    '<p class="sin-notificaciones">' +

      'No hay notificaciones' +

    '</p>';



    return;

  }



  // ======================
  // RECORRER
  // ======================

  notificaciones.reverse().forEach(function(item){

    lista.innerHTML +=

    '<div class="notificacion-item">' +

      '<p>' + item.mensaje + '</p>' +

      '<span>' + item.fecha + '</span>' +

    '</div>';

  });

}





// ======================
// EVENTO NUEVA NOTIFICACION
// ======================

window.addEventListener(

  'nuevaNotificacion',

  function(){

    renderNotificaciones();

  }

);





// ======================
// MOSTRAR MODULO
// ======================

function mostrarModulo(modulo){

  const contenido =

  document.getElementById(
    'mainContent'
  );



  if(!contenido){

    return;

  }



  // ======================
  // DASHBOARD
  // ======================

  if(modulo === 'dashboard'){

    contenido.innerHTML =
    dashboardOriginal;



    setTimeout(function(){

      aplicarPermisos();

      renderNotificaciones();

    },100);



    return;

  }



  // ======================
  // INVENTARIO
  // ======================

  if(modulo === 'inventario'){

    cargarModulo(

      contenido,

      'modules/inventario.html',

      'inventarioScript',

      'js/inventario.js?v=30'

    );

  }



  // ======================
  // RECEPCION
  // ======================

  else if(modulo === 'recepcion'){

    cargarModulo(

      contenido,

      'modules/recepcion.html',

      'recepcionScript',

      'js/recepcion.js?v=30'

    );

  }



  // ======================
  // AUDITORIAS
  // ======================

  else if(modulo === 'auditorias'){

    cargarModulo(

      contenido,

      'modules/auditorias.html',

      'auditoriasScript',

      'js/auditorias.js?v=30'

    );

  }



  // ======================
  // USUARIOS
  // ======================

  else if(modulo === 'usuarios'){

    cargarModulo(

      contenido,

      'modules/usuarios.html',

      'usuariosScript',

      'js/usuarios.js?v=30'

    );

  }



  // ======================
  // HISTORIAL
  // ======================

  else if(modulo === 'historial'){

    cargarModulo(

      contenido,

      'modules/historial.html',

      'historialScript',

      'js/historial.js?v=30'

    );

  }

}





// ======================
// CARGAR MODULO
// ======================

function cargarModulo(

  contenido,
  htmlPath,
  scriptId,
  scriptSrc

){

  fetch(htmlPath)

  .then(function(res){

    return res.text();

  })

  .then(function(html){

    contenido.innerHTML =
    html;



    cargarScript(

      scriptId,
      scriptSrc

    );

  })

  .catch(function(error){

    console.log(error);

  });

}





// ======================
// CARGAR SCRIPT
// ======================

function cargarScript(

  id,
  src

){

  const anterior =

  document.getElementById(id);





  if(anterior){

    anterior.remove();

  }





  const script =

  document.createElement(
    'script'
  );





  script.src = src;

  script.id = id;





  document.body.appendChild(
    script
  );

}





// ======================
// CERRAR SESION
// ======================

function cerrarSesion(){

  localStorage.removeItem(
    'usuarioLogueado'
  );



  window.location.href =
  'index.html';

}





// ======================
// BOTON CERRAR SESION
// ======================

const cerrarSesionBtn =

document.getElementById(
  'cerrarSesionBtn'
);





if(cerrarSesionBtn){

  cerrarSesionBtn.addEventListener(

    'click',

    cerrarSesion

  );

}





// ======================
// MENU DASHBOARD
// ======================

const dashboardMenu =

document.getElementById(
  'dashboardMenu'
);





if(dashboardMenu){

  dashboardMenu.addEventListener(

    'click',

    function(){

      mostrarModulo(
        'dashboard'
      );

    }

  );

}





// ======================
// MENU INVENTARIO
// ======================

const inventarioMenu =

document.getElementById(
  'inventarioMenu'
);





if(inventarioMenu){

  inventarioMenu.addEventListener(

    'click',

    function(){

      mostrarModulo(
        'inventario'
      );

    }

  );

}





// ======================
// MENU RECEPCION
// ======================

const recepcionMenu =

document.getElementById(
  'recepcionMenu'
);





if(recepcionMenu){

  recepcionMenu.addEventListener(

    'click',

    function(){

      mostrarModulo(
        'recepcion'
      );

    }

  );

}





// ======================
// MENU AUDITORIAS
// ======================

const auditoriasMenu =

document.getElementById(
  'auditoriasMenu'
);





if(auditoriasMenu){

  auditoriasMenu.addEventListener(

    'click',

    function(){

      mostrarModulo(
        'auditorias'
      );

    }

  );

}





// ======================
// MENU USUARIOS
// ======================

const usuariosMenu =

document.getElementById(
  'usuariosMenu'
);





if(usuariosMenu){

  usuariosMenu.addEventListener(

    'click',

    function(){

      mostrarModulo(
        'usuarios'
      );

    }

  );

}





// ======================
// MENU HISTORIAL
// ======================

const historialMenu =

document.getElementById(
  'historialMenu'
);





if(historialMenu){

  historialMenu.addEventListener(

    'click',

    function(){

      mostrarModulo(
        'historial'
      );

    }

  );

}





// ======================
// EVENTOS CARDS DASHBOARD
// ======================

document.addEventListener(

  'click',

  function(e){

    const card =

    e.target.closest(
      '.dashboard-card'
    );



    if(!card){

      return;

    }



    // ======================
    // INVENTARIO
    // ======================

    if(card.id === 'cardInventario'){

      mostrarModulo(
        'inventario'
      );

    }



    // ======================
    // RECEPCION
    // ======================

    else if(card.id === 'cardRecepcion'){

      mostrarModulo(
        'recepcion'
      );

    }



    // ======================
    // AUDITORIAS
    // ======================

    else if(card.id === 'cardAuditorias'){

      mostrarModulo(
        'auditorias'
      );

    }



    // ======================
    // USUARIOS
    // ======================

    else if(card.id === 'cardUsuarios'){

      mostrarModulo(
        'usuarios'
      );

    }



    // ======================
    // HISTORIAL
    // ======================

    else if(card.id === 'cardHistorial'){

      mostrarModulo(
        'historial'
      );

    }

  }

);





// ======================
// INICIO
// ======================

aplicarPermisos();

renderNotificaciones();
