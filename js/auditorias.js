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

    alert(
      'Error guardando auditoría'
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
// PDF EJECUTIVO PREMIUM
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



    var doc = new jsPDF(

      'p',
      'mm',
      'a4'

    );





    // ======================
    // FECHA
    // ======================

    var fechaActual =

    new Date()
    .toLocaleString(
      'es-CO'
    );





    // ======================
    // FONDO
    // ======================

    doc.setFillColor(
      248,
      250,
      252
    );



    doc.rect(
      0,
      0,
      210,
      297,
      'F'
    );





    // ======================
    // HEADER
    // ======================

    doc.setFillColor(
      15,
      23,
      42
    );



    doc.rect(
      0,
      0,
      210,
      38,
      'F'
    );





    // ======================
    // LOGO
    // ======================

    try{

      var logo =

      document.querySelector(
        '.logo img'
      );



      if(logo){

        doc.addImage(

          logo,

          'PNG',

          14,

          6,

          24,

          24

        );

      }

    }

    catch(error){

      console.log(
        'Logo no encontrado'
      );

    }





    // ======================
    // TITULO
    // ======================

    doc.setTextColor(
      255,
      255,
      255
    );



    doc.setFontSize(22);



    doc.setFont(
      'helvetica',
      'bold'
    );



    doc.text(

      'REPORTE EJECUTIVO',

      48,

      17

    );





    doc.setFontSize(13);



    doc.setFont(
      'helvetica',
      'normal'
    );



    doc.text(

      'Auditoría Corporativa',

      48,

      25

    );





    // ======================
    // FECHA
    // ======================

    doc.setTextColor(
      15,
      23,
      42
    );



    doc.setFontSize(10);



    doc.text(

      'Fecha generación: ' +
      fechaActual,

      15,

      50

    );





    // ======================
    // CARD
    // ======================

    doc.setFillColor(
      255,
      255,
      255
    );



    doc.roundedRect(

      15,

      58,

      180,

      60,

      5,

      5,

      'F'

    );





    // ======================
    // TITULO CARD
    // ======================

    doc.setFontSize(15);



    doc.setFont(
      'helvetica',
      'bold'
    );



    doc.text(

      'Información Auditoría',

      22,

      72

    );





    // ======================
    // DATOS
    // ======================

    doc.setFontSize(11);



    doc.setFont(
      'helvetica',
      'normal'
    );



    doc.text(
      'Proceso:',
      22,
      86
    );



    doc.setFont(
      'helvetica',
      'bold'
    );



    doc.text(
      String(data.proceso),
      55,
      86
    );





    doc.setFont(
      'helvetica',
      'normal'
    );



    doc.text(
      'Responsable:',
      22,
      98
    );



    doc.setFont(
      'helvetica',
      'bold'
    );



    doc.text(
      String(data.responsable),
      55,
      98
    );





    doc.setFont(
      'helvetica',
      'normal'
    );



    doc.text(
      'Estado:',
      120,
      86
    );





    // ======================
    // COLOR ESTADO
    // ======================

    if(data.estado === 'Pendiente'){

      doc.setTextColor(
        220,
        38,
        38
      );

    }

    else if(data.estado === 'En revisión'){

      doc.setTextColor(
        217,
        119,
        6
      );

    }

    else{

      doc.setTextColor(
        22,
        163,
        74
      );

    }





    doc.setFont(
      'helvetica',
      'bold'
    );



    doc.text(
      String(data.estado),
      145,
      86
    );





    doc.setTextColor(
      15,
      23,
      42
    );





    doc.setFont(
      'helvetica',
      'normal'
    );



    doc.text(
      'Fecha:',
      120,
      98
    );



    doc.setFont(
      'helvetica',
      'bold'
    );



    doc.text(

      new Date(
        data.created_at
      ).toLocaleString(
        'es-CO'
      ),

      145,

      98

    );





    // ======================
    // HALLAZGO
    // ======================

    doc.setFillColor(
      239,
      246,
      255
    );



    doc.roundedRect(

      15,

      130,

      180,

      90,

      5,

      5,

      'F'

    );





    doc.setFontSize(14);



    doc.setFont(
      'helvetica',
      'bold'
    );



    doc.text(

      'Hallazgo Detectado',

      22,

      145

    );





    doc.setFontSize(11);



    doc.setFont(
      'helvetica',
      'normal'
    );



    var textoHallazgo =

    doc.splitTextToSize(

      String(data.hallazgo),

      160

    );





    doc.text(

      textoHallazgo,

      22,

      158

    );





    // ======================
    // FOOTER
    // ======================

    doc.setFillColor(
      15,
      23,
      42
    );



    doc.rect(
      0,
      280,
      210,
      17,
      'F'
    );





    doc.setTextColor(
      255,
      255,
      255
    );



    doc.setFontSize(9);



    doc.text(

      'Electroingeniería - Sistema Corporativo de Auditoría',

      15,

      289

    );





    doc.text(

      'Reporte generado automáticamente',

      125,

      289

    );





    // ======================
    // GUARDAR PDF
    // ======================

    doc.save(

      'Auditoria_' +

      data.id +

      '.pdf'

    );

  }

  catch(error){

    console.log(error);

    alert(
      'Error generando PDF'
    );

  }

};





// ======================
// ELIMINAR
// ======================

window.eliminarAuditoria = async function(id){

  try{

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



    alert(
      'Auditoría eliminada'
    );

  }

  catch(error){

    console.log(error);

  }

};





// ======================
// EDITAR
// ======================

window.editarEstado = async function(id){

  try{

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



    alert(
      'Estado actualizado'
    );

  }

  catch(error){

    console.log(error);

  }

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
