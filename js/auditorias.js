// ======================
// EVENTO
// ======================

document.getElementById(
  'guardarAuditoria'
)
?.addEventListener(
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
  ).value.trim();

  const hallazgo =
  document.getElementById(
    'hallazgoInput'
  ).value.trim();

  const responsable =
  document.getElementById(
    'responsableInput'
  ).value.trim();

  const estado =
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





  const { error } =

  await window.supabaseClient

  .from('auditorias')

  .insert([

    {
      proceso,
      hallazgo,
      responsable,
      estado
    }

  ]);





  if(error){

    console.log(error);

    alert(
      'Error guardando auditoría'
    );

    return;

  }





  await guardarHistorial(

    'CREAR',

    'AUDITORIAS',

    `Se creó auditoría ${proceso}`

  );





  await renderAuditorias();

  limpiarFormulario();





  alert(
    'Auditoría guardada'
  );

}





// ======================
// RENDER
// ======================

async function renderAuditorias(){

  const body =
  document.getElementById(
    'auditoriasBody'
  );



  if(!body){

    return;

  }



  body.innerHTML = '';





  const { data, error } =

  await window.supabaseClient

  .from('auditorias')

  .select('*')

  .order('id', {

    ascending: false

  });





  if(error){

    console.log(error);

    return;

  }





  if(!data || data.length === 0){

    body.innerHTML = `

      <tr>

        <td colspan="6">

          No hay auditorías registradas

        </td>

      </tr>

    `;

    return;

  }





  data.forEach(item => {

    let estadoClass = '';



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





    body.innerHTML += `

      <tr>

        <td>${item.proceso}</td>

        <td>${item.hallazgo}</td>

        <td>${item.responsable}</td>

        <td>

          <span class="${estadoClass}">

            ${item.estado}

          </span>

        </td>

        <td>

          ${new Date(
            item.created_at
          ).toLocaleString()}

        </td>

        <td class="acciones-tabla">

          <button
            class="btn-eliminar"
            onclick="eliminarAuditoria('${item.id}')"
          >

            Eliminar

          </button>

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





  const { data } =

  await window.supabaseClient

  .from('auditorias')

  .select('*')

  .eq('id', id)

  .single();





  const { error } =

  await window.supabaseClient

  .from('auditorias')

  .delete()

  .eq('id', id);





  if(error){

    console.log(error);

    alert(
      'Error eliminando auditoría'
    );

    return;

  }





  await guardarHistorial(

    'ELIMINAR',

    'AUDITORIAS',

    `Se eliminó auditoría ${data?.proceso}`

  );





  await renderAuditorias();

}





// ======================
// EDITAR
// ======================

async function editarEstado(id){

  const { data } =

  await window.supabaseClient

  .from('auditorias')

  .select('*')

  .eq('id', id)

  .single();





  if(!data){

    return;

  }





  const nuevoEstado = prompt(

`Nuevo estado:

Pendiente
En revisión
Cerrado`,

    data.estado

  );





  if(!nuevoEstado){

    return;

  }





  const { error } =

  await window.supabaseClient

  .from('auditorias')

  .update({

    estado: nuevoEstado

  })

  .eq('id', id);





  if(error){

    console.log(error);

    alert(
      'Error actualizando'
    );

    return;

  }





  await guardarHistorial(

    'EDITAR',

    'AUDITORIAS',

    `Se editó auditoría ${data.proceso}`

  );





  await renderAuditorias();

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
