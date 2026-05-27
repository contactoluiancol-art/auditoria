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
// DASHBOARD ORIGINAL
// ======================

const dashboardOriginal =

document.getElementById(
  'mainContent'
).innerHTML;





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

  usuarioLogueado?.usuario || 'Sistema';





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

        'js/inventario.js?v=17',

        () => {

          if(typeof renderInventario === 'function'){

            renderInventario();

          }



          if(typeof renderHistorial === 'function'){

            renderHistorial();

          }



          if(typeof actualizarKPIs === 'function'){

            actualizarKPIs();

          }

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

        'js/auditorias.js?v=17',

        () => {

          if(typeof renderAuditorias === 'function'){

            renderAuditorias();

          }

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

        'js/usuarios.js?v=17',

        () => {

          if(typeof renderUsuarios === 'function'){

            renderUsuarios();

          }

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

        'js/recepcion.js?v=17'

      );

    });

  }





  // ======================
  // HISTORIAL
  // ======================

  else if(modulo === 'historial'){

    fetch('modules/historial.html')

    .then(res => res.text())

    .then(html => {

      contenido.innerHTML =
      html;

      cargarScript(

        'historialScript',

        'js/historial.js?v=17',

        () => {

          if(typeof renderHistorial === 'function'){

            renderHistorial();

          }

        }

      );

    });

  }

}





// ======================
// CARGAR SCRIPT LIMPIO
// ======================

function cargarScript(id, src, callback){

  const scriptAnterior =

  document.getElementById(id);





  if(scriptAnterior){

    scriptAnterior.remove();

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





document.getElementById(
  'historialMenu'
)
?.addEventListener(

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





    if(card.id === 'cardHistorial'){

      mostrarModulo(
        'historial'
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





  const notificaciones =

  JSON.parse(

    localStorage.getItem(
      'notificaciones'
    )

  ) || [];





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





  if(notificaciones.length === 0){

    lista.innerHTML = `

      <p>

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
