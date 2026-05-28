
// ======================
// EVITAR DUPLICAR SCRIPT
// ======================

if(typeof window.auditoriasCargado === 'undefined'){

window.auditoriasCargado = true;





// ======================
// BOTON
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
// GUARDAR
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

        proceso,
        hallazgo,
        responsable,
        estado

      }

    ])

    .select();



    if(response.error){

      alert(
        'Error guardando auditoría'
      );

      return;

    }



    await renderAuditorias();

    limpiarFormulario();



    alert(
      'Auditoría guardada'
    );

  }

  catch(error){

    console.log(error);

  }

}





// ======================
// RENDER
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



    body.innerHTML = '';



    var response =

    await window.supabaseClient

    .from('auditorias')

    .select('*')

    .order(

      'id',

      {

        ascending:false

      }

    );



    var data =
    response.data;



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



        '<td>' +

          '<div class="texto-tabla">' +

            item.proceso +

          '</div>' +

        '</td>' +



        '<td>' +

          '<div class="hallazgo-box">' +

            item.hallazgo +

          '</div>' +

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

          ).toLocaleString() +

        '</td>' +



        '<td>' +

          '<div class="acciones-tabla">' +



            '<button class="btn-pdf">' +

              'PDF' +

            '</button>' +



            '<button ' +

              'class="btn-editar" ' +

              'onclick="editarEstado(' +

              "'" + item.id + "'" +

              ')"' +

            '>' +

              'Editar' +

            '</button>' +



            '<button ' +

              'class="btn-eliminar" ' +

              'onclick="eliminarAuditoria(' +

              "'" + item.id + "'" +

              ')"' +

            '>' +

              'Eliminar' +

            '</button>' +



          '</div>' +

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

window.eliminarAuditoria = async function(id){

  var confirmar = confirm(
    '¿Eliminar auditoría?'
  );



  if(!confirmar){

    return;

  }



  await window.supabaseClient

  .from('auditorias')

  .delete()

  .eq(

    'id',

    Number(id)

  );



  renderAuditorias();

};





// ======================
// EDITAR
// ======================

window.editarEstado = async function(id){

  var nuevoEstado = prompt(

    'Nuevo estado:'

  );



  if(!nuevoEstado){

    return;

  }



  await window.supabaseClient

  .from('auditorias')

  .update({

    estado:nuevoEstado

  })

  .eq(

    'id',

    Number(id)

  );



  renderAuditorias();

};





// ======================
// LIMPIAR
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

