
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





if(guardarRecepcionBtn){

  guardarRecepcionBtn.addEventListener(

    'click',

    guardarRecepcion

  );

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
    // PDF
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
    // INSERTAR
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
        usuarioLogueado.usuario ||

        'Usuario',

        created_at:
        new Date()
        .toISOString()

      }

    ]);





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

    if(typeof guardarHistorial === 'function'){

      await guardarHistorial(

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





    renderRecepciones();

    actualizarKPIsRecepcion();

    limpiarFormulario();





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
// RENDER
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





    const recepciones =
    response.data;





    if(

      !recepciones ||

      recepciones.length === 0

    ){

      body.innerHTML =

      '<tr>' +

      '<td colspan="13">' +

      'No hay recepciones registradas' +

      '</td>' +

      '</tr>';



      return;

    }





    recepciones.forEach(item => {

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

      usuarioLogueado.usuario ||

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





    if(typeof guardarHistorial === 'function'){

      await guardarHistorial(

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





    renderRecepciones();





    alert(
      'Recepción validada'
    );

  }

  catch(error){

    console.log(error);

  }

};





// ======================
// ELIMINAR
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





    if(typeof guardarHistorial === 'function'){

      await guardarHistorial(

        'ELIMINAR',

        'RECEPCION',

        'Se eliminó recepción de ' +
        recepcion.material

      );

    }





    renderRecepciones();

    actualizarKPIsRecepcion();





    alert(
      'Recepción eliminada'
    );

  }

  catch(error){

    console.log(error);

  }

};





// ======================
// KPI RECEPCION
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





    document.getElementById(
      'kpiRecepciones'
    ).innerText =

    recepciones.length;





    if(recepciones.length === 0){

      document.getElementById(
        'kpiRevisado'
      ).innerText = '0%';



      document.getElementById(
        'kpiNovedades'
      ).innerText = '0';



      document.getElementById(
        'kpiFaltantes'
      ).innerText = '0';



      return;

    }





    const ultimaRecepcion =
    recepciones[0];





    document.getElementById(
      'kpiRevisado'
    ).innerText =

    Number(

      ultimaRecepcion
      .porcentaje_revisado || 0

    ).toFixed(1) + '%';





    document.getElementById(
      'kpiNovedades'
    ).innerText =

    ultimaRecepcion
    .novedades || 0;





    document.getElementById(
      'kpiFaltantes'
    ).innerText =

    ultimaRecepcion
    .faltantes || 0;

  }

  catch(error){

    console.log(error);

  }

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



  document.getElementById(
    'pdfInput'
  ).value = '';

}





// ======================
// APLICAR PERMISOS UI
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
