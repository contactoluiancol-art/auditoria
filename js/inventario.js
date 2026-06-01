
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



  if(datos.length === 0){

    body.innerHTML =

    '<tr>' +

      '<td colspan="5">' +

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



      '<td>' +





      (

        window.tienePermiso(
          'inventario',
          'eliminar'
        )

        ?

        '<button ' +

          'class="btn-eliminar" ' +

          'onclick="eliminarProducto(' +

          "'" + item.codigo + "'" +

          ')"' +

        '>' +

          'Eliminar' +

        '</button>'

        :

        '-'

      )





      + '</td>' +



    '</tr>';

  });

};





// ======================
// ELIMINAR PRODUCTO
// ======================

window.eliminarProducto = function(codigo){

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



  var confirmar = confirm(
    '¿Eliminar producto?'
  );



  if(!confirmar){

    return;

  }



  window.inventario =

  window.inventario.filter(

    function(item){

      return item.codigo != codigo;

    }

  );



  localStorage.setItem(

    'inventario',

    JSON.stringify(
      window.inventario
    )

  );



  renderInventario();

  actualizarKPIs();

};





// ======================
// BUSCAR PRODUCTO
// ======================

function buscarProducto(){

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



  actualizarTexto(
    'resultadoTexto',
    diferencia
  );



  var historial =

  JSON.parse(

    localStorage.getItem(
      'historial'
    )

  ) || [];



  var index = historial.findIndex(

    function(item){

      return item.codigo ==
      window.productoActual.codigo;

    }

  );



  var nuevoRegistro = {

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





      (

        window.tienePermiso(
          'inventario',
          'eliminar'
        )

        ?

        '<button ' +

        'class="btn-eliminar" ' +

        'onclick="eliminarRegistro(' +

        "'" + item.codigo + "'" +

        ')"' +

        '>' +

        'Eliminar' +

        '</button>'

        :

        '-'

      )





      + '</td>' +

    '</tr>';

  });

};





// ======================
// ELIMINAR REGISTRO
// ======================

window.eliminarRegistro = function(codigo){

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



  var historial =

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



  var totalConteos =
  historial.length;



  var exactos = 0;

  var faltantes = 0;

  var sobrantes = 0;

  var sumaExactitud = 0;





  historial.forEach(function(item){

    var sistema =
    Number(item.sistema);



    var fisico =
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



    var mayor = Math.max(
      sistema,
      fisico
    );



    var menor = Math.min(
      sistema,
      fisico
    );



    var exactitudItem = 0;



    if(mayor > 0){

      exactitudItem =

      (menor / mayor) * 100;

    }



    sumaExactitud +=
    exactitudItem;

  });





  var exactitudGeneral = 0;



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



  var historial =

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



  var confirmar = confirm(
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
// OCULTAR BOTONES
// ======================

function aplicarPermisosInventario(){

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





// ======================
// INICIO
// ======================

aplicarPermisosInventario();

renderInventario();

renderHistorial();

actualizarKPIs();

}

