
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
// CLIENTE GLOBAL
// ======================

if(!window.supabaseClient){

  const supabaseUrl =
  'https://hurxdjoiafkjoyrmyhbd.supabase.co';

  const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1cnhkam9pYWZram95cm15aGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MzgxMTMsImV4cCI6MjA5NTMxNDExM30.Z6fRiWft3eSEVNZbWflmcvVcHAJTAEA37tPdp4LRnTg';

  window.supabaseClient =

  window.supabase.createClient(

    supabaseUrl,
    supabaseKey

  );

}





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
// PERMISOS
// ======================

window.permisosUsuario =

window.permisosUsuario || {};





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
// VALIDAR PERMISOS
// ======================

window.tienePermiso = function(

  modulo,
  accion

){

  if(

    window.usuarioLogueado &&
    window.usuarioLogueado.rol === 'admin'

  ){

    return true;

  }

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

    window.permisosUsuario = {};

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

    validarModulo(
      'inventario'
    );

    validarModulo(
      'recepcion'
    );

    validarModulo(
      'auditorias'
    );

    validarModulo(
      'usuarios'
    );

    validarModulo(
      'historial'
    );

  }

  catch(error){

    console.log(error);

  }

}





// ======================
// VALIDAR MODULO
// ======================

function validarModulo(modulo){

  const menu =
  modulo + 'Menu';

  const card =
  'card' +

  modulo.charAt(0)
  .toUpperCase() +

  modulo.slice(1);

  if(

    window.tienePermiso(
      modulo,
      'ver'
    )

  ){

    mostrarElemento(menu);

    mostrarCard(card);

  }

  else{

    ocultarElemento(menu);

    ocultarCard(card);

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

window.renderNotificaciones = function(){

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

  const contador =

  document.getElementById(
    'contadorNotificaciones'
  );

  if(contador){

    contador.innerText =

    notificaciones.length;

  }

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

      '<p>' +

        item.mensaje +

      '</p>' +

      '<span>' +

        item.fecha +

      '</span>' +

    '</div>';

  });

};





// ======================
// LIMPIAR NOTIFICACIONES
// ======================

window.limpiarNotificaciones = function(){

  localStorage.removeItem(
    'notificaciones'
  );

  window.renderNotificaciones();

};





// ======================
// ABRIR / CERRAR PANEL
// ======================

const campanaBtn =

document.getElementById(
  'campanaBtn'
);

const panelNotificaciones =

document.getElementById(
  'panelNotificaciones'
);

if(

  campanaBtn &&
  panelNotificaciones

){

  campanaBtn.addEventListener(

    'click',

    function(){

      panelNotificaciones.classList.toggle(
        'activo'
      );

    }

  );

}





// ======================
// EVENTO NOTIFICACIONES
// ======================

window.addEventListener(

  'nuevaNotificacion',

  function(){

    window.renderNotificaciones();

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

  if(modulo === 'dashboard'){

    contenido.innerHTML =
    dashboardOriginal;

    setTimeout(function(){

      aplicarPermisos();

      window.renderNotificaciones();

    },100);

    return;

  }

  cargarModulo(

    contenido,

    'modules/' + modulo + '.html',

    modulo + 'Script',

    'js/' + modulo + '.js?v=30'

  );

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
// ACTIVAR MENU
// ======================

function activarMenu(id,modulo){

  const elemento =

  document.getElementById(id);

  if(elemento){

    elemento.addEventListener(

      'click',

      function(){

        mostrarModulo(
          modulo
        );

      }

    );

  }

}





// ======================
// MENUS
// ======================

activarMenu(
  'dashboardMenu',
  'dashboard'
);

activarMenu(
  'inventarioMenu',
  'inventario'
);

activarMenu(
  'recepcionMenu',
  'recepcion'
);

activarMenu(
  'auditoriasMenu',
  'auditorias'
);

activarMenu(
  'usuariosMenu',
  'usuarios'
);

activarMenu(
  'historialMenu',
  'historial'
);





// ======================
// CARDS DASHBOARD
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

    if(card.id === 'cardInventario'){

      mostrarModulo(
        'inventario'
      );

    }

    else if(card.id === 'cardRecepcion'){

      mostrarModulo(
        'recepcion'
      );

    }

    else if(card.id === 'cardAuditorias'){

      mostrarModulo(
        'auditorias'
      );

    }

    else if(card.id === 'cardUsuarios'){

      mostrarModulo(
        'usuarios'
      );

    }

    else if(card.id === 'cardHistorial'){

      mostrarModulo(
        'historial'
      );

    }

  }

);

// ======================
// AUTO REFRESH GLOBAL
// ======================

window.iniciarAutoRefresh = function(){

  // ======================
  // LIMPIAR ANTERIOR
  // ======================

  if(window.autoRefreshSistema){

    clearInterval(
      window.autoRefreshSistema
    );

  }

  // ======================
  // NUEVO INTERVALO
  // ======================

  window.autoRefreshSistema =

  setInterval(async function(){

    try{

      // ======================
      // NOTIFICACIONES
      // ======================

      if(

        typeof window.renderNotificaciones ===
        'function'

      ){

        window.renderNotificaciones();

      }

      // ======================
      // AUDITORIAS
      // ======================

      if(

        typeof window.renderAuditorias ===
        'function'

      ){

        await window.renderAuditorias();

      }

      // ======================
      // RECEPCION
      // ======================

      if(

        typeof window.renderRecepciones ===
        'function'

      ){

        await window.renderRecepciones();

      }

      // ======================
      // KPIS RECEPCION
      // ======================

      if(

        typeof window.actualizarKPIsRecepcion ===
        'function'

      ){

        await window.actualizarKPIsRecepcion();

      }

      // ======================
      // HISTORIAL
      // ======================

      if(

        typeof window.renderHistorialSistema ===
        'function'

      ){

        await window.renderHistorialSistema();

      }

      // ======================
      // INVENTARIO
      // ======================

      if(

        typeof window.renderInventario ===
        'function'

      ){

        window.renderInventario();

      }

      // ======================
      // KPIS INVENTARIO
      // ======================

      if(

        typeof window.actualizarKPIs ===
        'function'

      ){

        window.actualizarKPIs();

      }

    }

    catch(error){

      console.log(
        'Error auto refresh:',
        error
      );

    }

  },5000);

};


// ======================
// CAMPANA NOTIFICACIONES
// ======================

const campanaBtn =

document.getElementById(
  'campanaBtn'
);





const panelNotificaciones =

document.getElementById(
  'panelNotificaciones'
);





const contadorNotificaciones =

document.getElementById(
  'contadorNotificaciones'
);





// ======================
// ABRIR / CERRAR PANEL
// ======================

if(campanaBtn){

  campanaBtn.addEventListener(

    'click',

    function(e){

      e.stopPropagation();





      if(panelNotificaciones){

        panelNotificaciones.classList.toggle(
          'active'
        );

      }

    }

  );

}





// ======================
// CERRAR AL HACER CLICK AFUERA
// ======================

document.addEventListener(

  'click',

  function(e){

    if(

      panelNotificaciones &&

      !panelNotificaciones.contains(
        e.target
      )

    ){

      panelNotificaciones.classList.remove(
        'active'
      );

    }

  }

);





// ======================
// RENDER NOTIFICACIONES
// ======================

window.renderNotificaciones = function(){

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





  // ======================
  // CONTADOR
  // ======================

  if(contadorNotificaciones){

    contadorNotificaciones.innerText =

    notificaciones.length;

  }





  // ======================
  // SIN DATOS
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

  notificaciones.forEach(function(item){

    lista.innerHTML +=

    '<div class="notificacion-item">' +

      '<p>' +

      item.mensaje +

      '</p>' +

      '<span>' +

      item.fecha +

      '</span>' +

    '</div>';

  });

};





// ======================
// LIMPIAR NOTIFICACIONES
// ======================

window.limpiarNotificaciones = function(){

  localStorage.removeItem(
    'notificaciones'
  );





  window.renderNotificaciones();

};





// ======================
// EVENTO NUEVA NOTIFICACION
// ======================

window.addEventListener(

  'nuevaNotificacion',

  function(){

    window.renderNotificaciones();

  }

);





// ======================
// INICIO
// ======================

window.renderNotificaciones();


// ======================
// INICIAR REFRESH
// ======================

window.iniciarAutoRefresh();



// ======================
// INICIO
// ======================

aplicarPermisos();

window.renderNotificaciones();

