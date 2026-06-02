
// ========================================
// EVITAR DUPLICAR MODULO
// ========================================

if(typeof window.historialCargado === 'undefined'){

window.historialCargado = true;

// ========================================
// ELEMENTOS HTML
// ========================================

const historialBody =
document.getElementById(
  'historialBody'
);

const buscarHistorial =
document.getElementById(
  'buscarHistorial'
);

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

// ========================================
// ACTUALIZAR KPIS
// ========================================

function actualizarKPIS(

  total,
  inventario,
  auditorias,
  recepcion

){

  if(kpiHistorial){

    kpiHistorial.innerText =
    total;

  }

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

// ========================================
// RENDER HISTORIAL
// ========================================

async function renderHistorialSistema(){

  try{

    // ========================================
    // VALIDAR TABLA
    // ========================================

    if(!historialBody){

      return;

    }

    historialBody.innerHTML = '';

    // ========================================
    // CONSULTAR HISTORIAL
    // ========================================

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

    // ========================================
    // ERROR
    // ========================================

    if(response.error){

      console.log(
        response.error
      );

      return;

    }

    const data =
    response.data || [];

    // ========================================
    // SIN DATOS
    // ========================================

    if(data.length === 0){

      historialBody.innerHTML = `

        <tr>

          <td colspan="6">

            No hay historial

          </td>

        </tr>

      `;

      actualizarKPIS(
        0,
        0,
        0,
        0
      );

      return;

    }

    // ========================================
    // CONTADORES
    // ========================================

    let inventario = 0;
    let auditorias = 0;
    let recepcion = 0;

    // ========================================
    // HTML TABLA
    // ========================================

    let html = '';

    // ========================================
    // RECORRER HISTORIAL
    // ========================================

    data.forEach(function(item){

      // ========================================
      // KPIS
      // ========================================

      if(item.modulo === 'INVENTARIO'){

        inventario++;

      }

      else if(item.modulo === 'AUDITORIAS'){

        auditorias++;

      }

      else if(item.modulo === 'RECEPCION'){

        recepcion++;

      }

      // ========================================
      // FECHA
      // ========================================

      let fechaTexto = '-';

      if(item.created_at){

        fechaTexto =

        new Date(
          item.created_at
        ).toLocaleString(
          'es-CO'
        );

      }

      // ========================================
      // BOTON ELIMINAR
      // ========================================

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

      // ========================================
      // FILA TABLA
      // ========================================

      html += `

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

    // ========================================
    // RENDER TABLA
    // ========================================

    historialBody.innerHTML =
    html;

    // ========================================
    // ACTUALIZAR KPIS
    // ========================================

    actualizarKPIS(

      data.length,
      inventario,
      auditorias,
      recepcion

    );

  }

  catch(error){

    console.log(error);

  }

}

// ========================================
// ELIMINAR REGISTRO
// ========================================

window.eliminarHistorial = async function(id){

  try{

    // ========================================
    // VALIDAR PERMISOS
    // ========================================

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

    // ========================================
    // CONFIRMAR
    // ========================================

    const confirmar = confirm(
      '¿Eliminar registro del historial?'
    );

    if(!confirmar){

      return;

    }

    // ========================================
    // ELIMINAR
    // ========================================

    const response =

    await window.supabaseClient

    .from('historial')

    .delete()

    .eq(

      'id',

      Number(id)

    );

    // ========================================
    // ERROR
    // ========================================

    if(response.error){

      console.log(
        response.error
      );

      alert(
        'Error eliminando historial'
      );

      return;

    }

    // ========================================
    // RECARGAR
    // ========================================

    await renderHistorialSistema();

    alert(
      'Registro eliminado'
    );

  }

  catch(error){

    console.log(error);

  }

};

// ========================================
// ELIMINAR TODO
// ========================================

window.eliminarTodoHistorial = async function(){

  try{

    // ========================================
    // VALIDAR PERMISO
    // ========================================

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

    // ========================================
    // CONFIRMAR
    // ========================================

    const confirmar = confirm(

      '¿Desea eliminar TODO el historial?'

    );

    if(!confirmar){

      return;

    }

    // ========================================
    // ELIMINAR TODO
    // ========================================

    const eliminar =

    await window.supabaseClient

    .from('historial')

    .delete()

    .neq('id',0);

    // ========================================
    // ERROR
    // ========================================

    if(eliminar.error){

      console.log(
        eliminar.error
      );

      alert(
        'Error eliminando historial'
      );

      return;

    }

    // ========================================
    // RECARGAR
    // ========================================

    await renderHistorialSistema();

    alert(
      'Historial eliminado correctamente'
    );

  }

  catch(error){

    console.log(error);

  }

};

// ========================================
// BUSCADOR
// ========================================

if(buscarHistorial){

  buscarHistorial.addEventListener(

    'keyup',

    function(){

      const filtro =

      this.value
      .toLowerCase();

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

// ========================================
// PERMISOS UI
// ========================================

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

// ========================================
// INICIO
// ========================================

aplicarPermisosHistorial();

renderHistorialSistema();

}

