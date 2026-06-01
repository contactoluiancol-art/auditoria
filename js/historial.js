// ======================
// EVITAR DUPLICAR
// ======================

if(typeof window.historialCargado === 'undefined'){

window.historialCargado = true;





// ======================
// VALIDAR PERMISOS
// ======================

function tienePermiso(

  modulo,
  accion

){

  // ======================
  // ADMIN
  // ======================

  if(

    window.usuarioLogueado &&

    window.usuarioLogueado.rol === 'admin'

  ){

    return true;

  }





  // ======================
  // VALIDAR
  // ======================

  if(

    !window.permisosUsuario ||

    !window.permisosUsuario[modulo]

  ){

    return false;

  }



  return Boolean(

    window.permisosUsuario[modulo][accion]

  );

}





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





      const kpiHistorial =
      document.getElementById(
        'kpiHistorial'
      );



      const kpiInventario =
      document.getElementById(
        'kpiInventario'
      );



      const kpiAuditorias =
      document.getElementById(
        'kpiAuditorias'
      );



      const kpiRecepcion =
      document.getElementById(
        'kpiRecepcion'
      );





      if(kpiHistorial){

        kpiHistorial.innerText =
        '0';

      }



      if(kpiInventario){

        kpiInventario.innerText =
        '0';

      }



      if(kpiAuditorias){

        kpiAuditorias.innerText =
        '0';

      }



      if(kpiRecepcion){

        kpiRecepcion.innerText =
        '0';

      }



      return;

    }





    // ======================
    // KPIS
    // ======================

    const kpiHistorial =
    document.getElementById(
      'kpiHistorial'
    );



    if(kpiHistorial){

      kpiHistorial.innerText =
      data.length;
    }





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
      // BOTON ELIMINAR
      // ======================

      let botonEliminar = '';





      if(

        tienePermiso(
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

    const kpiInventario =
    document.getElementById(
      'kpiInventario'
    );



    const kpiAuditorias =
    document.getElementById(
      'kpiAuditorias'
    );



    const kpiRecepcion =
    document.getElementById(
      'kpiRecepcion'
    );





    if(kpiInventario){

      kpiInventario.innerText =
      inventario;
    }



    if(kpiAuditorias){

      kpiAuditorias.innerText =
      auditorias;
    }



    if(kpiRecepcion){

      kpiRecepcion.innerText =
      recepcion;
    }

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

    if(

      !tienePermiso(
        'historial',
        'eliminar'
      )

    ){

      alert(
        'No tiene permisos para eliminar historial'
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

      !tienePermiso(
        'historial',
        'eliminar'
      )

    ){

      alert(
        'No tiene permisos para eliminar historial'
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





    const kpiHistorial =
    document.getElementById(
      'kpiHistorial'
    );



    const kpiInventario =
    document.getElementById(
      'kpiInventario'
    );



    const kpiAuditorias =
    document.getElementById(
      'kpiAuditorias'
    );



    const kpiRecepcion =
    document.getElementById(
      'kpiRecepcion'
    );





    if(kpiHistorial){

      kpiHistorial.innerText =
      '0';
    }



    if(kpiInventario){

      kpiInventario.innerText =
      '0';
    }



    if(kpiAuditorias){

      kpiAuditorias.innerText =
      '0';
    }



    if(kpiRecepcion){

      kpiRecepcion.innerText =
      '0';
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

    !tienePermiso(
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
