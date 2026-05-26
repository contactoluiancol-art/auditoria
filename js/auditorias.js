// ======================
// CLIENTE GLOBAL
// ======================

const supabaseClient =

window.supabaseClient;





// ======================
// EVENTOS
// ======================

document.getElementById(
  'guardarAuditoria'
)
.addEventListener(
  'click',
  guardarAuditoria
);





// ======================
// GUARDAR AUDITORIA
// ======================

async function guardarAuditoria(){

  const proceso =

  document.getElementById(
    'procesoInput'
  )
  .value
  .trim();




  const hallazgo =

  document.getElementById(
    'hallazgoInput'
  )
  .value
  .trim();




  const responsable =

  document.getElementById(
    'responsableInput'
  )
  .value
  .trim();




  const estado =

  document.getElementById(
    'estadoInput'
  )
  .value;





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

  const { error } =

  await supabaseClient

  .from('auditorias')

  .insert([

    {

      proceso,

      hallazgo,

      responsable,

      estado

    }

  ]);





  // ======================
  // ERROR
  // ======================

  if(error){

    console.log(error);

    alert(
      'Error guardando auditoría'
    );

    return;

  }





  // ======================
  // ACTUALIZAR
  // ======================

  renderAuditorias();

  limpiarFormulario();





  // ======================
  // ALERTA
  // ======================

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



  body.innerHTML = '';





  // ======================
  // CONSULTAR
  // ======================

  const { data, error } =

  await supabaseClient

  .from('auditorias')

  .select('*')

  .order('id', {

    ascending: false

  });





  // ======================
  // ERROR
  // ======================

  if(error){

    console.log(error);

    return;

  }





  // ======================
  // VALIDAR VACIO
  // ======================

  if(

    !data ||

    data.length === 0

  ){

    body.innerHTML = `

      <tr>

        <td colspan="6">

          No hay auditorías registradas

        </td>

      </tr>

    `;

    return;

  }





  // ======================
  // TABLA
  // ======================

  data.forEach(item => {

    let estadoClass = '';





    // ======================
    // ESTADOS
    // ======================

    if(

      item.estado ===
      'Pendiente'

    ){

      estadoClass =
      'estado-pendiente';

    }

    else if(

      item.estado ===
      'En revisión'

    ){

      estadoClass =
      'estado-revision';

    }

    else{

      estadoClass =
      'estado-cerrado';

    }





    body.innerHTML += `

      <tr>

        <td>

          ${item.proceso}

        </td>

        <td>

          ${item.hallazgo}

        </td>

        <td>

          ${item.responsable}

        </td>

        <td>

          <span class="${estadoClass}">

            ${item.estado}

          </span>

        </td>

        <td>

          ${item.created_at || ''}

        </td>





        <!-- ACCIONES -->

        <td class="acciones-tabla">




          <!-- ELIMINAR -->

          <button
            class="btn-eliminar"
            onclick="eliminarAuditoria('${item.id}')"
          >

            Eliminar

          </button>





          <!-- PDF -->

          <button
            class="btn-pdf"
            onclick="descargarPDFIndividual('${item.id}')"
          >

            PDF

          </button>





          <!-- EDITAR -->

          <button
            class="btn-editar"
            onclick="editarEstado('${item.id}')"
          >

            Editar

          </button>

        </td>

      </tr>

    `;

  });

}






// ======================
// ELIMINAR
// ======================

async function eliminarAuditoria(id){

  const confirmar = confirm(

    '¿Desea eliminar esta auditoría?'

  );



  if(!confirmar){

    return;

  }





  // ======================
  // DELETE
  // ======================

  const { error } =

  await supabaseClient

  .from('auditorias')

  .delete()

  .eq('id', id);





  // ======================
  // ERROR
  // ======================

  if(error){

    console.log(error);

    alert(
      'Error eliminando auditoría'
    );

    return;

  }





  renderAuditorias();

}






// ======================
// EDITAR ESTADO
// ======================

async function editarEstado(id){

  // ======================
  // CONSULTAR
  // ======================

  const { data } =

  await supabaseClient

  .from('auditorias')

  .select('*')

  .eq('id', id)

  .single();





  if(!data){

    return;

  }





  // ======================
  // NUEVO ESTADO
  // ======================

  const nuevoEstado = prompt(

`Nuevo estado:

Pendiente
En revisión
Cerrado`,

    data.estado

  );





  // ======================
  // VALIDAR
  // ======================

  if(

    nuevoEstado !== 'Pendiente' &&

    nuevoEstado !== 'En revisión' &&

    nuevoEstado !== 'Cerrado'

  ){

    alert(
      'Estado inválido'
    );

    return;

  }





  // ======================
  // UPDATE
  // ======================

  const { error } =

  await supabaseClient

  .from('auditorias')

  .update({

    estado: nuevoEstado

  })

  .eq('id', id);





  // ======================
  // ERROR
  // ======================

  if(error){

    console.log(error);

    alert(
      'Error actualizando estado'
    );

    return;

  }





  renderAuditorias();





  alert(
    'Estado actualizado'
  );

}






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
// PDF
// ======================

async function descargarPDFIndividual(id){

  const { data } =

  await supabaseClient

  .from('auditorias')

  .select('*')

  .eq('id', id)

  .single();





  if(!data){

    alert(
      'Auditoría no encontrada'
    );

    return;

  }





  const auditoria = data;





  // ======================
  // JSPDF
  // ======================

  const { jsPDF } =

  window.jspdf;





  const doc =

  new jsPDF();





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
    35,
    'F'
  );





  doc.setTextColor(
    255,
    255,
    255
  );



  doc.setFontSize(22);



  doc.text(
    'ELECTRO INGENIERÍA',
    20,
    18
  );



  doc.setFontSize(11);



  doc.text(
    'Sistema Auditoría Logística',
    20,
    27
  );





  doc.setFontSize(10);



  doc.text(

    `Código:
AUD-${auditoria.id}`,

    150,

    18

  );



  doc.text(

    `Fecha:
${auditoria.created_at}`,

    150,

    26

  );





  // ======================
  // TITULO
  // ======================

  doc.setTextColor(
    0,
    0,
    0
  );



  doc.setFontSize(18);



  doc.text(
    'REPORTE AUDITORÍA',
    20,
    55
  );





  doc.line(
    20,
    60,
    190,
    60
  );





  // ======================
  // DATOS
  // ======================

  let y = 80;





  const datos = [

    [
      'Proceso',
      auditoria.proceso
    ],

    [
      'Responsable',
      auditoria.responsable
    ],

    [
      'Estado',
      auditoria.estado
    ]

  ];





  datos.forEach(item => {

    doc.text(
      `${item[0]}: ${item[1]}`,
      25,
      y
    );

    y += 15;

  });





  // ======================
  // HALLAZGO
  // ======================

  y += 10;



  doc.text(
    'Hallazgo:',
    25,
    y
  );



  y += 10;



  doc.text(

    auditoria.hallazgo,

    25,

    y,

    {

      maxWidth:160

    }

  );





  // ======================
  // DESCARGAR
  // ======================

  doc.save(

    `AUD-${auditoria.id}.pdf`

  );

}






// ======================
// INICIO
// ======================

renderAuditorias();
