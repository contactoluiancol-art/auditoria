
// ======================
// EVENTO
// ======================

if(

  document.getElementById(
    'guardarAuditoria'
  )

){

  document.getElementById(

    'guardarAuditoria'

  ).onclick = guardarAuditoria;

}





// ======================
// GUARDAR AUDITORIA
// ======================

async function guardarAuditoria(){

  var procesoInput =
  document.getElementById(
    'procesoInput'
  );



  var hallazgoInput =
  document.getElementById(
    'hallazgoInput'
  );



  var responsableInput =
  document.getElementById(
    'responsableInput'
  );



  var estadoInput =
  document.getElementById(
    'estadoInput'
  );



  if(

    !procesoInput ||

    !hallazgoInput ||

    !responsableInput ||

    !estadoInput

  ){

    return;

  }



  var proceso =
  procesoInput.value.trim();



  var hallazgo =
  hallazgoInput.value.trim();



  var responsable =
  responsableInput.value.trim();



  var estado =
  estadoInput.value;



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



  var response =

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



  var error =
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

  var notificaciones =

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

  var body =
  document.getElementById(
    'auditoriasBody'
  );



  if(!body){

    return;

  }



  body.innerHTML = '';



  var response =

  await window.supabaseClient

  .from('auditorias')

  .select('*')

  .order(

    'id',

    {

      ascending: false

    }

  );



  var data =
  response.data;



  var error =
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

    var estadoClass = '';



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



        '<button ' +

          'class="btn-eliminar" ' +

          'onclick="eliminarAuditoria(' +

            "'" + item.id + "'" +

          ')"' +

        '>' +

          'Eliminar' +

        '</button>' +



        '<button ' +

          'class="btn-editar" ' +

          'onclick="editarEstado(' +

            "'" + item.id + "'" +

          ')"' +

        '>' +

          'Editar' +

        '</button>' +



      '</td>' +

    '</tr>';

  });

}





// ======================
// ELIMINAR AUDITORIA
// ======================

async function eliminarAuditoria(id){

  var confirmar = confirm(

    '¿Desea eliminar esta auditoría?'

  );



  if(!confirmar){

    return;

  }



  var consulta =

  await window.supabaseClient

  .from('auditorias')

  .select('*')

  .eq('id', id)

  .single();



  var data =
  consulta.data;



  var response =

  await window.supabaseClient

  .from('auditorias')

  .delete()

  .eq('id', id);



  var error =
  response.error;



  if(error){

    console.log(error);

    alert(
      'Error eliminando auditoría'
    );

    return;

  }



  if(typeof guardarHistorial === 'function'){

    await guardarHistorial(

      'ELIMINAR',

      'AUDITORIAS',

      'Se eliminó auditoría ' +
      data.proceso

    );

  }



  await renderAuditorias();

}





// ======================
// EDITAR ESTADO
// ======================

async function editarEstado(id){

  var consulta =

  await window.supabaseClient

  .from('auditorias')

  .select('*')

  .eq('id', id)

  .single();



  var data =
  consulta.data;



  if(!data){

    return;

  }



  var nuevoEstado = prompt(

    'Nuevo estado:',

    data.estado

  );



  if(!nuevoEstado){

    return;

  }



  var response =

  await window.supabaseClient

  .from('auditorias')

  .update({

    estado: nuevoEstado

  })

  .eq('id', id);



  var error =
  response.error;



  if(error){

    console.log(error);

    alert(
      'Error actualizando'
    );

    return;

  }



  if(typeof guardarHistorial === 'function'){

    await guardarHistorial(

      'EDITAR',

      'AUDITORIAS',

      'Se editó auditoría ' +
      data.proceso

    );

  }



  await renderAuditorias();



  alert(
    'Auditoría actualizada'
  );

}





// ======================
// LIMPIAR FORMULARIO
// ======================

function limpiarFormulario(){

  var procesoInput =
  document.getElementById(
    'procesoInput'
  );



  var hallazgoInput =
  document.getElementById(
    'hallazgoInput'
  );



  var responsableInput =
  document.getElementById(
    'responsableInput'
  );



  var estadoInput =
  document.getElementById(
    'estadoInput'
  );



  if(procesoInput){

    procesoInput.value = '';

  }



  if(hallazgoInput){

    hallazgoInput.value = '';

  }



  if(responsableInput){

    responsableInput.value = '';

  }



  if(estadoInput){

    estadoInput.value =
    'Pendiente';

  }

}





// ======================
// INICIO
// ======================

renderAuditorias();

