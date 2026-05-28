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



    var fechaActual =

    new Date()
    .toISOString();



    var response =

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
        fechaActual

      }

    ])

    .select();



    if(response.error){

      console.log(response.error);

      alert(
        'Error guardando auditoría'
      );

      return;

    }



    // ======================
    // NOTIFICACION
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

      'Cargando auditorías...' +

      '</td>' +

    '</tr>';



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



    if(response.error){

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



        // ======================
        // PROCESO
        // ======================

        '<td>' +

          '<div class="texto-tabla">' +

            item.proceso +

          '</div>' +

        '</td>' +



        // ======================
        // HALLAZGO
        // ======================

        '<td>' +

          '<div class="hallazgo-box">' +

            item.hallazgo +

          '</div>' +

        '</td>' +



        // ======================
        // RESPONSABLE
        // ======================

        '<td>' +

          item.responsable +

        '</td>' +



        // ======================
        // ESTADO
        // ======================

        '<td>' +

          '<span class="' +

            estadoClass +

          '">' +

            item.estado +

          '</span>' +

        '</td>' +



        // ======================
        // FECHA
        // ======================

        '<td>' +

          new Date(

            item.created_at

          ).toLocaleString(

            'es-CO',

            {

              year:'numeric',
              month:'2-digit',
              day:'2-digit',
              hour:'2-digit',
              minute:'2-digit'

            }

          ) +

        '</td>' +



        // ======================
        // ACCIONES
        // ======================

        '<td>' +

          '<div class="acciones-tabla">' +



            // PDF

            '<button ' +

              'class="btn-pdf" ' +

              'onclick="generarPDF(' +

              "'" + item.id + "'" +

              ')"' +

            '>' +

              'PDF' +

            '</button>' +



            // EDITAR

            '<button ' +

              'class="btn-editar" ' +

              'onclick="editarEstado(' +

              "'" + item.id + "'" +

              ')"' +

            '>' +

              'Editar' +

            '</button>' +



            // ELIMINAR

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



    await renderAuditorias();



    alert(
      'Auditoría eliminada'
    );

  }

  catch(error){

    console.log(error);

  }

};





// ======================
// EDITAR ESTADO
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



    await renderAuditorias();



    alert(
      'Estado actualizado'
    );

  }

  catch(error){

    console.log(error);

  }

};





// ======================
// GENERAR PDF
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



    if(!data){

      alert(
        'Auditoría no encontrada'
      );

      return;

    }



    const { jsPDF } = window.jspdf;



    var doc = new jsPDF();



    // ======================
    // TITULO
    // ======================

    doc.setFontSize(22);



    doc.text(

      'REPORTE AUDITORIA',

      20,

      25

    );



    // ======================
    // LINEA
    // ======================

    doc.line(

      20,

      30,

      190,

      30

    );



    // ======================
    // DATOS
    // ======================

    doc.setFontSize(12);



    doc.text(

      'Proceso:',

      20,

      50

    );



    doc.text(

      String(data.proceso),

      60,

      50

    );





    doc.text(

      'Responsable:',

      20,

      65

    );



    doc.text(

      String(data.responsable),

      60,

      65

    );





    doc.text(

      'Estado:',

      20,

      80

    );



    doc.text(

      String(data.estado),

      60,

      80

    );





    doc.text(

      'Fecha:',

      20,

      95

    );



    doc.text(

      new Date(

        data.created_at

      ).toLocaleString(

        'es-CO'

      ),

      60,

      95

    );



    // ======================
    // HALLAZGO
    // ======================

    doc.text(

      'Hallazgo:',

      20,

      115

    );



    var textoHallazgo =

    doc.splitTextToSize(

      data.hallazgo,

      150

    );



    doc.text(

      textoHallazgo,

      20,

      125

    );



    // ======================
    // FOOTER
    // ======================

    doc.setFontSize(10);



    doc.text(

      'Sistema Auditoria y Gestion',

      20,

      280

    );



    // ======================
    // DESCARGAR
    // ======================

    doc.save(

      'auditoria_' +

      data.id +

      '.pdf'

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
