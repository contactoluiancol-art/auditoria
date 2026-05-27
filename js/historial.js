
// ======================
// CLIENTE
// ======================

const supabaseClient =

window.supabaseClient;





// ======================
// RENDER
// ======================

async function renderHistorial(){

  const body =

  document.getElementById(
    'historialBody'
  );




  body.innerHTML = '';





  const { data, error } =

  await supabaseClient

  .from('historial')

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

        <td colspan="5">

          No hay historial

        </td>

      </tr>

    `;

    return;

  }





  data.forEach(item => {

    body.innerHTML += `

      <tr>

        <td>

          ${item.usuario}

        </td>

        <td>

          ${item.accion}

        </td>

        <td>

          ${item.modulo}

        </td>

        <td>

          ${item.descripcion}

        </td>

        <td>

          ${new Date(
            item.fecha
          ).toLocaleString()}

        </td>

      </tr>

    `;

  });

}





// ======================
// INICIO
// ======================

renderHistorial();
