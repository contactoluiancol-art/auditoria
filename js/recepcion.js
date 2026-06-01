// ======================
// EVITAR DUPLICAR
// ======================

if(typeof window.recepcionCargado === 'undefined'){

window.recepcionCargado = true;





// ======================
// BOTON
// ======================

const guardarRecepcionBtn =

document.getElementById(
  'guardarRecepcion'
);





// ======================
// EVENTO BOTON
// ======================

if(guardarRecepcionBtn){

  guardarRecepcionBtn.addEventListener(

    'click',

    guardarRecepcion

  );

}





// ======================
// CREAR NOTIFICACION
// ======================

function crearNotificacion(mensaje){

  try{

    // ======================
    // OBTENER
    // ======================

    let notificaciones =

    JSON.parse(

      localStorage.getItem(
        'notificaciones'
      )

    ) || [];





    // ======================
    // NUEVA
    // ======================

    const nuevaNotificacion = {

      id:
      Date.now(),

      mensaje:
      mensaje,

      leida:
      false,

      fecha:
      new Date()
      .toLocaleString('es-CO')

    };





    // ======================
    // AGREGAR
    // ======================

    notificaciones.unshift(
      nuevaNotificacion
    );





    // ======================
    // GUARDAR
    // ======================

    localStorage.setItem(

      'notificaciones',

      JSON.stringify(
        notificaciones
      )

    );





    // ======================
    // ACTUALIZAR DASHBOARD
    // ======================

    if(

      typeof window.renderNotificaciones ===
      'function'

    ){

      window.renderNotificaciones();

    }





    // ======================
    // EVENTO GLOBAL
    // ======================

    window.dispatchEvent(

      new CustomEvent(

        'nuevaNotificacion',

        {

          detail:
          nuevaNotificacion

        }

      )

    );

  }

  catch(error){

    console.log(error);

  }

}





// ======================
// GUARDAR RECEPCION
// ======================

async function guardarRecepcion(){

  try{

    // ======================
    // VALIDAR PERMISO
    // ======================

    if(

      !window.tienePermiso(
        'recepcion',
        'crear'
      )

    ){

      alert(
        'No tiene permisos'
      );

      return;

    }





    // ======================
    // INPUTS
    // ======================

    const proveedor =

    document.getElementById(
      'proveedorInput'
    ).value.trim();





    const material =

    document.getElementById(
      'materialInput'
    ).value.trim();





    const tipoRecepcion =

    document.getElementById(
      'tipoRecepcionInput'
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
    ).value.trim();





    const estado =

    document.getElementById(
      'estadoRecepcionInput'
    ).value;





    const pdfFile =

    document.getElementById(
      'pdfInput'
    ).files[0];





    // ======================
    // VALIDAR
    // ======================

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





    // ======================
    // PORCENTAJE
    // ======================

    const porcentajeRevisado =

    (
      revisadas /
      cantidad
    ) * 100;





    // ======================
    // PDF URL
    // ======================

    let pdfUrl = '';





    // ======================
    // SUBIR PDF
    // ======================

    if(pdfFile){

      const nombreArchivo =

      Date.now() +
      '_' +
      pdfFile.name;





      const subida =

      await window.supabaseClient

      .storage

      .from(
        'recepciones-pdf'
      )

      .upload(

        nombreArchivo,

        pdfFile

      );





      if(subida.error){

        console.log(
          subida.error
        );

        alert(
          'Error subiendo PDF'
        );

        return;

      }





      const urlData =

      window.supabaseClient

      .storage

      .from(
        'recepciones-pdf'
      )

      .getPublicUrl(
        nombreArchivo
      );





      pdfUrl =
      urlData.data.publicUrl;

    }





    // ======================
    // INSERTAR RECEPCION
    // ======================

    const response =

    await window.supabaseClient

    .from('recepciones')

    .insert([

      {

        proveedor:
        proveedor,

        material:
        material,

        tipo_recepcion:
        tipoRecepcion,

        cantidad:
        cantidad,

        revisadas:
        revisadas,

        novedades:
        novedades,

        faltantes:
        faltantes,

        porcentaje_revisado:
        porcentajeRevisado.toFixed(1),

        observacion:
        observacion,

        comentario_validacion:
        '',

        estado:
        estado,

        pdf_url:
        pdfUrl,

        usuario_recepcion:

        window.usuarioLogueado
        .usuario ||

        'Usuario',

        created_at:
        new Date()
        .toISOString()

      }

    ]);





    // ======================
    // ERROR
    // ======================

    if(response.error){

      console.log(
        response.error
      );

      alert(
        'Error guardando recepción'
      );

      return;

    }





    // ======================
    // HISTORIAL
    // ======================

    if(

      typeof window.guardarHistorial ===
      'function'

    ){

      await window.guardarHistorial(

        'CREAR',

        'RECEPCION',

        'Se registró recepción de ' +
        material

      );

    }





    // ======================
    // NOTIFICACION
    // ======================

    crearNotificacion(

`Nueva recepción registrada

Proveedor:
${proveedor}

Material:
${material}

Tipo:
${tipoRecepcion}

Cantidad:
${cantidad}

Estado:
${estado}`

    );





    // ======================
    // RECARGAR
    // ======================

    await renderRecepciones();

    await actualizarKPIsRecepcion();





    // ======================
    // LIMPIAR
    // ======================

    limpiarFormulario();





    // ======================
    // OK
    // ======================

    alert(
      'Recepción guardada correctamente'
    );

  }

  catch(error){

    console.log(error);

    alert(
      'Error general'
    );

  }

}





// ======================
// RENDER RECEPCIONES
// ======================

async function renderRecepciones(){

  try{

    const body =

    document.getElementById(
      'recepcionesBody'
    );





    if(!body){

      return;

    }





    body.innerHTML = '';





    const response =

    await window.supabaseClient

    .from('recepciones')

    .select('*')

    .order(

      'id',

      {

        ascending:false

      }

    );





    if(response.error){

      console.log(
        response.error
      );

      return;

    }





    const recepciones =
    response.data || [];





    if(recepciones.length === 0){

      body.innerHTML =

      '<tr>' +

      '<td colspan="13">' +

      'No hay recepciones registradas' +

      '</td>' +

      '</tr>';



      return;

    }





    recepciones.forEach(function(item){

      let estadoClass = '';





      if(

        item.estado ===
        'Pendiente'

      ){

        estadoClass =
        'estado-pendiente';

      }

      else if(

        item.estado ===
        'En validación'

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
            ${item.proveedor || '-'}
          </td>

          <td>
            ${item.material || '-'}
          </td>

          <td>
            ${item.tipo_recepcion || '-'}
          </td>

          <td>
            ${item.cantidad || 0}
          </td>

          <td>
            ${item.revisadas || 0}
          </td>

          <td>
            ${item.porcentaje_revisado || 0}%
          </td>

          <td>
            ${item.novedades || 0}
          </td>

          <td>

            <span
              class="${estadoClass}"
            >

              ${item.estado}

            </span>

          </td>

          <td>

            ${new Date(
              item.created_at
            ).toLocaleString('es-CO')}

          </td>

          <td>

            ${

              item.pdf_url

              ?

              `

              <button
                class="btn-ver"
                onclick="window.open('${item.pdf_url}')"
              >

                Ver PDF

              </button>

              `

              :

              '-'

            }

          </td>

          <td>

            <button
              class="btn-ver"
              onclick='verObservacion(${JSON.stringify(item.observacion || "")})'
            >

              Ver

            </button>

          </td>

          <td>

            <button
              class="btn-ver"
              onclick='verComentario(${JSON.stringify(item.comentario_validacion || "")})'
            >

              Ver

            </button>

          </td>

          <td>

            <div class="acciones-tabla">

              ${

                window.tienePermiso(
                  'recepcion',
                  'editar'
                )

                ?

                `

                <button
                  class="btn-editar"
                  onclick="validarRecepcion(${item.id})"
                >

                  Validar

                </button>

                `

                :

                ''

              }

              ${

                window.tienePermiso(
                  'recepcion',
                  'eliminar'
                )

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

            </div>

          </td>

        </tr>

      `;

    });

  }

  catch(error){

    console.log(error);

  }

}





// ======================
// VER OBSERVACION
// ======================

window.verObservacion = function(observacion){

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

`OBSERVACIÓN RECEPCIÓN

${observacion}`

  );

};





// ======================
// VER COMENTARIO
// ======================

window.verComentario = function(comentario){

  if(

    !comentario ||

    comentario.trim() === ''

  ){

    alert(
      'Sin comentarios'
    );

    return;

  }





  alert(

`COMENTARIO VALIDACIÓN

${comentario}`

  );

};





// ======================
// VALIDAR RECEPCION
// ======================

window.validarRecepcion = async function(id){

  try{

    if(

      !window.tienePermiso(
        'recepcion',
        'editar'
      )

    ){

      alert(
        'No tiene permisos'
      );

      return;

    }





    const comentario = prompt(

      'Ingrese comentario de validación'

    );





    if(comentario === null){

      return;

    }





    const nuevoEstado = prompt(

`Nuevo estado:

Pendiente
En validación
Novedad
Gestionado`

    );





    if(!nuevoEstado){

      return;

    }





    const update =

    await window.supabaseClient

    .from('recepciones')

    .update({

      comentario_validacion:
      comentario,

      estado:
      nuevoEstado,

      usuario_validacion:

      window.usuarioLogueado
      .usuario ||

      'Validador'

    })

    .eq(

      'id',

      Number(id)

    );





    if(update.error){

      console.log(
        update.error
      );

      alert(
        'Error actualizando'
      );

      return;

    }





    if(

      typeof window.guardarHistorial ===
      'function'

    ){

      await window.guardarHistorial(

        'EDITAR',

        'RECEPCION',

        'Se validó recepción ID ' +
        id

      );

    }





    crearNotificacion(

`Recepción validada

Comentario:
${comentario}

Estado:
${nuevoEstado}`

    );





    await renderRecepciones();





    alert(
      'Recepción validada'
    );

  }

  catch(error){

    console.log(error);

  }

};





// ======================
// ELIMINAR RECEPCION
// ======================

window.eliminarRecepcion = async function(id){

  try{

    if(

      !window.tienePermiso(
        'recepcion',
        'eliminar'
      )

    ){

      alert(
        'No tiene permisos'
      );

      return;

    }





    const confirmar = confirm(
      '¿Eliminar recepción?'
    );





    if(!confirmar){

      return;

    }





    const consulta =

    await window.supabaseClient

    .from('recepciones')

    .select('*')

    .eq(

      'id',

      Number(id)

    )

    .single();





    const recepcion =
    consulta.data;





    const eliminar =

    await window.supabaseClient

    .from('recepciones')

    .delete()

    .eq(

      'id',

      Number(id)

    );





    if(eliminar.error){

      console.log(
        eliminar.error
      );

      alert(
        'Error eliminando'
      );

      return;

    }





    if(

      typeof window.guardarHistorial ===
      'function'

    ){

      await window.guardarHistorial(

        'ELIMINAR',

        'RECEPCION',

        'Se eliminó recepción de ' +
        recepcion.material

      );

    }





    await renderRecepciones();

    await actualizarKPIsRecepcion();





    alert(
      'Recepción eliminada'
    );

  }

  catch(error){

    console.log(error);

  }

};





// ======================
// KPIS RECEPCION
// ======================

async function actualizarKPIsRecepcion(){

  try{

    const response =

    await window.supabaseClient

    .from('recepciones')

    .select('*')

    .order(

      'id',

      {

        ascending:false

      }

    );





    const recepciones =
    response.data || [];





    const kpiRecepciones =

    document.getElementById(
      'kpiRecepciones'
    );





    const kpiRevisado =

    document.getElementById(
      'kpiRevisado'
    );





    const kpiNovedades =

    document.getElementById(
      'kpiNovedades'
    );





    const kpiFaltantes =

    document.getElementById(
      'kpiFaltantes'
    );





    if(kpiRecepciones){

      kpiRecepciones.innerText =
      recepciones.length;
    }





    if(recepciones.length === 0){

      if(kpiRevisado){
        kpiRevisado.innerText = '0%';
      }

      if(kpiNovedades){
        kpiNovedades.innerText = '0';
      }

      if(kpiFaltantes){
        kpiFaltantes.innerText = '0';
      }

      return;

    }





    const ultimaRecepcion =
    recepciones[0];





    if(kpiRevisado){

      kpiRevisado.innerText =

      Number(

        ultimaRecepcion
        .porcentaje_revisado || 0

      ).toFixed(1) + '%';

    }





    if(kpiNovedades){

      kpiNovedades.innerText =

      ultimaRecepcion
      .novedades || 0;

    }





    if(kpiFaltantes){

      kpiFaltantes.innerText =

      ultimaRecepcion
      .faltantes || 0;

    }

  }

  catch(error){

    console.log(error);

  }

}





// ======================
// LIMPIAR FORMULARIO
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



  document.getElementById(
    'pdfInput'
  ).value = '';

}





// ======================
// APLICAR PERMISOS
// ======================

function aplicarPermisosRecepcion(){

  if(

    !window.tienePermiso(
      'recepcion',
      'crear'
    )

  ){

    if(guardarRecepcionBtn){

      guardarRecepcionBtn.style.display =
      'none';

    }

  }

}





// ======================
// INICIO
// ======================

aplicarPermisosRecepcion();

renderRecepciones();

actualizarKPIsRecepcion();

}
