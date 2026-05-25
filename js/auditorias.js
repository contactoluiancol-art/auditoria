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

function guardarAuditoria(){

  const proceso =
  document.getElementById(
    'procesoInput'
  ).value;


  const hallazgo =
  document.getElementById(
    'hallazgoInput'
  ).value;


  const responsable =
  document.getElementById(
    'responsableInput'
  ).value;


  const estado =
  document.getElementById(
    'estadoInput'
  ).value;



  // VALIDAR

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



  // STORAGE

  const auditorias = JSON.parse(
    localStorage.getItem(
      'auditorias'
    )
  ) || [];



  // NUEVA AUDITORIA

  const nuevaAuditoria = {

    id: Date.now(),

    proceso,

    hallazgo,

    responsable,

    estado,

    fecha:
    new Date()
    .toLocaleDateString()

  };



  // GUARDAR

  auditorias.push(
    nuevaAuditoria
  );


  localStorage.setItem(

    'auditorias',

    JSON.stringify(
      auditorias
    )

  );



  // ACTUALIZAR

  renderAuditorias();


  limpiarFormulario();

}





// ======================
// RENDER AUDITORIAS
// ======================

function renderAuditorias(){

  const auditorias = JSON.parse(
    localStorage.getItem(
      'auditorias'
    )
  ) || [];


  const body =
  document.getElementById(
    'auditoriasBody'
  );


  body.innerHTML = '';



  auditorias.forEach(item => {

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



    // ======================
    // TABLA
    // ======================

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

          <span
            class="${estadoClass}"
          >

            ${item.estado}

          </span>

        </td>


        <td>

          ${item.fecha}

        </td>




        <!-- ACCIONES -->

        <td class="acciones-tabla">




          <!-- ELIMINAR -->

          <button
            class="btn-eliminar"
            onclick="eliminarAuditoria(${item.id})"
          >

            Eliminar

          </button>





          <!-- PDF -->

          <button
            class="btn-pdf"
            onclick="descargarPDFIndividual(${item.id})"
          >

            PDF

          </button>





          <!-- EDITAR -->

          <button
            class="btn-editar"
            onclick="editarEstado(${item.id})"
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

function eliminarAuditoria(id){

  let auditorias = JSON.parse(
    localStorage.getItem(
      'auditorias'
    )
  ) || [];


  auditorias = auditorias.filter(

    item =>

    String(item.id) !==
    String(id)

  );


  localStorage.setItem(

    'auditorias',

    JSON.stringify(
      auditorias
    )

  );


  renderAuditorias();

}





// ======================
// EDITAR ESTADO
// ======================

function editarEstado(id){

  const auditorias = JSON.parse(
    localStorage.getItem(
      'auditorias'
    )
  ) || [];


  const auditoria = auditorias.find(

    item =>

    String(item.id) ===
    String(id)

  );


  if(!auditoria){

    return;

  }



  // NUEVO ESTADO

  const nuevoEstado = prompt(

`Ingrese nuevo estado:

Pendiente
En revisión
Cerrado`

  );



  // VALIDAR

  if(

    nuevoEstado === 'Pendiente' ||

    nuevoEstado === 'En revisión' ||

    nuevoEstado === 'Cerrado'

  ){

    auditoria.estado =
    nuevoEstado;



    localStorage.setItem(

      'auditorias',

      JSON.stringify(
        auditorias
      )

    );



    renderAuditorias();

  }

  else{

    alert(
      'Estado inválido'
    );

  }

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
// INICIO
// ======================

renderAuditorias();





// ======================
// PDF CORPORATIVO SAP
// ======================

function descargarPDFIndividual(id){

  const auditorias = JSON.parse(
    localStorage.getItem(
      'auditorias'
    )
  ) || [];


  const auditoria = auditorias.find(

    item =>

    String(item.id) ===
    String(id)

  );


  if(!auditoria){

    alert(
      'Auditoría no encontrada'
    );

    return;

  }



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




  // EMPRESA

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




  // CODIGO

  doc.setFontSize(10);


  doc.text(

    `Código:
AUD-${auditoria.id}`,

    150,

    18

  );



  doc.text(

    `Fecha:
${auditoria.fecha}`,

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




  // LINEA

  doc.setDrawColor(
    200
  );


  doc.setLineWidth(
    0.2
  );


  doc.line(
    20,
    60,
    190,
    60
  );




  // ======================
  // TABLA
  // ======================

  let y = 80;




  // TITULO TABLA

  doc.setFillColor(
    241,
    245,
    249
  );


  doc.rect(
    20,
    y - 8,
    170,
    12,
    'F'
  );



  doc.setFontSize(12);


  doc.text(
    'DATOS AUDITORÍA',
    25,
    y
  );



  y += 18;




  // DATOS

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
    ],

    [
      'Fecha',
      auditoria.fecha
    ]

  ];



  datos.forEach(item => {



    // TITULO

    doc.setFillColor(
      248,
      250,
      252
    );


    doc.rect(
      20,
      y - 6,
      50,
      12,
      'F'
    );



    doc.text(
      item[0],
      25,
      y + 2
    );




    // VALOR

    doc.setDrawColor(
      230
    );


    doc.line(
      70,
      y + 6,
      190,
      y + 6
    );



    doc.text(
      item[1],
      75,
      y + 2
    );



    y += 15;

  });





  // ======================
  // HALLAZGO
  // ======================

  y += 10;


  doc.setFillColor(
    241,
    245,
    249
  );


  doc.rect(
    20,
    y - 8,
    170,
    12,
    'F'
  );



  doc.text(
    'HALLAZGO',
    25,
    y
  );



  y += 15;




  // CAJA

  doc.rect(
    20,
    y - 5,
    170,
    45
  );



  doc.text(

    auditoria.hallazgo,

    25,

    y + 5,

    {
      maxWidth:160
    }

  );





  // ======================
  // FIRMA
  // ======================

  y += 70;


  doc.line(
    25,
    y,
    90,
    y
  );



  y += 8;


  doc.setFontSize(11);


  doc.text(
    'Firma Auditor',
    25,
    y
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
    285,
    210,
    12,
    'F'
  );



  doc.setTextColor(
    255,
    255,
    255
  );


  doc.setFontSize(9);


  doc.text(
    'Sistemas Auditoria v1 | Luis Grisales',
    20,
    292
  );
  
  // ======================
  // DESCARGAR
  // ======================

  doc.save(

    `AUD-${auditoria.id}.pdf`

  );

}

// ======================
// EDITAR ESTADO
// ======================

function editarEstado(id){

  const auditorias = JSON.parse(
    localStorage.getItem('auditorias')
  ) || [];


  const auditoria = auditorias.find(
    item =>
    String(item.id) === String(id)
  );


  if(!auditoria){

    return;

  }


  // NUEVO ESTADO

  const nuevoEstado = prompt(

    `Cambiar estado:

1. Pendiente
2. En revisión
3. Cerrado`

  );


  // VALIDAR

  if(
    nuevoEstado === 'Pendiente' ||
    nuevoEstado === 'En revision' ||
    nuevoEstado === 'Cerrado'
  ){

    auditoria.estado =
    nuevoEstado;


    localStorage.setItem(

      'auditorias',

      JSON.stringify(auditorias)

    );


    renderAuditorias();

  }

  else{

    alert(
      'Estado inválido'
    );

  }

}