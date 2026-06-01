// ======================
// EVITAR DUPLICAR
// ======================

if(typeof window.historialCargado === 'undefined'){

window.historialCargado = true;





// ======================
// RENDER HISTORIAL
// ======================

async function renderHistorialSistema(){

  try{

    const body =
    document.getElementById(
      'historialBody'
    );



    if(!body){

      return;

    }





    body.innerHTML = '';





    const response =

    await window.supabaseClient

    .from('historial')

    .select('*')

    .order(

      'id',

      {

        ascending:false

      }

    );





    const data =
    response.data;



    const error =
    response.error;





    if(error){

      console.log(error);

      return;

    }





    // ======================
    // SIN DATOS
    // ======================

    if(!data || data.length === 0){

      body.innerHTML = `

        <tr>

          <td colspan="6">

            No hay historial

          </td>

        </tr>

      `;

      return;

    }





    // ======================
    // KPIS
    // ======================

    document.getElementById(
      'kpiHistorial'
    ).innerText =

    data.length;





    let inventario = 0;
    let auditorias = 0;
    let recepcion = 0;





    // ======================
    // RECORRER
    // ======================

    data.forEach(item => {

      // ======================
      // KPIS
      // ======================

      if(item.modulo === 'INVENTARIO'){

        inventario++;

      }

      else if(item.modulo === 'AUDITORIAS'){

        auditorias++;

      }

      else if(item.modulo === 'RECEPCION'){

        recepcion++;

      }





      // ======================
      // FECHA
      // ======================

      let fechaTexto = '-';





      if(item.created_at){

        fechaTexto =

        new Date(
          item.created_at
        ).toLocaleString(

          'es-CO'

        );

      }





      // ======================
      // TABLA
      // ======================

      body.innerHTML += `

        <tr>

          <!-- USUARIO -->

          <td>

            ${item.usuario || '-'}

          </td>





          <!-- MODULO -->

          <td>

            ${item.modulo || '-'}

          </td>





          <!-- ACCION -->

          <td>

            ${item.accion || '-'}

          </td>





          <!-- DETALLE -->

          <td class="hallazgo-box">

            ${item.descripcion || '-'}

          </td>





          <!-- FECHA -->

          <td>

            ${fechaTexto}

          </td>





          <!-- ACCIONES -->

          <td>

            <button
              class="btn-eliminar"
              onclick="eliminarHistorial(${item.id})"
            >

              Eliminar

            </button>

          </td>

        </tr>

      `;

    });





    // ======================
    // ACTUALIZAR KPIS
    // ======================

    document.getElementById(
      'kpiInventario'
    ).innerText =

    inventario;





    document.getElementById(
      'kpiAuditorias'
    ).innerText =

    auditorias;





    document.getElementById(
      'kpiRecepcion'
    ).innerText =

    recepcion;

  }

  catch(error){

    console.log(error);

  }

}





// ======================
// ELIMINAR HISTORIAL
// ======================

window.eliminarHistorial = async function(id){

  try{

    const confirmar = confirm(
      '¿Eliminar registro del historial?'
    );





    if(!confirmar){

      return;

    }





    const response =

    await window.supabaseClient

    .from('historial')

    .delete()

    .eq(

      'id',

      Number(id)

    );





    if(response.error){

      console.log(
        response.error
      );

      alert(
        'Error eliminando historial'
      );

      return;

    }





    renderHistorialSistema();





    alert(
      'Registro eliminado'
    );

  }

  catch(error){

    console.log(error);

  }

};





// ======================
// BUSCADOR
// ======================

const buscarHistorial =
document.getElementById(
  'buscarHistorial'
);





if(buscarHistorial){

  buscarHistorial.addEventListener(

    'keyup',

    function(){

      const filtro =
      this.value.toLowerCase();



      const filas =
      document.querySelectorAll(
        '#historialBody tr'
      );





      filas.forEach(fila => {

        fila.style.display =

        fila.innerText
        .toLowerCase()
        .includes(filtro)

        ?

        ''

        :

        'none';

      });

    }

  );

}





// ======================
// INICIO
// ======================

renderHistorialSistema();

}


// ======================
// ELIMINAR TODO
// ======================

window.eliminarTodoHistorial = async function(){

  try{

    const confirmar = confirm(

      '¿Desea eliminar TODO el historial?'

    );





    if(!confirmar){

      return;

    }





    const response =

    await window.supabaseClient

    .from('historial')

    .delete()

    .neq(

      'id',

      0

    );





    if(response.error){

      console.log(
        response.error
      );

      alert(
        'Error eliminando historial'
      );

      return;

    }





    renderHistorialSistema();





    alert(
      'Historial eliminado correctamente'
    );

  }

  catch(error){

    console.log(error);

  }

};
