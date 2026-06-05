
// ========================================
// EVITAR DUPLICAR SCRIPT
// ========================================

if(typeof window.inventarioCargado === 'undefined'){

window.inventarioCargado = true;

// ========================================
// VARIABLES GLOBALES
// ========================================

window.inventario =

JSON.parse(

  localStorage.getItem(
    'inventario'
  )

) || [];

window.productoActual = null;

// ========================================
// ELEMENTOS HTML
// ========================================

const excelFile =
document.getElementById(
  'excelFile'
);

const reiniciarInventarioBtn =
document.getElementById(
  'reiniciarInventario'
);

const buscarBtn =
document.getElementById(
  'buscarBtn'
);

const guardarConteoBtn =
document.getElementById(
  'guardarConteo'
);

const exportarExcelBtn =
document.getElementById(
  'exportarExcel'
);

const buscadorInventario =
document.getElementById(
  'buscadorInventario'
);

// ========================================
// EVENTOS
// ========================================

if(excelFile){

  excelFile.addEventListener(

    'change',

    leerExcel

  );

}

if(reiniciarInventarioBtn){

  reiniciarInventarioBtn.addEventListener(

    'click',

    reiniciarInventario

  );

}

if(buscarBtn){

  buscarBtn.addEventListener(

    'click',

    buscarProducto

  );

}

if(guardarConteoBtn){

  guardarConteoBtn.addEventListener(

    'click',

    registrarConteo

  );

}

if(exportarExcelBtn){

  exportarExcelBtn.addEventListener(

    'click',

    exportarExcel

  );

}

if(buscadorInventario){

  buscadorInventario.addEventListener(

    'input',

    filtrarInventario

  );

}

// ========================================
// LEER EXCEL
// ========================================

function leerExcel(e){

  try{

    // ========================================
    // VALIDAR PERMISOS
    // ========================================

    if(

      !window.tienePermiso(
        'inventario',
        'crear'
      )

    ){

      alert(
        'No tiene permisos'
      );

      return;

    }

    // ========================================
    // ARCHIVO
    // ========================================

    const file =
    e.target.files[0];

    if(!file){

      return;

    }

    // ========================================
    // LEER ARCHIVO
    // ========================================

    const reader =
    new FileReader();

    reader.onload = function(event){

      try{

        const data =

        new Uint8Array(
          event.target.result
        );

        const workbook =

        XLSX.read(

          data,

          {
            type:'array'
          }

        );

        const hoja =

        workbook.Sheets[
          workbook.SheetNames[0]
        ];

        // ========================================
        // INVENTARIO
        // ========================================

        window.inventario =

        XLSX.utils.sheet_to_json(
          hoja
        );

        // ========================================
        // GUARDAR
        // ========================================

        localStorage.setItem(

          'inventario',

          JSON.stringify(
            window.inventario
          )

        );

        // ========================================
        // ACTUALIZAR
        // ========================================

        renderInventario();

        actualizarKPIs();

        alert(
          'Excel cargado correctamente'
        );

      }

      catch(error){

        console.log(error);

        alert(
          'Error leyendo Excel'
        );

      }

    };

    reader.readAsArrayBuffer(file);

  }

  catch(error){

    console.log(error);

  }

}

// ========================================
// RENDER INVENTARIO
// ========================================

window.renderInventario = function(datos){

  const inventarioData =
  datos || window.inventario;

  const body =
  document.getElementById(
    'inventarioBody'
  );

  if(!body){

    return;

  }

  body.innerHTML = '';

  // ========================================
  // SIN DATOS
  // ========================================

  if(inventarioData.length === 0){

    body.innerHTML = `

      <tr>

        <td colspan="5">

          No hay inventario cargado

        </td>

      </tr>

    `;

    return;

  }

  // ========================================
  // HTML
  // ========================================

  let html = '';

  inventarioData.forEach(function(item){

    html += `

      <tr>

        <td>
          ${item.codigo || '-'}
        </td>

        <td>
          ${item.producto || '-'}
        </td>

        <td>
          ${item.ubicacion || '-'}
        </td>

        <td>
          ${item.stock || 0}
        </td>

        <td>

          ${

            window.tienePermiso(
              'inventario',
              'eliminar'
            )

            ?

            `

            <button
              class="btn-eliminar"
              onclick="eliminarProducto('${item.codigo}')"
            >

              Eliminar

            </button>

            `

            :

            '-'

          }

        </td>

      </tr>

    `;

  });

  body.innerHTML = html;

};

// ========================================
// ELIMINAR PRODUCTO
// ========================================

window.eliminarProducto = function(codigo){

  try{

    // ========================================
    // VALIDAR PERMISOS
    // ========================================

    if(

      !window.tienePermiso(
        'inventario',
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
      '¿Eliminar producto?'
    );

    if(!confirmar){

      return;

    }

    // ========================================
    // FILTRAR
    // ========================================

    window.inventario =

    window.inventario.filter(

      function(item){

        return item.codigo != codigo;

      }

    );

    // ========================================
    // GUARDAR
    // ========================================

    localStorage.setItem(

      'inventario',

      JSON.stringify(
        window.inventario
      )

    );

    // ========================================
    // ACTUALIZAR
    // ========================================

    renderInventario();

    actualizarKPIs();

    alert(
      'Producto eliminado'
    );

  }

  catch(error){

    console.log(error);

  }

};

// ========================================
// BUSCAR PRODUCTO
// ========================================

function buscarProducto(){

  try{

    // ========================================
    // VALIDAR PERMISO
    // ========================================

    if(

      !window.tienePermiso(
        'inventario',
        'ver'
      )

    ){

      alert(
        'No tiene permisos'
      );

      return;

    }

    const codigo =

    document.getElementById(
      'codigoInput'
    ).value.trim();

    // ========================================
    // BUSCAR
    // ========================================

    window.productoActual =

    window.inventario.find(

      function(item){

        return String(
          item.codigo
        ) === codigo;

      }

    );

    // ========================================
    // NO EXISTE
    // ========================================

    if(!window.productoActual){

      alert(
        'Producto no encontrado'
      );

      return;

    }

    // ========================================
    // MOSTRAR
    // ========================================

    actualizarTexto(
      'codigoProducto',
      window.productoActual.codigo
    );

    actualizarTexto(
      'nombreProducto',
      window.productoActual.producto
    );

    actualizarTexto(
      'ubicacionProducto',
      window.productoActual.ubicacion
    );

    actualizarTexto(
      'stockProducto',
      window.productoActual.stock
    );

  }

  catch(error){

    console.log(error);

  }

}

// ========================================
// REGISTRAR CONTEO
// ========================================

function registrarConteo(){

  try{

    // ========================================
    // VALIDAR PERMISO
    // ========================================

    if(

      !window.tienePermiso(
        'inventario',
        'editar'
      )

    ){

      alert(
        'No tiene permisos'
      );

      return;

    }

    // ========================================
    // VALIDAR PRODUCTO
    // ========================================

    if(!window.productoActual){

      alert(
        'Busque un producto'
      );

      return;

    }

    // ========================================
    // VALORES
    // ========================================

    const fisico = Number(

      document.getElementById(
        'conteoFisico'
      ).value

    );

    const sistema = Number(
      window.productoActual.stock
    );

    const diferencia =
    fisico - sistema;

    // ========================================
    // RESULTADO
    // ========================================

    actualizarTexto(
      'resultadoTexto',
      diferencia
    );

    // ========================================
    // HISTORIAL
    // ========================================

    let historial =

    JSON.parse(

      localStorage.getItem(
        'historial'
      )

    ) || [];

    const index =

    historial.findIndex(

      function(item){

        return item.codigo ==
        window.productoActual.codigo;

      }

    );

    const nuevoRegistro = {

      codigo:
      window.productoActual.codigo,

      producto:
      window.productoActual.producto,

      sistema:
      sistema,

      fisico:
      fisico,

      diferencia:
      diferencia

    };

    // ========================================
    // ACTUALIZAR O CREAR
    // ========================================

    if(index !== -1){

      historial[index] =
      nuevoRegistro;

    }

    else{

      historial.push(
        nuevoRegistro
      );

    }

    // ========================================
    // GUARDAR
    // ========================================

    localStorage.setItem(

      'historial',

      JSON.stringify(
        historial
      )

    );

    // ========================================
    // ACTUALIZAR
    // ========================================

    renderHistorial();

    actualizarKPIs();

    alert(
      'Conteo guardado'
    );

  }

  catch(error){

    console.log(error);

  }

}

// ========================================
// RENDER HISTORIAL
// ========================================

window.renderHistorial = function(filtro){

  let historial =

  JSON.parse(

    localStorage.getItem(
      'historial'
    )

  ) || [];

  // ========================================
  // FILTROS
  // ========================================

  if(filtro === 'exactos'){

    historial = historial.filter(

      function(item){

        return item.diferencia === 0;

      }

    );

  }

  if(filtro === 'faltantes'){

    historial = historial.filter(

      function(item){

        return item.diferencia < 0;

      }

    );

  }

  if(filtro === 'sobrantes'){

    historial = historial.filter(

      function(item){

        return item.diferencia > 0;

      }

    );

  }

  const body =
  document.getElementById(
    'historialBody'
  );

  if(!body){

    return;

  }

  body.innerHTML = '';

  // ========================================
  // SIN DATOS
  // ========================================

  if(historial.length === 0){

    body.innerHTML = `

      <tr>

        <td colspan="6">

          No hay conteos registrados

        </td>

      </tr>

    `;

    return;

  }

  // ========================================
  // HTML
  // ========================================

  let html = '';

  historial.forEach(function(item){

    html += `

      <tr>

        <td>
          ${item.codigo}
        </td>

        <td>
          ${item.producto}
        </td>

        <td>
          ${item.sistema}
        </td>

        <td>
          ${item.fisico}
        </td>

        <td>
          ${item.diferencia}
        </td>

        <td>

          ${

            window.tienePermiso(
              'inventario',
              'eliminar'
            )

            ?

            `

            <button
              class="btn-eliminar"
              onclick="eliminarRegistro('${item.codigo}')"
            >

              Eliminar

            </button>

            `

            :

            '-'

          }

        </td>

      </tr>

    `;

  });

  body.innerHTML = html;

};

// ========================================
// ELIMINAR REGISTRO
// ========================================

window.eliminarRegistro = function(codigo){

  try{

    if(

      !window.tienePermiso(
        'inventario',
        'eliminar'
      )

    ){

      alert(
        'No tiene permisos'
      );

      return;

    }

    let historial =

    JSON.parse(

      localStorage.getItem(
        'historial'
      )

    ) || [];

    historial = historial.filter(

      function(item){

        return item.codigo != codigo;

      }

    );

    localStorage.setItem(

      'historial',

      JSON.stringify(
        historial
      )

    );

    renderHistorial();

    actualizarKPIs();

  }

  catch(error){

    console.log(error);

  }

};

// ========================================
// FILTRAR HISTORIAL
// ========================================

window.filtrarHistorial = function(tipo){

  renderHistorial(tipo);

};

// ========================================
// KPIS
// ========================================

window.actualizarKPIs = function(){

  try{

    const historial =

    JSON.parse(

      localStorage.getItem(
        'historial'
      )

    ) || [];

    const totalConteos =
    historial.length;

    let exactos = 0;
    let faltantes = 0;
    let sobrantes = 0;
    let sumaExactitud = 0;

    historial.forEach(function(item){

      const sistema =
      Number(item.sistema);

      const fisico =
      Number(item.fisico);

      if(fisico === sistema){

        exactos++;

      }

      if(fisico < sistema){

        faltantes++;

      }

      if(fisico > sistema){

        sobrantes++;

      }

      const mayor = Math.max(
        sistema,
        fisico
      );

      const menor = Math.min(
        sistema,
        fisico
      );

      let exactitudItem = 0;

      if(mayor > 0){

        exactitudItem =

        (menor / mayor) * 100;

      }

      sumaExactitud +=
      exactitudItem;

    });

    let exactitudGeneral = 0;

    if(totalConteos > 0){

      exactitudGeneral =

      (
        sumaExactitud /
        totalConteos
      ).toFixed(1);

    }

    actualizarTexto(
      'kpiTotal',
      totalConteos
    );

    actualizarTexto(
      'kpiExactos',
      exactos
    );

    actualizarTexto(
      'kpiFaltantes',
      faltantes
    );

    actualizarTexto(
      'kpiSobrantes',
      sobrantes
    );

    actualizarTexto(
      'kpiExactitud',
      exactitudGeneral + '%'
    );

  }

  catch(error){

    console.log(error);

  }

};

// ========================================
// FILTRAR INVENTARIO
// ========================================

function filtrarInventario(){

  try{

    const texto =

    buscadorInventario.value
    .toLowerCase();

    const filtrados =

    window.inventario.filter(

      function(item){

        return(

          String(
            item.codigo || ''
          )

          .toLowerCase()

          .includes(texto)

          ||

          String(
            item.producto || ''
          )

          .toLowerCase()

          .includes(texto)

        );

      }

    );

    renderInventario(
      filtrados
    );

  }

  catch(error){

    console.log(error);

  }

}

// ========================================
// EXPORTAR EXCEL
// ========================================

function exportarExcel(){

  try{

    if(

      !window.tienePermiso(
        'inventario',
        'ver'
      )

    ){

      alert(
        'No tiene permisos'
      );

      return;

    }

    const historial =

    JSON.parse(

      localStorage.getItem(
        'historial'
      )

    ) || [];

    if(historial.length === 0){

      alert(
        'No hay datos'
      );

      return;

    }

    const worksheet =

    XLSX.utils.json_to_sheet(
      historial
    );

    const workbook =

    XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      'Conteos'

    );

    XLSX.writeFile(

      workbook,

      'inventario.xlsx'

    );

  }

  catch(error){

    console.log(error);

  }

}

// ========================================
// REINICIAR INVENTARIO
// ========================================

function reiniciarInventario(){

  try{

    if(

      !window.tienePermiso(
        'inventario',
        'eliminar'
      )

    ){

      alert(
        'No tiene permisos'
      );

      return;

    }

    const confirmar = confirm(
      '¿Eliminar inventario e historial?'
    );

    if(!confirmar){

      return;

    }

    localStorage.removeItem(
      'inventario'
    );

    localStorage.removeItem(
      'historial'
    );

    window.inventario = [];

    renderInventario();

    renderHistorial();

    actualizarKPIs();

    actualizarTexto(
      'resultadoTexto',
      '-'
    );

    alert(
      'Inventario reiniciado'
    );

  }

  catch(error){

    console.log(error);

  }

}

// ========================================
// HELPERS
// ========================================

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

// ========================================
// PERMISOS UI
// ========================================

function aplicarPermisosInventario(){

  // ========================================
  // CREAR
  // ========================================

  if(

    !window.tienePermiso(
      'inventario',
      'crear'
    )

  ){

    if(excelFile){

      excelFile.style.display =
      'none';

    }

  }

  // ========================================
  // EDITAR
  // ========================================

  if(

    !window.tienePermiso(
      'inventario',
      'editar'
    )

  ){

    if(guardarConteoBtn){

      guardarConteoBtn.style.display =
      'none';

    }

  }

  // ========================================
  // ELIMINAR
  // ========================================

  if(

    !window.tienePermiso(
      'inventario',
      'eliminar'
    )

  ){

    if(reiniciarInventarioBtn){

      reiniciarInventarioBtn.style.display =
      'none';

    }

  }

}

// ========================================
// INICIO
// ========================================

aplicarPermisosInventario();

renderInventario();

renderHistorial();

actualizarKPIs();

  }

window.abrirSiesa = function(){

  window.open(

    'https://siesaerp05.siesacloud.com/~~App12/',

    '_blank'

  );

};

// ========================================
// REFRESH INVENTARIO
// ========================================

if(window.refreshInventarioInterval){

  clearInterval(
    window.refreshInventarioInterval
  );

}

window.iniciarRefreshInventario = function(){

  window.refreshInventarioInterval =

  setInterval(function(){

    try{

      renderInventario();

      renderHistorial();

      actualizarKPIs();

    }

    catch(error){

      console.log(error);

    }

  },2000);

};

window.iniciarRefreshInventario();

renderNovedades();

setInterval(function(){

  renderNovedades();

},5000);
// =====================================
// MODAL NOVEDADES INVENTARIO
// =====================================

window.abrirModalNovedad = function(){

  const modal =
  document.getElementById(
    'modalNovedadInventario'
  );

  if(modal){

    modal.classList.add(
      'active'
    );

  }

};

window.cerrarModalNovedad = function(){

  const modal =
  document.getElementById(
    'modalNovedadInventario'
  );

  if(modal){

    modal.classList.remove(
      'active'
    );

  }

};

// =====================================
// GUARDAR NOVEDAD INVENTARIO
// =====================================

const guardarNovedadBtn =
document.getElementById(
  'guardarNovedadBtn'
);

if(guardarNovedadBtn){

  guardarNovedadBtn.onclick =
  async function(){

    try{

      const codigo =
      document.getElementById(
        'novedadCodigo'
      ).value.trim();

      const material =
      document.getElementById(
        'novedadMaterial'
      ).value.trim();

      const stockSistema =
      document.getElementById(
        'novedadSistema'
      ).value;

      const conteoFisico =
      document.getElementById(
        'novedadFisico'
      ).value;

      const tipo =
      document.getElementById(
        'novedadTipo'
      ).value;

      const observacion =
      document.getElementById(
        'novedadObservacion'
      ).value.trim();

      if(

        !codigo ||
        !material ||
        !observacion

      ){

        alert(
          '⚠️ Complete todos los campos obligatorios'
        );

        return;

      }

      const usuarioLogueado =

      JSON.parse(

        localStorage.getItem(
          'usuarioLogueado'
        )

      );

      const response =

      await window.supabaseClient

      .from(
        'novedades_inventario'
      )

      .insert([{

        codigo:
        codigo,

        material:
        material,

        stock_sistema:
        Number(stockSistema),

        conteo_fisico:
        Number(conteoFisico),

        tipo_novedad:
        tipo,

        observacion:
        observacion,

        usuario:
        usuarioLogueado?.usuario || 'Sistema'

      }]);

      if(response.error){

        console.log(
          response.error
        );

        alert(
          'Error guardando novedad'
        );

        return;

      }

      alert(
        '✅ Novedad registrada correctamente'
      );

      cerrarModalNovedad();

      document.getElementById(
        'novedadCodigo'
      ).value = '';

      document.getElementById(
        'novedadMaterial'
      ).value = '';

      document.getElementById(
        'novedadSistema'
      ).value = '';

      document.getElementById(
        'novedadFisico'
      ).value = '';

      document.getElementById(
        'novedadObservacion'
      ).value = '';

    }

    catch(error){

      console.log(error);

      alert(
        'Error general'
      );

    }

  };

}


// =====================================
// RENDER NOVEDADES INVENTARIO
// =====================================

window.renderNovedades = async function(){

  try{

    const body =
    document.getElementById(
      'novedadesBody'
    );

    if(!body){

      return;

    }

    const response =

    await window.supabaseClient

    .from('novedades_inventario')

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

    if(data.length === 0){

      body.innerHTML =

      '<tr>' +

      '<td colspan="8">' +

      'No hay novedades registradas' +

      '</td>' +

      '</tr>';

      return;

    }

    data.forEach(function(item){

      body.innerHTML +=

      '<tr>' +

      '<td>' +
      new Date(
        item.created_at
      ).toLocaleString('es-CO') +
      '</td>' +

      '<td>' +
      item.codigo +
      '</td>' +

      '<td>' +
      item.material +
      '</td>' +

      '<td>' +
      item.tipo_novedad +
      '</td>' +

      '<td>' +
      item.stock_sistema +
      '</td>' +

      '<td>' +
      item.conteo_fisico +
      '</td>' +

      '<td>' +
      item.usuario +
      '</td>' +

      '<td>' +

      '<button class="btn-eliminar" onclick="eliminarNovedad(' +
      item.id +
      ')">' +

      'Eliminar' +

      '</button>' +

      '</td>' +

      '</tr>';

    });

  }

  catch(error){

    console.log(error);

  }

};

// =====================================
// ELIMINAR NOVEDAD
// =====================================

window.eliminarNovedad = async function(id){

  try{

    const confirmar = confirm(
      '¿Eliminar novedad?'
    );

    if(!confirmar){

      return;

    }

    await window.supabaseClient

    .from('novedades_inventario')

    .delete()

    .eq(
      'id',
      Number(id)
    );

    renderNovedades();

  }

  catch(error){

    console.log(error);

  }

};
