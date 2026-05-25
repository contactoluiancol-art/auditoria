// ======================
// USUARIO LOGUEADO
// ======================






// ======================
// EVENTO
// ======================

document.getElementById(
  'guardarRecepcion'
)
.addEventListener(
  'click',
  guardarRecepcion
);




// ======================
// GUARDAR RECEPCION
// ======================

function guardarRecepcion(){

  const proveedor =
  document.getElementById(
    'proveedorInput'
  ).value;



  const material =
  document.getElementById(
    'materialInput'
  ).value;



  const cantidad =
  Number(
    document.getElementById(
      'cantidadInput'
    ).value
  );



  const revisadas =
  Number(
    document.getElementById(
      'revisadasInput'
    ).value
  );



  const novedades =
  Number(
    document.getElementById(
      'novedadesInput'
    ).value
  );



  const faltantes =
  Number(
    document.getElementById(
      'faltantesInput'
    ).value
  );



  const observacion =
  document.getElementById(
    'observacionInput'
  ).value;



  const estado =
  document.getElementById(
    'estadoRecepcionInput'
  ).value;





  // VALIDAR

  if(

    !proveedor ||

    !material ||

    !cantidad ||

    !revisadas

  ){

    alert(
      'Complete todos los campos'
    );

    return;

  }





  // CALCULOS

  const porcentajeRevisado =

    (
      revisadas /
      cantidad
    ) * 100;





  // STORAGE

  const recepciones = JSON.parse(

    localStorage.getItem(
      'recepciones'
    )

  ) || [];





  // NUEVA RECEPCION

  const nuevaRecepcion = {

    id: Date.now(),

    proveedor,

    material,

    cantidad,

    revisadas,

    novedades,

    faltantes,

    observacion,

    estado,

    porcentajeRevisado:
    porcentajeRevisado
    .toFixed(1),

    fecha:
    new Date()
    .toLocaleDateString()

  };





  // GUARDAR

  recepciones.push(
    nuevaRecepcion
  );



  localStorage.setItem(

    'recepciones',

    JSON.stringify(
      recepciones
    )

  );





  // NOTIFICACION

  crearNotificacion(

`Nueva recepción:
${material}

Cajas recibidas:
${cantidad}

Cajas revisadas:
${revisadas}

Cajas novedad:
${novedades}

Unidades faltantes:
${faltantes}

Estado:
${estado}`

  );





  // ACTUALIZAR

  renderRecepciones();

  actualizarKPIsRecepcion();

  limpiarFormulario();

}





// ======================
// RENDER
// ======================

function renderRecepciones(){

  const recepciones = JSON.parse(

    localStorage.getItem(
      'recepciones'
    )

  ) || [];



  const body =
  document.getElementById(
    'recepcionesBody'
  );



  body.innerHTML = '';





  recepciones.forEach(item => {

    let estadoClass = '';




    // ESTADOS

    if(
      item.estado ===
      'Pendiente'
    ){

      estadoClass =
      'estado-pendiente';

    }

    else if(
      item.estado ===
      'En revisión'
    ){

      estadoClass =
      'estado-revision';

    }

    else if(
      item.estado ===
      'Novedad'
    ){

      estadoClass =
      'estado-novedad';

    }

    else{

      estadoClass =
      'estado-revisado';

    }






    body.innerHTML += `

      <tr>

        <td>
          ${item.proveedor}
        </td>

        <td>
          ${item.material}
        </td>

        <td>
          ${item.cantidad}
        </td>

        <td>
          ${item.revisadas}
        </td>

        <td>
          ${item.porcentajeRevisado}%
        </td>

        <td>
          ${item.novedades}
        </td>

        <td>

          <span
            class="${estadoClass}"
          >

            ${item.estado}

          </span>

        </td>

        <td>
          ${item.fecha}
        </td>

        <td>

          <button
            class="btn-ver"
            onclick='verObservacion(${JSON.stringify(item.observacion)})'
          >

            👁 Ver

          </button>

        </td>

        <td class="acciones-tabla">

          <button
            class="btn-editar"
            onclick="editarRecepcion(${item.id})"
          >

            Editar

          </button>

          ${

            usuarioLogueado.rol === 'admin' ||

            usuarioLogueado.rol === 'auditor' ||

            usuarioLogueado.rol === 'jefe'

            ?

            `

            <button
              class="btn-eliminar"
              onclick="eliminarRecepcion(${item.id})"
            >

              Eliminar

            </button>

            `

            :

            ''

          }

        </td>

      </tr>

    `;

  });

}





// ======================
// VER OBSERVACION
// ======================

function verObservacion(observacion){

  if(

    !observacion ||

    observacion.trim() === ''

  ){

    alert(
      'Sin observaciones'
    );

    return;

  }



  alert(

`OBSERVACIÓN:

${observacion}`

  );

}





// ======================
// ELIMINAR
// ======================

function eliminarRecepcion(id){

  let recepciones = JSON.parse(

    localStorage.getItem(
      'recepciones'
    )

  ) || [];



  recepciones = recepciones.filter(

    item =>

    String(item.id) !==
    String(id)

  );



  localStorage.setItem(

    'recepciones',

    JSON.stringify(
      recepciones
    )

  );



  renderRecepciones();

  actualizarKPIsRecepcion();

}





// ======================
// EDITAR
// ======================

function editarRecepcion(id){

  const recepciones = JSON.parse(

    localStorage.getItem(
      'recepciones'
    )

  ) || [];



  const recepcion = recepciones.find(

    item =>

    String(item.id) ===
    String(id)

  );



  if(!recepcion){

    return;

  }





  const nuevoEstado = prompt(

`Nuevo estado:

Pendiente
En revisión
Revisado
Novedad`,

    recepcion.estado

  );





  if(!nuevoEstado){

    return;

  }



  recepcion.estado =
  nuevoEstado;





  localStorage.setItem(

    'recepciones',

    JSON.stringify(
      recepciones
    )

  );



  renderRecepciones();

}





// ======================
// KPI
// ======================

function actualizarKPIsRecepcion(){

  const recepciones = JSON.parse(

    localStorage.getItem(
      'recepciones'
    )

  ) || [];





  document.getElementById(
    'kpiRecepciones'
  ).innerText =

  recepciones.length;





  let totalRevisado = 0;





  recepciones.forEach(item => {

    totalRevisado +=
    Number(
      item.porcentajeRevisado
    );

  });





  const promedio =

    recepciones.length > 0

    ?

    totalRevisado /
    recepciones.length

    :

    0;





  document.getElementById(
    'kpiRevisado'
  ).innerText =

  `${promedio.toFixed(1)}%`;





  let totalNovedades = 0;





  recepciones.forEach(item => {

    totalNovedades +=
    Number(item.novedades);

  });





  document.getElementById(
    'kpiNovedades'
  ).innerText =

  totalNovedades;





  let totalFaltantes = 0;





  recepciones.forEach(item => {

    totalFaltantes +=
    Number(item.faltantes);

  });





  document.getElementById(
    'kpiFaltantes'
  ).innerText =

  totalFaltantes;

}





// ======================
// NOTIFICACIONES
// ======================

function crearNotificacion(mensaje){

  const notificaciones = JSON.parse(

    localStorage.getItem(
      'notificaciones'
    )

  ) || [];



  const nueva = {

    id: Date.now(),

    mensaje,

    leida:false,

    fecha:
    new Date()
    .toLocaleString()

  };



  notificaciones.unshift(
    nueva
  );



  localStorage.setItem(

    'notificaciones',

    JSON.stringify(
      notificaciones
    )

  );





  // TIEMPO REAL

  window.dispatchEvent(

    new Event(
      'nuevaNotificacion'
    )

  );

}





// ======================
// LIMPIAR
// ======================

function limpiarFormulario(){

  document.getElementById(
    'proveedorInput'
  ).value = '';



  document.getElementById(
    'materialInput'
  ).value = '';



  document.getElementById(
    'cantidadInput'
  ).value = '';



  document.getElementById(
    'revisadasInput'
  ).value = '';



  document.getElementById(
    'novedadesInput'
  ).value = '';



  document.getElementById(
    'faltantesInput'
  ).value = '';



  document.getElementById(
    'observacionInput'
  ).value = '';



  document.getElementById(
    'estadoRecepcionInput'
  ).value = 'Pendiente';

}





// ======================
// INICIO
// ======================

renderRecepciones();

actualizarKPIsRecepcion();