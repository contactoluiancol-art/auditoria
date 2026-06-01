
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

    // ======================
    // VALIDAR PERMISO
    // ======================

    if(

      !window.tienePermiso(
        'auditorias',
        'crear'
      )

    ){

      alert(
        'No tiene permisos'
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
// RENDER
// ======================

window.renderAuditorias = async function(){

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

      'No hay auditorías' +

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





      (

        window.tienePermiso(
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





      (

        window.tienePermiso(
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





      (

        window.tienePermiso(
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

};





// ======================
// PDF
// ======================

window.generarPDF = async function(id){

  try{

    if(

      !window.tienePermiso(
        'auditorias',
        'ver'
      )

    ){

      alert(
        'No tiene permisos'
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





    var doc = new jsPDF();





    doc.setFontSize(18);

    doc.text(
      'Reporte Auditoría',
      20,
      20
    );



    doc.setFontSize(12);

    doc.text(
      'Proceso: ' + data.proceso,
      20,
      40
    );



    doc.text(
      'Responsable: ' + data.responsable,
      20,
      50
    );



    doc.text(
      'Estado: ' + data.estado,
      20,
      60
    );



    doc.text(

      'Fecha: ' +

      new Date(
        data.created_at
      ).toLocaleString('es-CO'),

      20,

      70

    );



    var texto =

    doc.splitTextToSize(

      data.hallazgo,

      160

    );



    doc.text(
      'Hallazgo:',
      20,
      90
    );



    doc.text(
      texto,
      20,
      100
    );



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

  try{

    if(

      !window.tienePermiso(
        'auditorias',
        'eliminar'
      )

    ){

      alert(
        'No tiene permisos'
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

    if(

      !window.tienePermiso(
        'auditorias',
        'editar'
      )

    ){

      alert(
        'No tiene permisos'
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





    if(typeof guardarHistorial === 'function'){

      await guardarHistorial(

        'EDITAR',

        'AUDITORIAS',

        'Se editó auditoría ID ' +
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
// PERMISOS UI
// ======================

function aplicarPermisosAuditorias(){

  if(

    !window.tienePermiso(
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

