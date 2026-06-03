// ======================
// EVITAR DUPLICAR
// ======================

if(typeof window.recepcionCargado === 'undefined'){

window.recepcionCargado = true;





// ======================
// INTERVALO GLOBAL
// ======================

window.refreshRecepcion = null;





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

window.crearNotificacion = function(mensaje){

  try{

    let notificaciones =

    JSON.parse(

      localStorage.getItem(
        'notificaciones'
      )

    ) || [];





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





    notificaciones.unshift(
      nuevaNotificacion
    );





    localStorage.setItem(

      'notificaciones',

      JSON.stringify(
        notificaciones
      )

    );





    const contador =

    document.getElementById(
      'contadorNotificaciones'
    );





    if(contador){

      contador.innerText =
      notificaciones.length;

    }





    if(

      typeof window.renderNotificaciones ===
      'function'

    ){

      window.renderNotificaciones();

    }





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

};





// ======================
// GUARDAR RECEPCION
// ======================

async function guardarRecepcion(){

  try{

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





    const porcentajeRevisado =

    (
      revisadas /
      cantidad
    ) * 100;





    let pdfUrl = '';





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

        seguimiento:
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





    if(response.error){

      console.log(
        response.error
      );

      alert(
        'Error guardando recepción'
      );

      return;

    }





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





    window.crearNotificacion(

`📦 Nueva recepción registrada

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





    await window.renderRecepciones();

    await window.actualizarKPIsRecepcion();





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
// RENDER RECEPCIONES
// ======================

window.renderRecepciones = async function(){

  try{

    const body =

    document.getElementById(
      'recepcionesBody'
    );





    if(!body){

      return;

    }





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





    body.innerHTML = '';





    if(recepciones.length === 0){

      body.innerHTML =

      '<tr>' +

      '<td colspan="13">' +

      'No hay recepciones registradas' +

      '</td>' +

      '</tr>';

      return;

    }





    let html = '';





    recepciones.forEach(function(item){

      let estadoClass = '';





      if(item.estado === 'Pendiente'){

        estadoClass =
        'estado-pendiente';

      }

      else if(item.estado === 'En Gestión Compras'){

        estadoClass =
        'estado-revision';

      }

      else if(item.estado === 'Novedad Reportada'){

        estadoClass =
        'estado-novedad';

      }

      else{

        estadoClass =
        'estado-revisado';

      }





      html += `

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

            <span class="${estadoClass}">

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
              onclick="window.verObservacion(\`${item.observacion || ''}\`)"
            >

              Ver

            </button>

          </td>

          <td>

            <button
              class="btn-ver"
              onclick="window.verComentario('',${item.id})"
            >

              Seguimiento

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

                  Gestionar

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





    body.innerHTML =
    html;

  }

  catch(error){

    console.log(error);

  }

};





// ======================
// GESTIONAR RECEPCION
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





    const consulta =

    await window.supabaseClient

    .from('recepciones')

    .select('*')

    .eq(

      'id',

      Number(id)

    )

    .single();





    if(consulta.error){

      console.log(
        consulta.error
      );

      alert(
        'Error obteniendo recepción'
      );

      return;

    }





    const recepcion =
    consulta.data;





    const nuevoEstado = prompt(

`Seleccione estado:

Pendiente

Novedad Reportada

En Gestión Compras

Esperando Proveedor

Solucionado

Cerrado`

    );





    if(!nuevoEstado){

      return;

    }





    const comentario = prompt(

      'Ingrese seguimiento'

    );





    if(comentario === null){

      return;

    }





    const fecha =

    new Date()
    .toLocaleString('es-CO');





    let seguimientoActual =

    recepcion.seguimiento || '';





    seguimientoActual +=

`\n
━━━━━━━━━━━━━━━━━━

[${fecha}]

COMPRAS

Estado:
${nuevoEstado}

Seguimiento:
${comentario}
`;





    const update =

    await window.supabaseClient

    .from('recepciones')

    .update({

      comentario_validacion:
      comentario,

      seguimiento:
      seguimientoActual,

      estado:
      nuevoEstado,

      usuario_validacion:

      window.usuarioLogueado.usuario ||

      'Compras'

    })

    .eq(

      'id',

      Number(id)

    );





    if(update.error){

      console.log(update.error);

      alert(
        'Error actualizando'
      );

      return;

    }





    window.crearNotificacion(

`📦 Seguimiento actualizado

Material:
${recepcion.material}

Estado:
${nuevoEstado}

Compras informó:

${comentario}`

    );





    await window.renderRecepciones();

    await window.actualizarKPIsRecepcion();





    alert(
      'Seguimiento actualizado'
    );

  }

  catch(error){

    console.log(error);

  }

};





// ======================
// VER SEGUIMIENTO
// ======================

window.verComentario = async function(comentario,id){

  try{

    const consulta =

    await window.supabaseClient

    .from('recepciones')

    .select('seguimiento')

    .eq(

      'id',

      Number(id)

    )

    .single();





    if(consulta.error){

      console.log(
        consulta.error
      );

      return;

    }





    const seguimiento =

    consulta.data.seguimiento || '';





    if(

      seguimiento.trim() === ''

    ){

      alert(
        'Sin seguimiento'
      );

      return;

    }





    alert(

`SEGUIMIENTO COMPLETO

${seguimiento}`

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





    await window.renderRecepciones();

    await window.actualizarKPIsRecepcion();





    alert(
      'Recepción eliminada'
    );

  }

  catch(error){

    console.log(error);

  }

};





// ======================
// ACTUALIZAR KPIS
// ======================

window.actualizarKPIsRecepcion = async function(){

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

};





// ======================
// AUTO REFRESH
// ======================

window.iniciarRefreshRecepcion = function(){

  if(window.refreshRecepcion){

    clearInterval(
      window.refreshRecepcion
    );

  }





  window.refreshRecepcion =

  setInterval(async function(){

    try{

      await window.renderRecepciones();

      await window.actualizarKPIsRecepcion();

    }

    catch(error){

      console.log(error);

    }

  },5000);

};





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

window.renderRecepciones();

window.actualizarKPIsRecepcion();

window.iniciarRefreshRecepcion();

}
