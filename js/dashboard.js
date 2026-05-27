
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

const usuarioLogueado =

JSON.parse(

  localStorage.getItem(
    'usuarioLogueado'
  )

);





// ======================
// VALIDAR SESION
// ======================

if(!usuarioLogueado){

  window.location.href =
  'index.html';

}





// ======================
// VARIABLES GLOBALES
// ======================

const rol =
usuarioLogueado.rol;



const dashboardOriginal =

document.getElementById(
  'mainContent'
).innerHTML;





// ======================
// MOSTRAR USUARIO
// ======================

document.getElementById(
  'usuarioNombre'
).innerText =

usuarioLogueado.usuario +

' | ' +

usuarioLogueado.rol;





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
// APLICAR PERMISOS
// ======================

function aplicarPermisos(){

  // ======================
  // LIDER
  // ======================

  if(rol === 'lider'){

    ocultarModulo(
      'inventarioMenu'
    );

    ocultarModulo(
      'auditoriasMenu'
    );

    ocultarModulo(
      'usuariosMenu'
    );

    ocultarModulo(
      'historialMenu'
    );



    ocultarCard(
      'cardInventario'
    );

    ocultarCard(
      'cardAuditorias'
    );

    ocultarCard(
      'cardUsuarios'
    );

    ocultarCard(
      'cardHistorial'
    );

  }



  // ======================
  // AUDITOR
  // ======================

  if(rol === 'auditor'){

    ocultarModulo(
      'usuariosMenu'
    );

    ocultarCard(
      'cardUsuarios'
    );

  }



  // ======================
  // JEFE
  // ======================

  if(rol === 'jefe'){

    ocultarModulo(
      'usuariosMenu'
    );

    ocultarCard(
      'cardUsuarios'
    );

  }

}





// ======================
// GUARDAR HISTORIAL
// ======================

async function guardarHistorial(

  accion,
  modulo,
  descripcion

){

  const usuario =

  usuarioLogueado &&
  usuarioLogueado.usuario

  ? usuarioLogueado.usuario

  : 'Sistema';



  const response =

  await window.supabaseClient

  .from('historial')

  .insert([

    {

      usuario: usuario,

      accion: accion,

      modulo: modulo,

      descripcion: descripcion

    }

  ]);



  const error =
  response.error;



  if(error){

    console.log(
      'Error historial:',
      error
    );

  }

}





// ======================
// MOSTRAR MODULOS
// ======================

function mostrarModulo(modulo){

  const contenido =

  document.getElementById(
    'mainContent'
  );



  const notificacionesBox =

  document.getElementById(
    'notificacionesBox'
  );



  // ======================
  // DASHBOARD
  // ======================

  if(modulo === 'dashboard'){

    contenido.innerHTML =
    dashboardOriginal;



    aplicarPermisos();



    if(notificacionesBox){

      notificacionesBox.style.display =
      'flex';

    }



    if(typeof renderNotificaciones === 'function'){

      renderNotificaciones();

    }



    return;

  }



  // ======================
  // OCULTAR NOTIFICACIONES
  // ======================

  if(notificacionesBox){

    notificacionesBox.style.display =
    'none';

  }



  // ======================
  // INVENTARIO
  // ======================

  if(modulo === 'inventario'){

    cargarModulo(

      contenido,

      'modules/inventario.html',

      'inventarioScript',

      'js/inventario.js?v=20',

      function(){

        if(typeof renderInventario === 'function'){

          renderInventario();

        }



        if(typeof actualizarKPIs === 'function'){

          actualizarKPIs();

        }

      }

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

      'js/auditorias.js?v=20',

      function(){

        if(typeof renderAuditorias === 'function'){

          renderAuditorias();

        }

      }

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

      'js/usuarios.js?v=20',

      function(){

        if(typeof renderUsuarios === 'function'){

          renderUsuarios();

        }

      }

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

      'js/recepcion.js?v=20'

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

      'js/historial.js?v=20',

      function(){

        if(typeof renderHistorialSistema === 'function'){

          renderHistorialSistema();

        }

      }

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
  scriptSrc,
  callback

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
      scriptSrc,
      callback
    );

  });

}





// ======================
// CARGAR SCRIPT
// ======================

function cargarScript(

  id,
  src,
  callback

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



  script.onload = function(){

    if(callback){

      callback();

    }

  };



  document.body.appendChild(
    script
  );

}





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



  let notificaciones =

  JSON.parse(

    localStorage.getItem(
      'notificaciones'
    )

  ) || [];



  lista.innerHTML = '';



  if(notificaciones.length === 0){

    lista.innerHTML =

    '<p class="sin-notificaciones">' +

      'No hay notificaciones' +

    '</p>';



    return;

  }



  notificaciones.forEach(function(item){

    lista.innerHTML +=

    '<div class="notificacion-item">' +

      '<p>' + item.mensaje + '</p>' +

      '<span>' + item.fecha + '</span>' +

    '</div>';

  });

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
// EVENTOS MENU
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



    const acciones = {

      cardInventario:
      'inventario',

      cardAuditorias:
      'auditorias',

      cardRecepcion:
      'recepcion',

      cardUsuarios:
      'usuarios',

      cardHistorial:
      'historial'

    };



    const modulo =
    acciones[card.id];



    if(modulo){

      mostrarModulo(
        modulo
      );

    }

  }

);





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
// INICIO
// ======================

aplicarPermisos();

renderNotificaciones();

