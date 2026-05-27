
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

`${usuarioLogueado.usuario} | ${usuarioLogueado.rol}`;





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

  usuarioLogueado?.usuario ||
  'Sistema';



  const { error } =

  await window.supabaseClient

  .from('historial')

  .insert([

    {

      usuario,

      accion,

      modulo,

      descripcion

    }

  ]);



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



    renderNotificaciones();

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

      () => {

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

      () => {

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

      () => {

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

      () => {

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

  .then(res => res.text())

  .then(html => {

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



  script.src =

  src + '&cache=' + Date.now();



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
)?.addEventListener(

  'click',

  () => mostrarModulo(
    'dashboard'
  )

);



document.getElementById(
  'inventarioMenu'
)?.addEventListener(

  'click',

  () => mostrarModulo(
    'inventario'
  )

);



document.getElementById(
  'auditoriasMenu'
)?.addEventListener(

  'click',

  () => mostrarModulo(
    'auditorias'
  )

);



document.getElementById(
  'usuariosMenu'
)?.addEventListener(

  'click',

  () => mostrarModulo(
    'usuarios'
  )

);



document.getElementById(
  'recepcionMenu'
)?.addEventListener(

  'click',

  () => mostrarModulo(
    'recepcion'
  )

);



document.getElementById(
  'historialMenu'
)?.addEventListener(

  'click',

  () => mostrarModulo(
    'historial'
  )

);





// ======================
// EVENTOS CARDS
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

      mostrarModulo(modulo);

    }

  }

);





// ======================
// BOTON CERRAR SESION
// ======================

document.getElementById(
  'cerrarSesionBtn'
)?.addEventListener(

  'click',

  cerrarSesion

);





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
// TOGGLE PANEL
// ======================

function toggleNotificaciones(){

  if(!panelNotificaciones){

    return;

  }



  panelNotificaciones.classList.toggle(
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





// ======================
// CLICK CAMPANA
// ======================

campanaBtn?.addEventListener(

  'click',

  (e) => {

    e.stopPropagation();

    toggleNotificaciones();

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
// CERRAR PANEL
// ======================

document.addEventListener(

  'click',

  () => {

    if(panelNotificaciones){

      panelNotificaciones.classList.remove(
        'active'
      );

    }

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
// LIMPIAR NOTIFICACIONES
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
// RENDER NOTIFICACIONES
// ======================

function renderNotificaciones(){

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



  const notificaciones =

  JSON.parse(

    localStorage.getItem(
      'notificaciones'
    )

  ) || [];



  lista.innerHTML = '';



  const noLeidas =

  notificaciones.filter(
    item => !item.leida
  );



  contador.innerText =
  noLeidas.length;



  contador.style.display =

  noLeidas.length > 0

  ? 'flex'

  : 'none';



  if(notificaciones.length === 0){

    lista.innerHTML = `

      <p class="sin-notificaciones">

        No hay notificaciones

      </p>

    `;

    return;

  }



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
// TIEMPO REAL
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

