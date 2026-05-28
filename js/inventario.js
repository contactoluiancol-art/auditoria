
// ======================
// EVITAR DUPLICAR SCRIPT
// ======================

if(typeof window.inventarioCargado === 'undefined'){

window.inventarioCargado = true;





// ======================
// VARIABLES GLOBALES
// ======================

window.inventario =

JSON.parse(

  localStorage.getItem(
    'inventario'
  )

) || [];



window.productoActual = null;





// ======================
// ELEMENTOS
// ======================

var excelFile =
document.getElementById(
  'excelFile'
);

var reiniciarInventarioBtn =
document.getElementById(
  'reiniciarInventario'
);

var buscarBtn =
document.getElementById(
  'buscarBtn'
);

var guardarConteoBtn =
document.getElementById(
  'guardarConteo'
);

var exportarExcelBtn =
document.getElementById(
  'exportarExcel'
);

var buscadorInventario =
document.getElementById(
  'buscadorInventario'
);





// ======================
// EVENTOS
// ======================

if(excelFile){

  excelFile.onchange =
  leerExcel;

}



if(reiniciarInventarioBtn){

  reiniciarInventarioBtn.onclick =
  reiniciarInventario;

}



if(buscarBtn){

  buscarBtn.onclick =
  buscarProducto;

}



if(guardarConteoBtn){

  guardarConteoBtn.onclick =
  registrarConteo;

}



if(exportarExcelBtn){

  exportarExcelBtn.onclick =
  exportarExcel;

}



if(buscadorInventario){

  buscadorInventario.oninput =
  filtrarInventario;

}





// ======================
// LEER EXCEL
// ======================

function leerExcel(e){

  var file =
  e.target.files[0];



  if(!file){

    return;

  }



  var reader =
  new FileReader();



  reader.onload = function(event){

    var data =

    new Uint8Array(
      event.target.result
    );



    var workbook =

    XLSX.read(

      data,

      {

        type:'array'

      }

    );



    var hoja =

    workbook.Sheets[
      workbook.SheetNames[0]
    ];



    window.inventario =

    XLSX.utils.sheet_to_json(
      hoja
    );



    localStorage.setItem(

      'inventario',

      JSON.stringify(
        window.inventario
      )

    );



    renderInventario();



    actualizarKPIs();



    alert(
      'Excel cargado correctamente'
    );

  };



  reader.readAsArrayBuffer(file);

}





// ======================
// RENDER INVENTARIO
// ======================

window.renderInventario = function(datos){

  if(!datos){

    datos = window.inventario;

  }



  var body =
  document.getElementById(
    'inventarioBody'
  );



  if(!body){

    return;

  }



  body.innerHTML = '';



  if(!datos || datos.length === 0){

    body.innerHTML =

    '<tr>' +

      '<td colspan="4">' +

      'No hay inventario cargado' +

      '</td>' +

    '</tr>';



    return;

  }



  datos.forEach(function(item){

    body.innerHTML +=

    '<tr>' +

      '<td>' +

      (item.codigo || '-') +

      '</td>' +



      '<td>' +

      (item.producto || '-') +

      '</td>' +



      '<td>' +

      (item.ubicacion || '-') +

      '</td>' +



      '<td>' +

      (item.stock || 0) +

      '</td>' +

    '</tr>';

  });

};





// ======================
// BUSCAR PRODUCTO
// ======================

function buscarProducto(){

  var codigo =
  document.getElementById(
    'codigoInput'
  ).value.trim();



  window.productoActual =

  window.inventario.find(

    function(p){

      return String(
        p.codigo
      ) === codigo;

    }

  );



  if(!window.productoActual){

    alert(
      'Producto no encontrado'
    );

    return;

  }



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





// ======================
// REGISTRAR CONTEO
// ======================

function registrarConteo(){

  if(!window.productoActual){

    alert(
      'Busque un producto'
    );

    return;

  }



  var fisico = Number(

    document.getElementById(
      'conteoFisico'
    ).value

  );



  var sistema = Number(
    window.productoActual.stock
  );



  var diferencia =
  fisico - sistema;



  // RESULTADO

  actualizarTexto(
    'resultadoTexto',
    diferencia
  );



  // HISTORIAL

  var historial =

  JSON.parse(

    localStorage.getItem(
      'historial'
    )

  ) || [];



  historial.push({

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

  });



  localStorage.setItem(

    'historial',

    JSON.stringify(
      historial
    )

  );



  renderHistorial();

  actualizarKPIs();



  alert(
    'Conteo guardado'
  );

}





// ======================
// RENDER HISTORIAL
// ======================

window.renderHistorial = function(filtro){

  var historial =

  JSON.parse(

    localStorage.getItem(
      'historial'
    )

  ) || [];



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



  var body =
  document.getElementById(
    'historialBody'
  );



  if(!body){

    return;

  }



  body.innerHTML = '';



  historial.forEach(function(item){

    body.innerHTML +=

    '<tr>' +

      '<td>' + item.codigo + '</td>' +

      '<td>' + item.producto + '</td>' +

      '<td>' + item.sistema + '</td>' +

      '<td>' + item.fisico + '</td>' +

      '<td>' + item.diferencia + '</td>' +

      '<td>' +

        '<button class="btn-danger">' +

        'Eliminar' +

        '</button>' +

      '</td>' +

    '</tr>';

  });

};





// ======================
// FILTRAR HISTORIAL
// ======================

window.filtrarHistorial = function(tipo){

  renderHistorial(tipo);

};





// ======================
// KPIS
// ======================

window.actualizarKPIs = function(){

  var historial =

  JSON.parse(

    localStorage.getItem(
      'historial'
    )

  ) || [];



  var total =
  historial.length;



  var exactos =
  historial.filter(function(item){

    return item.diferencia === 0;

  }).length;



  var faltantes =
  historial.filter(function(item){

    return item.diferencia < 0;

  }).length;



  var sobrantes =
  historial.filter(function(item){

    return item.diferencia > 0;

  }).length;



  var exactitud = 0;



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
    exactitud + '%'
  );

};





// ======================
// FILTRAR INVENTARIO
// ======================

function filtrarInventario(){

  var texto =
  buscadorInventario.value
  .toLowerCase();



  var filtrados =

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





// ======================
// EXPORTAR EXCEL
// ======================

function exportarExcel(){

  var historial =

  JSON.parse(

    localStorage.getItem(
      'historial'
    )

  ) || [];



  var worksheet =

  XLSX.utils.json_to_sheet(
    historial
  );



  var workbook =

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





// ======================
// REINICIAR
// ======================

function reiniciarInventario(){

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

}





// ======================
// HELPERS
// ======================

function actualizarTexto(

  id,
  valor

){

  var elemento =
  document.getElementById(id);



  if(elemento){

    elemento.innerText =
    valor;

  }

}





// ======================
// INICIO
// ======================

renderInventario();

renderHistorial();

actualizarKPIs();

}

