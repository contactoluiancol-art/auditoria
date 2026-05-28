// ======================
// EVITAR DUPLICAR
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



    await window.supabaseClient

    .from('auditorias')

    .insert([

      {

        proceso:
        proceso,

        hallazgo:
        hallazgo,

        responsable:
        responsable,

        estado:
        estado,

        created_at:
        new Date()
        .toISOString()

      }

    ]);



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



    if(!data){

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

      '<span class="' +

      estadoClass +

      '">' +

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



      '<button class="btn-pdf" onclick="generarPDF(' +

      item.id +

      ')">' +

      'PDF' +

      '</button>' +



      '<button class="btn-editar" onclick="editarEstado(' +

      item.id +

      ')">' +

      'Editar' +

      '</button>' +



      '<button class="btn-eliminar" onclick="eliminarAuditoria(' +

      item.id +

      ')">' +

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
// PDF PREMIUM
// ======================

window.generarPDF = async function(id){

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



    const { jsPDF } = window.jspdf;

    var doc = new jsPDF();



    // HEADER

    doc.setFillColor(
      15,
      23,
      42
    );



    doc.rect(
      0,
      0,
      210,
      40,
      'F'
    );



    // TITULO

    doc.setTextColor(
      255,
      255,
      255
    );



    doc.setFontSize(22);



    doc.text(
      'REPORTE AUDITORIA',
      20,
      24
    );



    // BODY

    doc.setTextColor(
      15,
      23,
      42
    );



    doc.setFontSize(13);



    doc.text(
      'Proceso:',
      20,
      60
    );



    doc.text(
      String(data.proceso),
      60,
      60
    );



    doc.text(
      'Responsable:',
      20,
      80
    );



    doc.text(
      String(data.responsable),
      60,
      80
    );



    doc.text(
      'Estado:',
      20,
      100
    );



    doc.text(
      String(data.estado),
      60,
      100
    );



    doc.text(
      'Fecha:',
      20,
      120
    );



    doc.text(

      new Date(

        data.created_at

      ).toLocaleString(

        'es-CO'

      ),

      60,

      120

    );



    // HALLAZGO

    doc.text(
      'Hallazgo:',
      20,
      145
    );



    var texto =

    doc.splitTextToSize(

      data.hallazgo,

      160

    );



    doc.text(
      texto,
      20,
      160
    );



    // FOOTER

    doc.setFontSize(10);



    doc.text(

      'Sistema Auditoria y Gestion',

      20,

      285

    );



    // DESCARGA

    doc.save(

      'Auditoria_' +

      data.id +

      '.pdf'

    );

  }

  catch(error){

    console.log(error);

  }

};





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

    estado:
    nuevoEstado

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
