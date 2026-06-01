// ======================
// EVITAR DUPLICAR SCRIPT
// ======================

if(typeof window.auditoriasCargado === 'undefined'){

window.auditoriasCargado = true;





// ======================
// EVENTO
// ======================

var guardarAuditoriaBtn =
document.getElementById(
  'guardarAuditoria'
);

if(guardarAuditoriaBtn){

  guardarAuditoriaBtn.addEventListener(

    'click',

    guardarAuditoria

  );

}





// ======================
// GUARDAR AUDITORIA
// ======================

async function guardarAuditoria(){

  const proceso =
  document.getElementById(
    'procesoInput'
  ).value.trim();



  const hallazgo =
  document.getElementById(
    'hallazgoInput'
  ).value.trim();



  const responsable =
  document.getElementById(
    'responsableInput'
  ).value.trim();



  const estado =
  document.getElementById(
    'estadoInput'
  ).value;





  // ======================
  // VALIDAR
  // ======================

  if(

    !proceso ||

    !hallazgo ||

    !responsable

  ){

    alert(
      'Complete todos los campos'
    );

    return;

  }





  // ======================
  // INSERTAR
  // ======================

  const response =

  await window.supabaseClient

  .from('auditorias')

  .insert([

    {

      proceso: proceso,

      hallazgo: hallazgo,

      responsable: responsable,

      estado: estado

    }

  ]);





  const error =
  response.error;





  // ======================
  // ERROR
  // ======================

  if(error){

    console.log(error);

    alert(
      'Error guardando auditoría'
    );

    return;

  }





  // ======================
  // NOTIFICACIONES
  // ======================

  let notificaciones =

  JSON.parse(

    localStorage.getItem(
      'notificaciones'
    )

  ) || [];





  notificaciones.unshift({

    mensaje:

    'Nueva auditoría creada: ' +
    proceso,



    fecha:

    new Date()
    .toLocaleString()

  });





  localStorage.setItem(

    'notificaciones',

    JSON.stringify(
      notificaciones
    )

  );





  // ======================
  // HISTORIAL
  // ======================

  if(typeof guardarHistorial === 'function'){

    await guardarHistorial(

      'CREAR',

      'AUDITORIAS',

      'Se creó auditoría ' +
      proceso

    );

  }





  // ======================
  // ACTUALIZAR
  // ======================

  await renderAuditorias();

  limpiarFormulario();





  alert(
    'Auditoría guardada'
  );

}





// ======================
// RENDER AUDITORIAS
// ======================

async function renderAuditorias(){

  const body =
  document.getElementById(
    'auditoriasBody'
  );



  if(!body){

    return;

  }





  body.innerHTML =

  '<tr>' +

    '<td colspan="6">' +

    'Cargando auditorías...' +

    '</td>' +

  '</tr>';





  const response =

  await window.supabaseClient

  .from('auditorias')

  .select('*')

  .order(

    'id',

    {

      ascending: false

    }

  );





  const data =
  response.data;



  const error =
  response.error;





  // ======================
  // ERROR
  // ======================

  if(error){

    console.log(error);



    body.innerHTML =

    '<tr>' +

      '<td colspan="6">' +

      'Error cargando auditorías' +

      '</td>' +

    '</tr>';



    return;

  }





  // ======================
  // LIMPIAR
  // ======================

  body.innerHTML = '';





  // ======================
  // SIN DATOS
  // ======================

  if(!data || data.length === 0){

    body.innerHTML =

    '<tr>' +

      '<td colspan="6">' +

      'No hay auditorías registradas' +

      '</td>' +

    '</tr>';



    return;

  }





  // ======================
  // RECORRER
  // ======================

  data.forEach(function(item){

    let estadoClass = '';





    // ======================
    // ESTADOS
    // ======================

    if(item.estado === 'Pendiente'){

      estadoClass =
      'estado-pendiente';

    }

    else if(item.estado === 'En revisión'){

      estadoClass =
      'estado-revision';

    }

    else{

      estadoClass =
      'estado-cerrado';

    }





    // ======================
    // TABLA
    // ======================

    body.innerHTML +=

    '<tr>' +





      '<td>' +

        item.proceso +

      '</td>' +





      '<td class="hallazgo-box">' +

        item.hallazgo +

      '</td>' +





      '<td>' +

        item.responsable +

      '</td>' +





      '<td>' +

        '<span class="' + estadoClass + '">' +

          item.estado +

        '</span>' +

      '</td>' +





      '<td>' +

        new Date(

          item.created_at

        ).toLocaleString(

          'es-CO'

        ) +

      '</td>' +





      '<td>' +

        '<div class="acciones-tabla">' +





          '<button ' +

            'class="btn-editar" ' +

            'onclick="editarEstado(' +

            item.id +

            ')"' +

          '>' +

            'Editar' +

          '</button>' +





          '<button ' +

            'class="btn-eliminar" ' +

            'onclick="eliminarAuditoria(' +

            item.id +

            ')"' +

          '>' +

            'Eliminar' +

          '</button>' +





        '</div>' +

      '</td>' +





    '</tr>';

  });

}





// ======================
// EDITAR ESTADO
// ======================

window.editarEstado = async function(id){

  const response =

  await window.supabaseClient

  .from('auditorias')

  .select('*')

  .eq(

    'id',

    id

  )

  .single();





  const data =
  response.data;



  const error =
  response.error;





  if(error){

    console.log(error);

    alert(
      'Error buscando auditoría'
    );

    return;

  }





  const nuevoEstado = prompt(

`Nuevo estado:

Pendiente
En revisión
Cerrado`,

    data.estado

  );





  if(!nuevoEstado){

    return;

  }





  const update =

  await window.supabaseClient

  .from('auditorias')

  .update({

    estado:
    nuevoEstado

  })

  .eq(

    'id',

    id

  );





  if(update.error){

    console.log(update.error);

    alert(
      'Error actualizando'
    );

    return;

  }





  await renderAuditorias();





  alert(
    'Estado actualizado'
  );

};





// ======================
// ELIMINAR AUDITORIA
// ======================

window.eliminarAuditoria = async function(id){

  const confirmar = confirm(
    '¿Desea eliminar esta auditoría?'
  );





  if(!confirmar){

    return;

  }





  const response =

  await window.supabaseClient

  .from('auditorias')

  .delete()

  .eq(

    'id',

    id

  );





  const error =
  response.error;





  if(error){

    console.log(error);

    alert(
      'Error eliminando auditoría'
    );

    return;

  }





  await renderAuditorias();





  alert(
    'Auditoría eliminada'
  );

};





// ======================
// LIMPIAR FORMULARIO
// ======================

function limpiarFormulario(){

  document.getElementById(
    'procesoInput'
  ).value = '';



  document.getElementById(
    'hallazgoInput'
  ).value = '';



  document.getElementById(
    'responsableInput'
  ).value = '';



  document.getElementById(
    'estadoInput'
  ).value = 'Pendiente';

}





// ======================
// INICIO
// ======================

renderAuditorias();

}
