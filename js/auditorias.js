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
// VALIDAR PERMISOS
// ======================

function tienePermiso(

  modulo,
  accion

){

  if(

    !window.permisosUsuario ||

    !window.permisosUsuario[modulo]

  ){

    return false;

  }



  return Boolean(

    window.permisosUsuario[modulo][accion]

  );

}





// ======================
// GUARDAR AUDITORIA
// ======================

async function guardarAuditoria(){

  try{

    // ======================
    // VALIDAR PERMISO
    // ======================

    if(

      !tienePermiso(
        'auditorias',
        'crear'
      )

    ){

      alert(
        'No tiene permisos para crear auditorías'
      );

      return;

    }





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





    const response =

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





    if(response.error){

      console.log(response.error);

      alert(
        'Error guardando auditoría'
      );

      return;

    }





    // ======================
    // HISTORIAL
    // ======================

    if(typeof guardarHistorial === 'function'){

      await guardarHistorial(

        'CREAR',

        'AUDITORIAS',

        'Se creó auditoría del proceso ' +
        proceso

      );

    }





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





      // ======================
      // PDF
      // ======================

      (

        tienePermiso(
          'auditorias',
          'ver'
        )

        ?

        '<button class="btn-pdf" onclick="generarPDF(' +

        item.id +

        ')">' +

        'PDF' +

        '</button>'

        :

        ''

      )





      +





      // ======================
      // EDITAR
      // ======================

      (

        tienePermiso(
          'auditorias',
          'editar'
        )

        ?

        '<button class="btn-editar" onclick="editarEstado(' +

        item.id +

        ')">' +

        'Editar' +

        '</button>'

        :

        ''

      )





      +





      // ======================
      // ELIMINAR
      // ======================

      (

        tienePermiso(
          'auditorias',
          'eliminar'
        )

        ?

        '<button class="btn-eliminar" onclick="eliminarAuditoria(' +

        item.id +

        ')">' +

        'Eliminar' +

        '</button>'

        :

        ''

      )





      +





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

    // ======================
    // VALIDAR PERMISO
    // ======================

    if(

      !tienePermiso(
        'auditorias',
        'ver'
      )

    ){

      alert(
        'No tiene permisos para generar PDF'
      );

      return;

    }





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





    var doc = new jsPDF(

      'p',
      'mm',
      'a4'

    );





    // ======================
    // COLORES
    // ======================

    var azulOscuro = [15,23,42];

    var azul = [37,99,235];

    var gris = [100,116,139];

    var grisClaro = [226,232,240];

    var fondo = [248,250,252];





    // ======================
    // FONDO
    // ======================

    doc.setFillColor(

      fondo[0],
      fondo[1],
      fondo[2]

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

      azulOscuro[0],
      azulOscuro[1],
      azulOscuro[2]

    );



    doc.rect(
      0,
      0,
      210,
      48,
      'F'
    );





    doc.setFillColor(

      azul[0],
      azul[1],
      azul[2]

    );



    doc.circle(
      195,
      8,
      34,
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

          15,

          8,

          28,

          28

        );

      }

    }

    catch(error){

      console.log(
        'No se pudo cargar el logo'
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



    doc.setFont(
      'helvetica',
      'bold'
    );



    doc.setFontSize(25);



    doc.text(

      'REPORTE EJECUTIVO',

      52,

      20

    );





    doc.setFontSize(13);



    doc.setFont(
      'helvetica',
      'normal'
    );



    doc.text(

      'Sistema Corporativo de Auditoría',

      52,

      30

    );





    // ======================
    // FECHA
    // ======================

    doc.setTextColor(

      gris[0],
      gris[1],
      gris[2]

    );



    doc.setFontSize(10);



    doc.text(

      'Fecha generación: ' +

      new Date()
      .toLocaleString(
        'es-CO'
      ),

      15,

      58

    );





    // ======================
    // CARD GENERAL
    // ======================

    doc.setFillColor(
      255,
      255,
      255
    );



    doc.roundedRect(

      15,

      66,

      180,

      65,

      6,

      6,

      'F'

    );





    doc.setDrawColor(

      grisClaro[0],
      grisClaro[1],
      grisClaro[2]

    );



    doc.roundedRect(

      15,

      66,

      180,

      65,

      6,

      6

    );





    // ======================
    // TITULO CARD
    // ======================

    doc.setTextColor(

      azulOscuro[0],
      azulOscuro[1],
      azulOscuro[2]

    );



    doc.setFont(
      'helvetica',
      'bold'
    );



    doc.setFontSize(16);



    doc.text(

      'Información General',

      22,

      82

    );





    doc.setDrawColor(

      azul[0],
      azul[1],
      azul[2]

    );



    doc.line(
      22,
      86,
      82,
      86
    );





    // ======================
    // DATOS
    // ======================

    doc.setFontSize(11);



    doc.setFont(
      'helvetica',
      'normal'
    );



    doc.setTextColor(

      gris[0],
      gris[1],
      gris[2]

    );



    doc.text(
      'Proceso:',
      22,
      102
    );



    doc.text(
      'Responsable:',
      22,
      114
    );



    doc.text(
      'Estado:',
      120,
      102
    );



    doc.text(
      'Fecha:',
      120,
      114
    );





    // ======================
    // VALORES
    // ======================

    doc.setTextColor(

      azulOscuro[0],
      azulOscuro[1],
      azulOscuro[2]

    );



    doc.setFont(
      'helvetica',
      'bold'
    );



    doc.text(
      String(data.proceso),
      55,
      102
    );



    doc.text(
      String(data.responsable),
      55,
      114
    );



    doc.text(
      String(data.estado),
      145,
      102
    );



    doc.text(

      new Date(
        data.created_at
      ).toLocaleString(
        'es-CO'
      ),

      145,

      114

    );





    // ======================
    // HALLAZGO
    // ======================

    doc.setFillColor(
      255,
      255,
      255
    );



    doc.roundedRect(

      15,

      145,

      180,

      88,

      6,

      6,

      'F'

    );





    doc.setDrawColor(

      grisClaro[0],
      grisClaro[1],
      grisClaro[2]

    );



    doc.roundedRect(

      15,

      145,

      180,

      88,

      6,

      6

    );





    doc.setFont(
      'helvetica',
      'bold'
    );



    doc.setFontSize(16);



    doc.text(

      'Hallazgo Detectado',

      22,

      160

    );





    doc.setDrawColor(

      azul[0],
      azul[1],
      azul[2]

    );



    doc.line(
      22,
      164,
      92,
      164
    );





    doc.setFont(
      'helvetica',
      'normal'
    );



    doc.setFontSize(11);



    doc.setTextColor(

      gris[0],
      gris[1],
      gris[2]

    );



    var textoHallazgo =

    doc.splitTextToSize(

      String(data.hallazgo),

      160

    );





    doc.text(

      textoHallazgo,

      22,

      178

    );





    // ======================
    // OBSERVACIONES
    // ======================

    doc.setFont(
      'helvetica',
      'bold'
    );



    doc.setFontSize(15);



    doc.setTextColor(

      azulOscuro[0],
      azulOscuro[1],
      azulOscuro[2]

    );



    doc.text(

      'Observaciones',

      22,

      245

    );





    doc.line(
      22,
      249,
      72,
      249
    );





    doc.setFont(
      'helvetica',
      'normal'
    );



    doc.setFontSize(10);



    var observacion =

    'Se recomienda realizar seguimiento y control sobre el hallazgo identificado para garantizar la mejora continua del proceso auditado.';





    var textoObservacion =

    doc.splitTextToSize(

      observacion,

      165

    );





    doc.text(

      textoObservacion,

      22,

      260

    );





    // ======================
    // FIRMAS
    // ======================

    doc.setDrawColor(
      180,
      180,
      180
    );



    doc.line(
      25,
      278,
      80,
      278
    );



    doc.setFontSize(10);



    doc.text(
      'Firma Auditor',
      38,
      284
    );





    doc.line(
      125,
      278,
      180,
      278
    );



    doc.text(
      'Firma Responsable',
      132,
      284
    );





    // ======================
    // FOOTER
    // ======================

    doc.setFillColor(

      azulOscuro[0],
      azulOscuro[1],
      azulOscuro[2]

    );



    doc.rect(
      0,
      288,
      210,
      9,
      'F'
    );





    doc.setTextColor(
      255,
      255,
      255
    );



    doc.setFontSize(8);



    doc.text(

      'Electroingeniería - Sistema Corporativo de Auditoría',

      15,

      294

    );





    doc.text(

      'Reporte Ejecutivo',

      165,

      294

    );





    // ======================
    // GUARDAR
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

    // ======================
    // VALIDAR PERMISO
    // ======================

    if(

      !tienePermiso(
        'auditorias',
        'eliminar'
      )

    ){

      alert(
        'No tiene permisos para eliminar auditorías'
      );

      return;

    }





    var confirmar = confirm(
      '¿Eliminar auditoría?'
    );



    if(!confirmar){

      return;

    }





    const consulta =

    await window.supabaseClient

    .from('auditorias')

    .select('*')

    .eq(

      'id',

      Number(id)

    )

    .single();





    const auditoria =
    consulta.data;





    await window.supabaseClient

    .from('auditorias')

    .delete()

    .eq(

      'id',

      Number(id)

    );





    // ======================
    // HISTORIAL
    // ======================

    if(typeof guardarHistorial === 'function'){

      await guardarHistorial(

        'ELIMINAR',

        'AUDITORIAS',

        'Se eliminó auditoría ' +
        auditoria.proceso

      );

    }





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

    // ======================
    // VALIDAR PERMISO
    // ======================

    if(

      !tienePermiso(
        'auditorias',
        'editar'
      )

    ){

      alert(
        'No tiene permisos para editar auditorías'
      );

      return;

    }





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





    // ======================
    // HISTORIAL
    // ======================

    if(typeof guardarHistorial === 'function'){

      await guardarHistorial(

        'EDITAR',

        'AUDITORIAS',

        'Se actualizó estado de auditoría ID ' +
        id

      );

    }





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
// APLICAR PERMISOS UI
// ======================

function aplicarPermisosAuditorias(){

  // ======================
  // CREAR
  // ======================

  if(

    !tienePermiso(
      'auditorias',
      'crear'
    )

  ){

    if(btnGuardarAuditoria){

      btnGuardarAuditoria.style.display =
      'none';

    }

  }

}





// ======================
// INICIO
// ======================

aplicarPermisosAuditorias();

renderAuditorias();

}
