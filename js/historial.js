// ======================
// RENDER HISTORIAL
// ======================

async function renderHistorialSistema(){

  const body =
  document.getElementById(
    'historialBody'
  );



  if(!body){

    return;

  }



  body.innerHTML = '';





  const { data, error } =

  await window.supabaseClient

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

        <td>${item.usuario}</td>

        <td>${item.accion}</td>

        <td>${item.modulo}</td>

        <td>${item.descripcion}</td>

        <td>

          ${new Date(
            item.created_at
          ).toLocaleString()}

        </td>

      </tr>

    `;

  });

}





// ======================
// INICIO
// ======================

renderHistorialSistema();
