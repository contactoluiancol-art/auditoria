// ======================
// VARIABLES GLOBALES
// ======================

let inventario = JSON.parse(
  localStorage.getItem('inventario')
) || [];

let productoActual = null;


// ======================
// EVENTOS
// ======================

document.getElementById('excelFile')
.addEventListener('change', leerExcel);

document.getElementById('reiniciarInventario')
.addEventListener(
  'click',
  reiniciarInventario
);

document.getElementById('buscarBtn')
.addEventListener(
  'click',
  buscarProducto
);

document.getElementById('guardarConteo')
.addEventListener(
  'click',
  registrarConteo
);

document.getElementById('exportarExcel')
.addEventListener(
  'click',
  exportarExcel
);

document.getElementById('buscadorInventario')
.addEventListener(
  'input',
  filtrarInventario
);


// ======================
// LEER EXCEL
// ======================

function leerExcel(e){

  const file = e.target.files[0];

  const reader = new FileReader();

  reader.onload = function(event){

    const data = new Uint8Array(
      event.target.result
    );

    const workbook = XLSX.read(
      data,
      {type:'array'}
    );

    const hoja =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

    inventario =
    XLSX.utils.sheet_to_json(hoja);


    // GUARDAR INVENTARIO

    localStorage.setItem(
      'inventario',
      JSON.stringify(inventario)
    );


    alert('Excel cargado correctamente');

    renderInventario();

  };


  reader.readAsArrayBuffer(file);

}


// ======================
// BUSCAR PRODUCTO
// ======================

function buscarProducto(){

  const codigo = document
  .getElementById('codigoInput')
  .value;

  productoActual = inventario.find(
    p => p.codigo == codigo
  );


  if(!productoActual){

    alert('Producto no encontrado');

    return;

  }


  document.getElementById('codigoProducto')
  .innerText = productoActual.codigo;

  document.getElementById('nombreProducto')
  .innerText = productoActual.producto;

  document.getElementById('ubicacionProducto')
  .innerText = productoActual.ubicacion;

  document.getElementById('stockProducto')
  .innerText = productoActual.stock;

}


// ======================
// REGISTRAR CONTEO
// ======================

function registrarConteo(){

  if(!productoActual){

    alert('Busque un producto');

    return;

  }


  const fisico = Number(
    document.getElementById('conteoFisico')
    .value
  );

  const stockSistema = Number(
    productoActual.stock
  );


  // VALIDAR

  if(isNaN(fisico) || isNaN(stockSistema)){

    alert('Valores inválidos');

    return;

  }


  const diferencia =
  fisico - stockSistema;


  const resultado =
  document.getElementById('resultadoTexto');

  resultado.innerText = diferencia;

  resultado.className = '';


  // COLORES

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

  const historial = JSON.parse(
    localStorage.getItem('historial')
  ) || [];


  const index = historial.findIndex(
    item =>
    item.codigo == productoActual.codigo
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


  // ACTUALIZAR

  if(index !== -1){

    historial[index] =
    nuevoRegistro;

  }

  // CREAR

  else{

    historial.push(
      nuevoRegistro
    );

  }


  localStorage.setItem(
    'historial',
    JSON.stringify(historial)
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

  let historial = JSON.parse(
    localStorage.getItem('historial')
  ) || [];


  // FILTROS

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

          <button
            onclick="eliminarRegistro('${item.codigo}')"
          >
            Eliminar
          </button>

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

  body.innerHTML = '';

  document.getElementById(
  'totalProductos'
).innerText =

`Productos cargados: ${datos.length}`;


  datos.forEach(item => {

    body.innerHTML += `

      <tr>

        <td>${item.codigo}</td>

        <td>${item.producto}</td>

        <td>${item.ubicacion}</td>

        <td>${item.stock}</td>

      </tr>

    `;

  });

}


// ======================
// FILTRAR INVENTARIO
// ======================

function filtrarInventario(){

  const texto = document
  .getElementById(
    'buscadorInventario'
  )
  .value
  .toLowerCase();


  const filtrados =
  inventario.filter(item => {

    return(

      String(item.codigo)
      .toLowerCase()
      .includes(texto)

      ||

      String(item.producto)
      .toLowerCase()
      .includes(texto)

      ||

      String(item.ubicacion)
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

  let historial = JSON.parse(
    localStorage.getItem('historial')
  ) || [];


  historial = historial.filter(
    item =>
    item.codigo != codigo
  );


  localStorage.setItem(
    'historial',
    JSON.stringify(historial)
  );


  renderHistorial();

  actualizarKPIs();

}


// ======================
// EXPORTAR EXCEL
// ======================

function exportarExcel(){

  const historial = JSON.parse(
    localStorage.getItem('historial')
  ) || [];


  if(historial.length === 0){

    alert('No hay datos');

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

  document.getElementById(
    'codigoInput'
  ).value = '';

  document.getElementById(
    'conteoFisico'
  ).value = '';


  document.getElementById(
    'codigoProducto'
  ).innerText = '-';

  document.getElementById(
    'nombreProducto'
  ).innerText = '-';

  document.getElementById(
    'ubicacionProducto'
  ).innerText = '-';

  document.getElementById(
    'stockProducto'
  ).innerText = '-';


  const resultado =
  document.getElementById(
    'resultadoTexto'
  );

  resultado.innerText = '-';

  resultado.className = '';


  productoActual = null;


  document.getElementById(
    'codigoInput'
  ).focus();

}


// ======================
// KPIs
// ======================

function actualizarKPIs(){

  const historial = JSON.parse(
    localStorage.getItem('historial')
  ) || [];


  // TOTAL

  const total =
  historial.length;


  // EXACTOS

  const exactos =
  historial.filter(
    item =>
    Number(item.diferencia) === 0
  ).length;


  // FALTANTES

  const faltantes =
  historial.filter(
    item =>
    Number(item.diferencia) < 0
  ).length;


  // SOBRANTES

  const sobrantes =
  historial.filter(
    item =>
    Number(item.diferencia) > 0
  ).length;


  // EXACTITUD

  let exactitud = 0;


  if(total > 0){

    exactitud =
    (
      (exactos / total) * 100
    ).toFixed(1);

  }


  // ACTUALIZAR HTML

  document.getElementById(
    'kpiTotal'
  ).innerText = total;

  document.getElementById(
    'kpiExactos'
  ).innerText = exactos;

  document.getElementById(
    'kpiFaltantes'
  ).innerText = faltantes;

  document.getElementById(
    'kpiSobrantes'
  ).innerText = sobrantes;

  document.getElementById(
    'kpiExactitud'
  ).innerText = `${exactitud}%`;

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


  // LIMPIAR ARRAY

  inventario = [];


  // BORRAR STORAGE

  localStorage.removeItem(
    'inventario'
  );


  // LIMPIAR TABLA

  renderInventario();


  alert(
    'Inventario reiniciado'
  );

}


// ======================
// INICIO
// ======================

setTimeout(() => {

  renderInventario();

  renderHistorial();

  actualizarKPIs();

}, 100);