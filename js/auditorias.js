// ======================
// EVENTO BOTON
// ======================

var btnGuardarAuditoria =
document.getElementById(
  'guardarAuditoria'
);



if(btnGuardarAuditoria){

  btnGuardarAuditoria.onclick =
  guardarAuditoria;

}





// ======================
// GUARDAR AUDITORIA
// ======================

async function guardarAuditoria(){

  try{

    var proceso =
    document.getElementById(
      'procesoInput'
    ).value.trim();



    var hallazgo =
    document.getElementById(
      'hallazgoInput'
    ).value.trim();



    var responsable =
    document.getElementById(
      'responsableInput'
    ).value.trim();



    var estado =
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

    ])

    .select();



    var data =
    response.data;



    var error =
    response.error;



    if(error){

      console.log(
        'ERROR SUPABASE:',
        error
      );

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
    // RECARGAR
    // ======================

    await renderAuditorias();

    limpiarFormulario();



    alert(
      'Auditoría guardada'
    );

  }

  catch(error){

    console.log(
      'ERROR GENERAL:',
      error
    );

  }

}





// ======================
// RENDER AUDITORIAS
// ======================

async function renderAuditorias(){

  try{

    var body =
    document.getElementById(
      'auditoriasBody'
    );



    if(!body){

      return;

    }



    body.innerHTML =

    '<tr>' +

      '<td colspan="6">' +

      'Cargando...' +

      '</td>' +

    '</tr>';



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

      console.log(
        'ERROR RENDER:',
        error
      );



      body.innerHTML =

      '<tr>' +

        '<td colspan="6">' +

        'Error cargando auditorías' +

        '</td>' +

      '</tr>';



      return;

    }



    body.innerHTML = '';



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

  catch(error){

    console.log(error);

  }

}





// ======================
// ELIMINAR
// ======================

async function eliminarAuditoria(id){

  var confirmar = confirm(

    '¿Eliminar auditoría?'

  );



  if(!confirmar){

    return;

  }



  var response =

  await window.supabaseClient

  .from('auditorias')

  .delete()

  .eq(

    'id',

    Number(id)

  );



  var error =
  response.error;



  if(error){

    console.log(error);

    return;

  }



  renderAuditorias();

}





// ======================
// EDITAR ESTADO
// ======================

async function editarEstado(id){

  try{

    var response =

    await window.supabaseClient

    .from('auditorias')

    .select('*')

    .eq(

      'id',

      Number(id)

    )

    .single();



    var data =
    response.data;



    var error =
    response.error;



    if(error){

      console.log(error);

      alert(
        'Error buscando auditoría'
      );

      return;

    }



    if(!data){

      alert(
        'Auditoría no encontrada'
      );

      return;

    }



    var nuevoEstado = prompt(

      'Nuevo estado:',

      data.estado

    );



    if(!nuevoEstado){

      return;

    }



    var update =

    await window.supabaseClient

    .from('auditorias')

    .update({

      estado: nuevoEstado

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



    await renderAuditorias();



    alert(
      'Auditoría actualizada'
    );

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
