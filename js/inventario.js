INVENTARIO.JS

REEMPLAZA TODO EL ARCHIVO COMPLETO.

```javascript
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
      'Excel cargado'
    );

  };



  reader.readAsArrayBuffer(file);

}





// ======================
// RENDER
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

      'No hay inventario' +

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

        '<button class="btn-eliminar" onclick="eliminarProducto(' +

        "'" + item.codigo + "'" +

        ')">' +

        'Eliminar' +

        '</button>'

        :

        '-'

      )





      + '</td>' +

    '</tr>';

  });

};

}
```
