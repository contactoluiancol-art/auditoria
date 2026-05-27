
// ======================
// EVENTO
// ======================

const guardarAuditoriaBtn =
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



  body.innerHTML = '';



  const response =

  await window.supabaseClient

  .from('auditorias')

  .select('*')

  .order('id', {

    ascending: false

  });



  const data =
  response.data;



  const error =
  response.error;



  if(error){

    console.log(error);

    return;

  }



  if(!data || data.length === 0){

    body.innerHTML =

    '<tr>' +

      '<td colspan="6">' +

      'No hay auditorías registradas' +

      '</td>' +

    '</tr>';



    return;

  }



  data.forEach(function(item){

    let estadoClass = '';



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



    body.innerHTML +=

    '<tr>' +

      '<td>' + item.proceso + '</td>' +

      '<td>' + item.hallazgo + '</td>' +

      '<td>' + item.responsable + '</td>' +

      '<td>' +

        '<span class="' + estadoClass + '">' +

          item.estado +

        '</span>' +

      '</td>' +

      '<td>' +

        new Date(

          item.created_at

        ).toLocaleString() +

      '</td>' +

      '<td class="acciones-tabla">' +

        '<button class="btn-eliminar" onclick="eliminarAuditoria(' + item.id + ')">' +

          'Eliminar' +

        '</button>' +

      '</td>' +

    '</tr>';

  });

}





// ======================
// ELIMINAR AUDITORIA
// ======================

async function eliminarAuditoria(id){

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

  .eq('id', id);



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

}





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

