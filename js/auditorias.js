// ======================
// EVITAR DUPLICAR SCRIPT
// ======================

if(typeof window.auditoriasCargado === 'undefined'){

window.auditoriasCargado = true;





// ======================
// BOTON GUARDAR
// ======================

var btnGuardarAuditoria =

document.getElementById(
  'guardarAuditoria'
);





// ======================
// EVENTO BOTON
// ======================

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





    // ======================
    // CAMPOS
    // ======================

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
        new Date()
        .toISOString()

      }

    ]);





    // ======================
    // ERROR
    // ======================

    if(response.error){

      console.log(
        response.error
      );

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





    // ======================
    // ACTUALIZAR
    // ======================

    await window.renderAuditorias();

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





    // ======================
    // CONSULTAR
    // ======================

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





    // ======================
    // ERROR
    // ======================

    if(response.error){

      console.log(
        response.error
      );

      return;

    }





    var data =
    response.data || [];





    // ======================
    // SIN DATOS
    // ======================

    if(data.length === 0){

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

      var estadoClass = '';





      // ======================
      // ESTADO
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
      // FILA
      // ======================

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
// GENERAR PDF
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





    if(response.error){

      console.log(
        response.error
      );

      return;

    }





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
// ELIMINAR AUDITORIA
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





    var consulta =

    await window.supabaseClient

    .from('auditorias')

    .select('*')

    .eq(

      'id',

      Number(id)

    )

    .single();





    var auditoria =
    consulta.data;





    var eliminar =

    await window.supabaseClient

    .from('auditorias')

    .delete()

    .eq(

      'id',

      Number(id)

    );





    if(eliminar.error){

      console.log(
        eliminar.error
      );

      alert(
        'Error eliminando'
      );

      return;

    }





    if(typeof guardarHistorial === 'function'){

      await guardarHistorial(

        'ELIMINAR',

        'AUDITORIAS',

        'Se eliminó auditoría ' +
        auditoria.proceso

      );

    }





    await window.renderAuditorias();





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





    var update =

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





    if(update.error){

      console.log(
        update.error
      );

      alert(
        'Error actualizando'
      );

      return;

    }





    if(typeof guardarHistorial === 'function'){

      await guardarHistorial(

        'EDITAR',

        'AUDITORIAS',

        'Se editó auditoría ID ' +
        id

      );

    }





    await window.renderAuditorias();





    alert(
      'Estado actualizado'
    );

  }

  catch(error){

    console.log(error);

  }

};





// ======================
// REFRESH AUTOMATICO
// ======================

window.iniciarRefreshAuditorias = function(){

  if(window.refreshAuditoriasActivo){

    return;

  }





  window.refreshAuditoriasActivo = true;





  setInterval(function(){

    var body =

    document.getElementById(
      'auditoriasBody'
    );





    if(body){

      window.renderAuditorias();

    }

  },5000);

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
// APLICAR PERMISOS
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

window.renderAuditorias();

window.iniciarRefreshAuditorias();

}
