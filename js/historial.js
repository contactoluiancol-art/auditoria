
// ======================
// EVITAR DUPLICAR
// ======================

if(typeof window.historialCargado === 'undefined'){

window.historialCargado = true;





// ======================
// RENDER HISTORIAL
// ======================

window.renderHistorialSistema = async function(){

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





      document.getElementById(
        'kpiHistorial'
      ).innerText = '0';



      document.getElementById(
        'kpiInventario'
      ).innerText = '0';



      document.getElementById(
        'kpiAuditorias'
      ).innerText = '0';



      document.getElementById(
        'kpiRecepcion'
      ).innerText = '0';



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

      if(item.modulo === 'INVENTARIO'){

        inventario++;

      }

      else if(item.modulo === 'AUDITORIAS'){

        auditorias++;

      }

      else if(item.modulo === 'RECEPCION'){

        recepcion++;

      }





      let fechaTexto = '-';





      if(item.created_at){

        fechaTexto =

        new Date(
          item.created_at
        ).toLocaleString(

          'es-CO'

        );

      }





      let botonEliminar = '';





      if(

        window.tienePermiso(
          'historial',
          'eliminar'
        )

      ){

        botonEliminar = `

          <button
            class="btn-eliminar"
            onclick="eliminarHistorial(${item.id})"
          >

            Eliminar

          </button>

        `;

      }





      body.innerHTML += `

        <tr>

          <td>

            ${item.usuario || '-'}

          </td>





          <td>

            ${item.modulo || '-'}

          </td>





          <td>

            ${item.accion || '-'}

          </td>





          <td class="hallazgo-box">

            ${item.descripcion || '-'}

          </td>





          <td>

            ${fechaTexto}

          </td>





          <td>

            ${botonEliminar}

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

};





// ======================
// ELIMINAR HISTORIAL
// ======================

window.eliminarHistorial = async function(id){

  try{

    if(

      !window.tienePermiso(
        'historial',
        'eliminar'
      )

    ){

      alert(
        'No tiene permisos'
      );

      return;

    }





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
// ELIMINAR TODO
// ======================

window.eliminarTodoHistorial = async function(){

  try{

    if(

      !window.tienePermiso(
        'historial',
        'eliminar'
      )

    ){

      alert(
        'No tiene permisos'
      );

      return;

    }





    const confirmar = confirm(

      '¿Desea eliminar TODO el historial?'

    );





    if(!confirmar){

      return;

    }





    const consulta =

    await window.supabaseClient

    .from('historial')

    .select('id');





    if(consulta.error){

      console.log(
        consulta.error
      );

      alert(
        'Error consultando historial'
      );

      return;

    }





    const registros =
    consulta.data || [];





    if(registros.length === 0){

      alert(
        'No hay historial'
      );

      return;

    }





    const ids =

    registros.map(item => item.id);





    const eliminar =

    await window.supabaseClient

    .from('historial')

    .delete()

    .in(

      'id',

      ids

    );





    if(eliminar.error){

      console.log(
        eliminar.error
      );

      alert(
        'Error eliminando historial'
      );

      return;

    }





    document.getElementById(
      'kpiHistorial'
    ).innerText = '0';



    document.getElementById(
      'kpiInventario'
    ).innerText = '0';



    document.getElementById(
      'kpiAuditorias'
    ).innerText = '0';



    document.getElementById(
      'kpiRecepcion'
    ).innerText = '0';





    renderHistorialSistema();





    alert(
      'Historial eliminado correctamente'
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
// OCULTAR BOTON
// ======================

function aplicarPermisosHistorial(){

  const btnEliminarTodo =

  document.getElementById(
    'btnEliminarTodoHistorial'
  );





  if(

    btnEliminarTodo &&

    !window.tienePermiso(
      'historial',
      'eliminar'
    )

  ){

    btnEliminarTodo.style.display =
    'none';

  }

}





// ======================
// INICIO
// ======================

aplicarPermisosHistorial();

renderHistorialSistema();

}
```
