// ======================
// EVITAR DUPLICAR
// ======================

if(typeof window.historialCargado === 'undefined'){

window.historialCargado = true;





// ======================
// INTERVALO GLOBAL
// ======================

window.historialIntervalo = null;





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





    if(response.error){

      console.log(
        response.error
      );

      return;

    }





    const data =
    response.data || [];





    body.innerHTML = '';





    // ======================
    // SIN DATOS
    // ======================

    if(data.length === 0){

      body.innerHTML = `

        <tr>

          <td colspan="6">

            No hay historial

          </td>

        </tr>

      `;





      actualizarTexto(
        'kpiHistorial',
        '0'
      );

      actualizarTexto(
        'kpiInventario',
        '0'
      );

      actualizarTexto(
        'kpiAuditorias',
        '0'
      );

      actualizarTexto(
        'kpiRecepcion',
        '0'
      );

      return;

    }





    // ======================
    // KPIS
    // ======================

    actualizarTexto(
      'kpiHistorial',
      data.length
    );





    let inventario = 0;

    let auditorias = 0;

    let recepcion = 0;





    // ======================
    // RECORRER
    // ======================

    data.forEach(function(item){

      // ======================
      // CONTADORES
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
      // BOTON ELIMINAR
      // ======================

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





      // ======================
      // TABLA
      // ======================

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

    actualizarTexto(
      'kpiInventario',
      inventario
    );

    actualizarTexto(
      'kpiAuditorias',
      auditorias
    );

    actualizarTexto(
      'kpiRecepcion',
      recepcion
    );

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

    // ======================
    // VALIDAR PERMISO
    // ======================

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





    await renderHistorialSistema();





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

    // ======================
    // VALIDAR PERMISO
    // ======================

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

 const eliminar =

await window.supabaseClient

.from('historial')

.delete()

.not(
  'id',
  'is',
  null
);

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

    const { error } =

    await window.supabaseClient

    .from('historial')

    .delete()

    .not(
      'id',
      'is',
      null
    );

    if(error){

      console.log(error);

      alert(
        'Error eliminando historial'
      );

      return;

    }

    document.getElementById(
      'historialBody'
    ).innerHTML = '';

    await renderHistorialSistema();

    alert(
      'Historial eliminado correctamente'
    );

  }

  catch(error){

    console.log(error);

  }

};


    if(eliminar.error){

      console.log(
        eliminar.error
      );

      alert(
        'Error eliminando historial'
      );

      return;

    }





    await renderHistorialSistema();





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





      filas.forEach(function(fila){

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
// HELPERS
// ======================

function actualizarTexto(

  id,
  valor

){

  const elemento =

  document.getElementById(id);





  if(elemento){

    elemento.innerText =
    valor;

  }

}





// ======================
// AUTO REFRESH
// ======================

function iniciarRefreshHistorial(){

  // ======================
  // EVITAR DUPLICADOS
  // ======================

  if(window.historialIntervalo){

    clearInterval(
      window.historialIntervalo
    );

  }





  // ======================
  // REFRESH CADA 5 SEGUNDOS
  // ======================

  window.historialIntervalo =

  setInterval(function(){

    renderHistorialSistema();

  },5000);

}





// ======================
// INICIO
// ======================

aplicarPermisosHistorial();

renderHistorialSistema();

iniciarRefreshHistorial();

}
