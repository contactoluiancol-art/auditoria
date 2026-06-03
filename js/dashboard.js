// ======================
// VALIDAR SUPABASE
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
// CREAR CLIENTE
// ======================

if(!window.supabaseClient){

  const supabaseUrl =
  'https://hurxdjoiafkjoyrmyhbd.supabase.co';

  const supabaseKey =
  'TU_KEY_SUPABASE';

  window.supabaseClient =

  window.supabase.createClient(

    supabaseUrl,
    supabaseKey

  );

}





// ======================
// USUARIO
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
// VARIABLES
// ======================

const mainContent =

document.getElementById(
  'mainContent'
);





const dashboardOriginal =

mainContent
? mainContent.innerHTML
: '';





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
// MOSTRAR / OCULTAR
// ======================

function mostrarElemento(id){

  const elemento =

  document.getElementById(id);

  if(elemento){

    elemento.style.display = '';

  }

}





function ocultarElemento(id){

  const elemento =

  document.getElementById(id);

  if(elemento){

    elemento.style.display = 'none';

  }

}





function mostrarCard(id){

  const card =

  document.getElementById(id);

  if(card){

    card.style.display = '';

  }

}





function ocultarCard(id){

  const card =

  document.getElementById(id);

  if(card){

    card.style.display = 'none';

  }

}





// ======================
// VALIDAR MODULOS
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
// APLICAR PERMISOS
// ======================

async function aplicarPermisos(){

  try{

    // ======================
    // ADMIN
    // ======================

    if(

      window.usuarioLogueado.rol ===
      'admin'

    ){

      [

        'inventario',
        'recepcion',
        'auditorias',
        'usuarios',
        'historial'

      ].forEach(validarModulo);





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







    [

      'inventario',
      'recepcion',
      'auditorias',
      'usuarios',
      'historial'

    ].forEach(validarModulo);

  }

  catch(error){

    console.log(error);

  }

}





// ======================
// HISTORIAL
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
// NOTIFICACIONES
// ======================

window.renderNotificaciones = function(){

  const lista =

  document.getElementById(
    'listaNotificaciones'
  );





  const contador =

  document.getElementById(
    'contadorNotificaciones'
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







  if(contador){

    contador.innerText =

    notificaciones.length;

  }







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
// CAMPANA
// ======================

const campanaBtn =

document.getElementById(
  'campanaBtn'
);





const panelNotificaciones =

document.getElementById(
  'panelNotificaciones'
);





if(campanaBtn){

  campanaBtn.onclick = function(e){

    e.stopPropagation();





    if(panelNotificaciones){

      panelNotificaciones.classList.toggle(
        'active'
      );

    }

  };

}





// ======================
// CERRAR AFUERA
// ======================

document.addEventListener(

  'click',

  function(e){

    if(

      panelNotificaciones &&

      !panelNotificaciones.contains(
        e.target
      ) &&

      e.target !== campanaBtn

    ){

      panelNotificaciones.classList.remove(
        'active'
      );

    }

  }

);





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

    'js/' + modulo + '.js?v=' + Date.now()

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
// AUTO REFRESH
// ======================

window.iniciarAutoRefresh = function(){

  if(window.autoRefreshSistema){

    clearInterval(
      window.autoRefreshSistema
    );

  }







  window.autoRefreshSistema =

  setInterval(async function(){

    try{

      if(

        typeof window.renderNotificaciones ===
        'function'

      ){

        window.renderNotificaciones();

      }







      if(

        typeof window.renderRecepciones ===
        'function'

      ){

        await window.renderRecepciones();

      }







      if(

        typeof window.actualizarKPIsRecepcion ===
        'function'

      ){

        await window.actualizarKPIsRecepcion();

      }







      if(

        typeof window.renderAuditorias ===
        'function'

      ){

        await window.renderAuditorias();

      }







      if(

        typeof window.renderHistorialSistema ===
        'function'

      ){

        await window.renderHistorialSistema();

      }







      if(

        typeof window.renderInventario ===
        'function'

      ){

        window.renderInventario();

      }







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
// BOTON CERRAR
// ======================

const cerrarSesionBtn =

document.getElementById(
  'cerrarSesionBtn'
);





if(cerrarSesionBtn){

  cerrarSesionBtn.onclick =
  cerrarSesion;

}





// ======================
// ACTIVAR MENU
// ======================

function activarMenu(id,modulo){

  const elemento =

  document.getElementById(id);





  if(elemento){

    elemento.onclick = function(){

      mostrarModulo(
        modulo
      );

    };

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
// CARDS
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
// INICIO
// ======================

aplicarPermisos();

window.renderNotificaciones();

window.iniciarAutoRefresh();
