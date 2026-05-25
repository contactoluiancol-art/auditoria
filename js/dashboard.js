// ======================
// USUARIO LOGUEADO
// ======================

const usuarioLogueado = JSON.parse(
  localStorage.getItem('usuarioLogueado')
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
)
.innerText =

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

      cargarScriptsInventario();

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

      cargarScriptsAuditorias();

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

      cargarScriptsUsuarios();

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

      cargarScriptsRecepcion();

    });

  }



  // ======================
  // DESPACHO
  // ======================

  else if(modulo === 'despacho'){

    contenido.innerHTML = `

      <div class="modulo-vacio">

        <h2>
          🚚 Módulo Despacho
        </h2>

        <p>
          Próximamente...
        </p>

      </div>

    `;

  }

}





// ======================
// INVENTARIO
// ======================

function cargarScriptsInventario(){

  if(
    document.getElementById(
      'inventarioScript'
    )
  ){

    renderInventario();

    renderHistorial();

    actualizarKPIs();

    return;

  }


  const script =

  document.createElement(
    'script'
  );

  script.src =
  'js/inventario.js?v=14';

  script.id =
  'inventarioScript';


  document.body.appendChild(
    script
  );

}





// ======================
// AUDITORIAS
// ======================

function cargarScriptsAuditorias(){

  if(
    document.getElementById(
      'auditoriasScript'
    )
  ){

    renderAuditorias();

    return;

  }


  const script =

  document.createElement(
    'script'
  );

  script.src =
  'js/auditorias.js?v=14';

  script.id =
  'auditoriasScript';


  document.body.appendChild(
    script
  );

}





// ======================
// USUARIOS
// ======================

function cargarScriptsUsuarios(){

  if(
    document.getElementById(
      'usuariosScript'
    )
  ){

    renderUsuarios();

    return;

  }


  const script =

  document.createElement(
    'script'
  );

  script.src =
  'js/usuarios.js?v=14';

  script.id =
  'usuariosScript';


  document.body.appendChild(
    script
  );

}





// ======================
// RECEPCION
// ======================

function cargarScriptsRecepcion(){

  const scriptAnterior =

  document.getElementById(
    'recepcionScript'
  );


  if(scriptAnterior){

    scriptAnterior.remove();

  }


  const script =

  document.createElement(
    'script'
  );

  script.src =
  'js/recepcion.js?v=' +
  Date.now();

  script.id =
  'recepcionScript';


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
// MENUS
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
  'despachoMenu'
)
?.addEventListener(
  'click',
  () => mostrarModulo(
    'despacho'
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



    if(
      card.id ===
      'cardInventario'
    ){

      mostrarModulo(
        'inventario'
      );

    }



    if(
      card.id ===
      'cardAuditorias'
    ){

      mostrarModulo(
        'auditorias'
      );

    }



    if(
      card.id ===
      'cardRecepcion'
    ){

      mostrarModulo(
        'recepcion'
      );

    }



    if(
      card.id ===
      'cardDespacho'
    ){

      mostrarModulo(
        'despacho'
      );

    }



    if(
      card.id ===
      'cardUsuarios'
    ){

      mostrarModulo(
        'usuarios'
      );

    }

  }
);





// ======================
// CERRAR SESION
// ======================

document.getElementById(
  'cerrarSesionBtn'
)
.addEventListener(
  'click',
  cerrarSesion
);





// ======================
// INICIO
// ======================

aplicarPermisos();





// ======================
// MOSTRAR NOTIFICACIONES
// ======================

function renderNotificaciones(){


  // VALIDAR ROL

  if(

    rol !== 'admin' &&

    rol !== 'auditor' &&

    rol !== 'jefe'

  ){

    const box = document.getElementById(
      'notificacionesBox'
    );

    if(box){

      box.style.display = 'none';

    }

    return;

  }




  // STORAGE

  const notificaciones = JSON.parse(

    localStorage.getItem(
      'notificaciones'
    )

  ) || [];




  // ELEMENTOS

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




  // NO LEIDAS

  const noLeidas =

  notificaciones.filter(
    item => !item.leida
  );




  // CONTADOR

  contador.innerText =
  noLeidas.length;




  if(noLeidas.length === 0){

    contador.style.display =
    'none';

  }

  else{

    contador.style.display =
    'flex';

  }




  // VACIO

  if(notificaciones.length === 0){

    lista.innerHTML = `

      <p>

        No hay notificaciones

      </p>

    `;

    return;

  }




  // RENDER

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




    let notificaciones = JSON.parse(

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
// NO CERRAR DENTRO
// ======================

panelNotificaciones?.addEventListener(

  'click',

  (e) => {

    e.stopPropagation();

  }

);





// ======================
// CLICK FUERA
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

  let notificaciones = JSON.parse(

    localStorage.getItem(
      'notificaciones'
    )

  ) || [];



  notificaciones = notificaciones.filter(

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
// ======================
// LIMPIAR TODAS
// ======================

function limpiarNotificaciones(){


  // CONFIRMACION

  const confirmar = confirm(

    '¿Seguro que deseas limpiar todas las notificaciones?'

  );



  // CANCELAR

  if(!confirmar){

    return;

  }



  // ELIMINAR

  localStorage.removeItem(
    'notificaciones'
  );



  // ACTUALIZAR

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

renderNotificaciones();
