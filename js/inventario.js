
// ======================
// VARIABLES GLOBALES
// ======================

let inventario =

JSON.parse(

  localStorage.getItem(
    'inventario'
  )

) || [];



let productoActual = null;





// ======================
// ELEMENTOS
// ======================

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





// ======================
// EVENTOS
// ======================

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





// ======================
// LEER EXCEL
// ======================

function leerExcel(e){

  const file =
  e.target.files[0];



  if(!file){

    return;

  }



  const reader =
  new FileReader();



  reader.onload = function(event){

    const data =
    new Uint8Array(
      event.target.result
    );



    const workbook =
    XLSX.read(

      data,

      { type:'array' }

    );



    const hoja =

    workbook.Sheets[
      workbook.SheetNames[0]
    ];



    inventario =

    XLSX.utils.sheet_to_json(
      hoja
    );



    localStorage.setItem(

      'inventario',

      JSON.stringify(
        inventario
      )

    );



    alert(
      'Excel cargado correctamente'
    );



    renderInventario();

  };



  reader.readAsArrayBuffer(file);

}





// ======================
// BUSCAR PRODUCTO
// ======================

function buscarProducto(){

  const codigoInput =
  document.getElementById(
    'codigoInput'
  );



  if(!codigoInput){

    return;

  }



  const codigo =
  codigoInput.value;



  productoActual = inventario.find(

    p => p.codigo == codigo

  );



  if(!productoActual){

    alert(
      'Producto no encontrado'
    );

    return;

  }



  actualizarTexto(
    'codigoProducto',
    productoActual.codigo
  );



  actualizarTexto(
    'nombreProducto',
    productoActual.producto
  );



  actualizarTexto(
    'ubicacionProducto',
    productoActual.ubicacion
  );



  actualizarTexto(
    'stockProducto',
    productoActual.stock
  );

}





// ======================
// REGISTRAR CONTEO
// ======================

function registrarConteo(){

  if(!productoActual){

    alert(
      'Busque un producto'
    );

    return;

  }



  const conteoFisico =
  document.getElementById(
    'conteoFisico'
  );



  if(!conteoFisico){

    return;

  }



  const fisico = Number(
    conteoFisico.value
  );



  const stockSistema = Number(
    productoActual.stock
  );



  if(

    isNaN(fisico)

    ||

    isNaN(stockSistema)

  ){

    alert(
      'Valores inválidos'
    );

    return;

  }



  const diferencia =
  fisico - stockSistema;



  const resultado =
  document.getElementById(
    'resultadoTexto'
  );



  if(resultado){

    resultado.innerText =
    diferencia;

    resultado.className =
    '';



    if(diferencia < 0){

      resultado.classList.add(
        'negativo'
      );

    }

    else if(diferencia > 0){

      resultado.classList.add(
        'positivo'
      );

    }

    else{

      resultado.classList.add(
        'exacto'
      );

    }

  }



  guardarHistorial(

    fisico,
    diferencia

  );



  limpiarFormulario();

}





// ======================
// GUARDAR HISTORIAL
// ======================

function guardarHistorial(

  fisico,
  diferencia

){

  let historial =

  JSON.parse(

    localStorage.getItem(
      'historial'
    )

  ) || [];



  const index =
  historial.findIndex(

    item =>

    item.codigo ==
    productoActual.codigo

  );



  const nuevoRegistro = {

    codigo:
    productoActual.codigo,

    producto:
    productoActual.producto,

    sistema:
    productoActual.stock,

    fisico,

    diferencia

  };



  if(index !== -1){

    historial[index] =
    nuevoRegistro;

  }

  else{

    historial.push(
      nuevoRegistro
    );

  }



  localStorage.setItem(

    'historial',

    JSON.stringify(
      historial
    )

  );



  renderHistorial();

  actualizarKPIs();

}





// ======================
// FILTRAR HISTORIAL
// ======================

function filtrarHistorial(tipo){

  renderHistorial(tipo);

}





// ======================
// RENDER HISTORIAL
// ======================

function renderHistorial(

  filtro = 'todos'

){

  let historial =

  JSON.parse(

    localStorage.getItem(
      'historial'
    )

  ) || [];



  if(filtro === 'exactos'){

    historial = historial.filter(

      item =>

      Number(item.diferencia) === 0

    );

  }



  else if(filtro === 'faltantes'){

    historial = historial.filter(

      item =>

      Number(item.diferencia) < 0

    );

  }



  else if(filtro === 'sobrantes'){

    historial = historial.filter(

      item =>

      Number(item.diferencia) > 0

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



  historial.forEach(item => {

    body.innerHTML += `

      <tr>

        <td>${item.codigo}</td>

        <td>${item.producto}</td>

        <td>${item.sistema}</td>

        <td>${item.fisico}</td>

        <td>${item.diferencia}</td>

        <td>

          <div class="acciones-tabla">

            <button
              class="btn-eliminar"
              onclick="eliminarRegistro('${item.codigo}')"
            >

              Eliminar

            </button>

          </div>

        </td>

      </tr>

    `;

  });

}





// ======================
// RENDER INVENTARIO
// ======================

function renderInventario(

  datos = inventario

){

  const body =
  document.getElementById(
    'inventarioBody'
  );



  if(!body){

    return;

  }



  body.innerHTML = '';



  const totalProductos =
  document.getElementById(
    'totalProductos'
  );



  if(totalProductos){

    totalProductos.innerText =

    `Productos cargados: ${datos.length}`;

  }



  datos.forEach(item => {

    body.innerHTML += `

      <tr>

        <td>${item.codigo || '-'}</td>

        <td>${item.producto || '-'}</td>

        <td>${item.ubicacion || '-'}</td>

        <td>${item.stock || 0}</td>

      </tr>

    `;

  });

}





// ======================
// FILTRAR INVENTARIO
// ======================

function filtrarInventario(){

  const buscador =
  document.getElementById(
    'buscadorInventario'
  );



  if(!buscador){

    return;

  }



  const texto =
  buscador.value.toLowerCase();



  const filtrados =

  inventario.filter(item => {

    return(

      String(item.codigo || '')
      .toLowerCase()
      .includes(texto)

      ||

      String(item.producto || '')
      .toLowerCase()
      .includes(texto)

      ||

      String(item.ubicacion || '')
      .toLowerCase()
      .includes(texto)

    );

  });



  renderInventario(
    filtrados
  );

}





// ======================
// ELIMINAR REGISTRO
// ======================

function eliminarRegistro(codigo){

  let historial =

  JSON.parse(

    localStorage.getItem(
      'historial'
    )

  ) || [];



  historial = historial.filter(

    item =>

    item.codigo != codigo

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





// ======================
// EXPORTAR EXCEL
// ======================

function exportarExcel(){

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

    'inventario_conteos.xlsx'

  );

}





// ======================
// LIMPIAR FORMULARIO
// ======================

function limpiarFormulario(){

  limpiarInput(
    'codigoInput'
  );



  limpiarInput(
    'conteoFisico'
  );



  actualizarTexto(
    'codigoProducto',
    '-'
  );



  actualizarTexto(
    'nombreProducto',
    '-'
  );



  actualizarTexto(
    'ubicacionProducto',
    '-'
  );



  actualizarTexto(
    'stockProducto',
    '-'
  );



  const resultado =
  document.getElementById(
    'resultadoTexto'
  );



  if(resultado){

    resultado.innerText = '-';

    resultado.className = '';

  }



  productoActual = null;

}





// ======================
// KPIs
// ======================

function actualizarKPIs(){

  const historial =

  JSON.parse(

    localStorage.getItem(
      'historial'
    )

  ) || [];



  const total =
  historial.length;



  const exactos =
  historial.filter(

    item =>

    Number(item.diferencia) === 0

  ).length;



  const faltantes =
  historial.filter(

    item =>

    Number(item.diferencia) < 0

  ).length;



  const sobrantes =
  historial.filter(

    item =>

    Number(item.diferencia) > 0

  ).length;



  let exactitud = 0;



  if(total > 0){

    exactitud =

    (

      (exactos / total) * 100

    ).toFixed(1);

  }



  actualizarTexto(
    'kpiTotal',
    total
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
    `${exactitud}%`
  );

}





// ======================
// REINICIAR INVENTARIO
// ======================

function reiniciarInventario(){

  const confirmar = confirm(

    '¿Desea eliminar el inventario cargado?'

  );



  if(!confirmar){

    return;

  }



  inventario = [];



  localStorage.removeItem(
    'inventario'
  );



  renderInventario();



  alert(
    'Inventario reiniciado'
  );

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





function limpiarInput(id){

  const input =
  document.getElementById(id);



  if(input){

    input.value = '';

  }

}





// ======================
// INICIO
// ======================

setTimeout(function(){

  renderInventario();

  renderHistorial();

  actualizarKPIs();

}, 100);

