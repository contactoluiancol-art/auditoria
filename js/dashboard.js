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

'TU_API_KEY';





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
// MOSTRAR USUARIO
// ======================

document.getElementById(
  'usuarioNombre'
).innerText =

`${usuarioLogueado.usuario} | ${usuarioLogueado.rol}`;





// ======================
// ROL
// ======================

const rol =

usuarioLogueado.rol;





// ======================
// OCULTAR MENU
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
// OCULTAR CARDS
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



    ocultarCard(
      'cardInventario'
    );

    ocultarCard(
      'cardAuditorias'
    );

    ocultarCard(
      'cardUsuarios'
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
// DASHBOARD ORIGINAL
// ======================

const dashboardOriginal =

document.getElementById(
  'mainContent'
).innerHTML;





// ======================
// MOSTRAR MODULOS
// ======================

function mostrarModulo(modulo){

  const contenido =

  document.getElementById(
    'mainContent'
  );





  // ======================
  // DASHBOARD
  // ======================

  if(modulo === 'dashboard'){

    contenido.innerHTML =
    dashboardOriginal;

    aplicarPermisos();

    return;

  }





  // ======================
  // INVENTARIO
  // ======================

  if(modulo === 'inventario'){

    fetch('modules/inventario.html')

    .then(res => res.text())

    .then(html => {

      contenido.innerHTML =
      html;

      cargarScript(
        'inventarioScript',
        'js/inventario.js?v=14',
        () => {

          renderInventario();

          renderHistorial();

          actualizarKPIs();

        }

      );

    });

  }





  // ======================
  // AUDITORIAS
  // ======================

  else if(modulo === 'auditorias'){

    fetch('modules/auditorias.html')

    .then(res => res.text())

    .then(html => {

      contenido.innerHTML =
      html;

      cargarScript(
        'auditoriasScript',
        'js/auditorias.js?v=14',
        () => {

          renderAuditorias();

        }

      );

    });

  }





  // ======================
  // USUARIOS
  // ======================

  else if(modulo === 'usuarios'){

    fetch('modules/usuarios.html')

    .then(res => res.text())

    .then(html => {

      contenido.innerHTML =
      html;

      cargarScript(
        'usuariosScript',
        'js/usuarios.js?v=14',
        () => {

          renderUsuarios();

        }

      );

    });

  }





  // ======================
  // RECEPCION
  // ======================

  else if(modulo === 'recepcion'){

    fetch('modules/recepcion.html')

    .then(res => res.text())

    .then(html => {

      contenido.innerHTML =
      html;

      cargarScript(
        'recepcionScript',
        'js/recepcion.js?v=14'
      );

    });

  }

}





// ======================
// CARGAR SCRIPT DINAMICO
// ======================

function cargarScript(id, src, callback){

  const scriptAnterior =

  document.getElementById(id);





  if(scriptAnterior){

    callback?.();

    return;

  }





  const script =

  document.createElement(
    'script'
  );



  script.src = src;

  script.id = id;





  script.onload = () => {

    if(callback){

      callback();

    }

  };





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
// EVENTOS MENU
// ======================

document.getElementById(
  'dashboardMenu'
)
.addEventListener(

  'click',

  () => mostrarModulo(
    'dashboard'
  )

);





document.getElementById(
  'inventarioMenu'
)
?.addEventListener(

  'click',

  () => mostrarModulo(
    'inventario'
  )

);





document.getElementById(
  'auditoriasMenu'
)
?.addEventListener(

  'click',

  () => mostrarModulo(
    'auditorias'
  )

);





document.getElementById(
  'usuariosMenu'
)
?.addEventListener(

  'click',

  () => mostrarModulo(
    'usuarios'
  )

);





document.getElementById(
  'recepcionMenu'
)
?.addEventListener(

  'click',

  () => mostrarModulo(
    'recepcion'
  )

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





    if(card.id === 'cardAuditorias'){

      mostrarModulo(
        'auditorias'
      );

    }





    if(card.id === 'cardRecepcion'){

      mostrarModulo(
        'recepcion'
      );

    }





    if(card.id === 'cardUsuarios'){

      mostrarModulo(
        'usuarios'
      );

    }

  }

);





// ======================
// BOTON CERRAR SESION
// ======================

document.getElementById(
  'cerrarSesionBtn'
)
.addEventListener(

  'click',

  cerrarSesion

);





// ======================
// RENDER NOTIFICACIONES
// ======================

function renderNotificaciones(){




  // ======================
  // VALIDAR ROL
  // ======================

  if(

    rol !== 'admin' &&

    rol !== 'auditor' &&

    rol !== 'jefe'

  ){

    const box =

    document.getElementById(
      'notificacionesBox'
    );



    if(box){

      box.style.display =
      'none';

    }

    return;

  }





  // ======================
  // STORAGE
  // ======================

  const notificaciones =

  JSON.parse(

    localStorage.getItem(
      'notificaciones'
    )

  ) || [];





  // ======================
  // ELEMENTOS
  // ======================

  const lista =

  document.getElementById(
    'listaNotificaciones'
  );



  const contador =

  document.getElementById(
    'contadorNotificaciones'
  );





  if(!lista || !contador){

    return;

  }





  lista.innerHTML = '';





  // ======================
  // NO LEIDAS
  // ======================

  const noLeidas =

  notificaciones.filter(
    item => !item.leida
  );





  contador.innerText =
  noLeidas.length;





  contador.style.display =

  noLeidas.length === 0

  ? 'none'

  : 'flex';





  // ======================
  // VACIO
  // ======================

  if(notificaciones.length === 0){

    lista.innerHTML = `

      <p>

        No hay notificaciones

      </p>

    `;

    return;

  }





  // ======================
  // RENDER
  // ======================

  notificaciones.forEach(item => {

    lista.innerHTML += `

      <div class="notificacion-item">

        <div class="notificacion-top">

          <p>

            ${item.mensaje}

          </p>

          <button
            class="btn-eliminar-noti"
            onclick="eliminarNotificacion('${item.id}')"
          >

            ✖

          </button>

        </div>

        <span>

          ${item.fecha}

        </span>

      </div>

    `;

  });

}





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





// ======================
// ABRIR PANEL
// ======================

campanaBtn?.addEventListener(

  'click',

  (e) => {

    e.stopPropagation();





    panelNotificaciones?.classList.toggle(
      'active'
    );





    let notificaciones =

    JSON.parse(

      localStorage.getItem(
        'notificaciones'
      )

    ) || [];





    notificaciones =

    notificaciones.map(item => {

      item.leida = true;

      return item;

    });





    localStorage.setItem(

      'notificaciones',

      JSON.stringify(
        notificaciones
      )

    );





    renderNotificaciones();

  }

);





// ======================
// CLICK DENTRO PANEL
// ======================

panelNotificaciones?.addEventListener(

  'click',

  (e) => {

    e.stopPropagation();

  }

);





// ======================
// CLICK FUERA PANEL
// ======================

document.addEventListener(

  'click',

  () => {

    panelNotificaciones?.classList.remove(
      'active'
    );

  }

);





// ======================
// ELIMINAR NOTIFICACION
// ======================

function eliminarNotificacion(id){

  let notificaciones =

  JSON.parse(

    localStorage.getItem(
      'notificaciones'
    )

  ) || [];





  notificaciones =

  notificaciones.filter(

    item =>

    String(item.id) !==
    String(id)

  );





  localStorage.setItem(

    'notificaciones',

    JSON.stringify(
      notificaciones
    )

  );





  renderNotificaciones();

}





// ======================
// LIMPIAR TODAS
// ======================

function limpiarNotificaciones(){

  const confirmar = confirm(

    '¿Seguro que deseas limpiar todas las notificaciones?'

  );





  if(!confirmar){

    return;

  }





  localStorage.removeItem(
    'notificaciones'
  );





  renderNotificaciones();

}





// ======================
// TIEMPO REAL LOCAL
// ======================

window.addEventListener(

  'nuevaNotificacion',

  () => {

    renderNotificaciones();

  }

);





// ======================
// INICIO
// ======================

aplicarPermisos();

renderNotificaciones();
