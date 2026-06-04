// ======================
// EVITAR DUPLICAR
// ======================

if(typeof window.recepcionCargado === 'undefined'){

window.recepcionCargado = true;





// ======================
// VARIABLES GLOBALES
// ======================

window.refreshRecepcion = null;

window.recepcionGestionando = null;





// ======================
// BOTON GUARDAR
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





    // ======================
    // NOTIFICACION
    // ======================

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





    let html = '';


const usuarioActual =

window.usuarioLogueado?.usuario?.toLowerCase() || '';

const puedeGestionar =

usuarioActual === 'admin' ||

usuarioActual === 'auditor' ||

usuarioActual === 'compras';

const puedeEliminar =

usuarioActual === 'admin' ||

usuarioActual === 'auditor';


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

      else if(item.estado === 'Esperando Proveedor'){

        estadoClass =
        'estado-revision';

      }

      else{

        estadoClass =
        'estado-cerrado';

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

          <div class="acciones-tabla-mini">

            ${

              item.pdf_url

              ?

              `

            <button
  class="btn-mini btn-seguimiento-mini
  ${!puedeGestionar ? 'btn-bloqueado' : ''}"
  title="${
    puedeGestionar
    ? 'Seguimiento'
    : 'Solo Compras, Auditor y Admin'
  }"
  ${
    puedeGestionar
    ? `onclick="window.validarRecepcion(${item.id})"`
    : ''
  }
>

  📋

</button>

              `

              :

              ''

            }

            <button
              class="btn-mini btn-observacion-mini"
              title="Ver Observación"
              onclick="window.verObservacion(\`${item.observacion || ''}\`)"
            >

              👁️

            </button>
${
  item.pdf_url
  ?
  `
  <button
    class="btn-mini btn-pdf-mini"
    title="Ver PDF"
    onclick="window.open('${item.pdf_url}','_blank')"
  >
    📄
  </button>
  `
  :
  ''
}

            </button>

           <button
  class="btn-mini btn-eliminar-mini
  ${!puedeEliminar ? 'btn-bloqueado' : ''}"
  title="${
    puedeEliminar
    ? 'Eliminar'
    : 'Solo Admin y Auditor'
  }"
  ${
    puedeEliminar
    ? `onclick="eliminarRecepcion(${item.id})"`
    : ''
  }
>

  🗑️

</button>

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
// MODAL GESTION
// ======================

window.validarRecepcion = async function(id){

  try{

    window.recepcionGestionando =
    Number(id);





    const modal =

    document.getElementById(
      'modalGestion'
    );





    const timeline =

    document.getElementById(
      'timelineSeguimiento'
    );





    const comentarioInput =

    document.getElementById(
      'gestionComentarioInput'
    );





    const estadoInput =

    document.getElementById(
      'gestionEstadoInput'
    );





    comentarioInput.value = '';





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

      return;

    }





    const recepcion =
    consulta.data;





    estadoInput.value =
    recepcion.estado || 'Pendiente';





    timeline.innerHTML = '';





    if(

      !recepcion.seguimiento ||

      recepcion.seguimiento.trim() === ''

    ){

      timeline.innerHTML =

      `

      <div class="sin-notificaciones">

        Sin seguimiento registrado

      </div>

      `;

    }

    else{

      const bloques =

      recepcion.seguimiento

      .split('━━━━━━━━━━━━━━━━━━')

      .reverse();





      bloques.forEach(function(item){

        if(item.trim() === ''){

          return;

        }

timeline.innerHTML += `

<div class="timeline-item">

  <div class="timeline-comentario">

    ${item.replace(/\n/g,'<br>')}

  </div>

</div>

`;

timeline.innerHTML += `

<div class="timeline-item">

  <div class="timeline-comentario">

    ${item.replace(/\n/g,'<br>')}

  </div>

</div>

`;


      });

    }





    modal.classList.add(
      'active'
    );

  }

  catch(error){

    console.log(error);

  }

};





// ======================
// CERRAR MODAL
// ======================

window.cerrarModalGestion = function(){

  const modal =

  document.getElementById(
    'modalGestion'
  );





  if(modal){

    modal.classList.remove(
      'active'
    );

  }

};





// ======================
// GUARDAR GESTION
// ======================

const guardarGestionBtn =

document.getElementById(
  'guardarGestionBtn'
);





if(guardarGestionBtn){

  guardarGestionBtn.onclick =

  async function(){

    try{

      const comentario =

      document.getElementById(
        'gestionComentarioInput'
      ).value.trim();





      const estado =

      document.getElementById(
        'gestionEstadoInput'
      ).value;





      if(comentario === ''){

        alert(
          'Ingrese comentario'
        );

        return;

      }





      const consulta =

      await window.supabaseClient

      .from('recepciones')

      .select('*')

      .eq(

        'id',

        Number(
          window.recepcionGestionando
        )

      )

      .single();





      const recepcion =
      consulta.data;





      const fecha =

      new Date()
      .toLocaleString('es-CO');





      let seguimiento =

      recepcion.seguimiento || '';


seguimiento +=

`\n
━━━━━━━━━━━━━━━━━━

📅 ${fecha}

👤 Usuario:
${window.usuarioLogueado.usuario}

🏷️ Estado:
${estado}

📝 Comentario:
${comentario}
`;

      const update =

      await window.supabaseClient

      .from('recepciones')

      .update({

        estado:
        estado,

        comentario_validacion:
        comentario,

        seguimiento:
        seguimiento

      })

      .eq(

        'id',

        Number(
          window.recepcionGestionando
        )

      );





      if(update.error){

        console.log(update.error);

        return;

      }





      window.crearNotificacion(

`🛒 Compras actualizó seguimiento

Estado:
${estado}

Comentario:
${comentario}`

      );





      await window.renderRecepciones();

      await window.actualizarKPIsRecepcion();





      window.cerrarModalGestion();

    }

    catch(error){

      console.log(error);

    }

  };

}





// ======================
// ELIMINAR RECEPCION
// ======================

window.eliminarRecepcion = async function(id){

  try{

    const confirmar = confirm(
      '¿Eliminar recepción?'
    );





    if(!confirmar){

      return;

    }





    await window.supabaseClient

    .from('recepciones')

    .delete()

    .eq(

      'id',

      Number(id)

    );





    await window.renderRecepciones();

    await window.actualizarKPIsRecepcion();

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

    .select('*');





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





    if(recepciones.length > 0){

      const ultima =
      recepciones[0];





      if(kpiRevisado){

        kpiRevisado.innerText =

        ultima.porcentaje_revisado + '%';

      }





      if(kpiNovedades){

        kpiNovedades.innerText =

        ultima.novedades || 0;

      }





      if(kpiFaltantes){

        kpiFaltantes.innerText =

        ultima.faltantes || 0;

      }

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

    await window.renderRecepciones();

    await window.actualizarKPIsRecepcion();

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
    'pdfInput'
  ).value = '';

}





// ======================
// VER OBSERVACION
// ======================

window.verObservacion = function(observacion){

  alert(

`OBSERVACIÓN

${observacion}`

  );

};





// ======================
// INICIO
// ======================

window.renderRecepciones();

window.actualizarKPIsRecepcion();

window.iniciarRefreshRecepcion();

}
