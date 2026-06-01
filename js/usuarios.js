// ======================
// EVITAR DUPLICAR
// ======================

if(typeof window.usuariosCargado === 'undefined'){

window.usuariosCargado = true;





// ======================
// EVENTO
// ======================

var guardarUsuarioBtn =
document.getElementById(
  'guardarUsuario'
);

if(guardarUsuarioBtn){

  guardarUsuarioBtn.addEventListener(

    'click',

    guardarUsuario

  );

}





// ======================
// GUARDAR USUARIO
// ======================

async function guardarUsuario(){

  try{

    const nombre =
    document.getElementById(
      'nombreUsuario'
    ).value.trim();



    const correo =
    document.getElementById(
      'correoUsuario'
    ).value.trim();



    const rol =
    document.getElementById(
      'rolUsuario'
    ).value;





    // ======================
    // VALIDAR
    // ======================

    if(

      !nombre ||

      !correo ||

      !rol

    ){

      alert(
        'Complete todos los campos'
      );

      return;

    }





    // ======================
    // INSERTAR
    // ======================

    const response =

    await window.supabaseClient

    .from('usuarios')

    .insert([

      {

        nombre:
        nombre,

        correo:
        correo,

        rol:
        rol,

        estado:
        'Activo'

      }

    ]);





    if(response.error){

      console.log(
        response.error
      );

      alert(
        'Error guardando usuario'
      );

      return;

    }





    // ======================
    // NOTIFICACION
    // ======================

    let notificaciones =

    JSON.parse(

      localStorage.getItem(
        'notificaciones'
      )

    ) || [];





    notificaciones.unshift({

      mensaje:

      'Nuevo usuario creado: ' +
      nombre,



      fecha:

      new Date()
      .toLocaleString()

    });





    localStorage.setItem(

      'notificaciones',

      JSON.stringify(
        notificaciones
      )

    );





    // ======================
    // ACTUALIZAR
    // ======================

    renderUsuarios();

    limpiarFormulario();





    alert(
      'Usuario guardado'
    );

  }

  catch(error){

    console.log(error);

  }

}





// ======================
// RENDER USUARIOS
// ======================

async function renderUsuarios(){

  try{

    const body =
    document.getElementById(
      'usuariosBody'
    );



    if(!body){

      return;

    }





    body.innerHTML =

    '<tr>' +

      '<td colspan="5">' +

      'Cargando usuarios...' +

      '</td>' +

    '</tr>';





    const response =

    await window.supabaseClient

    .from('usuarios')

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



      body.innerHTML =

      '<tr>' +

        '<td colspan="5">' +

        'Error cargando usuarios' +

        '</td>' +

      '</tr>';



      return;

    }





    body.innerHTML = '';





    if(!data || data.length === 0){

      body.innerHTML =

      '<tr>' +

        '<td colspan="5">' +

        'No hay usuarios registrados' +

        '</td>' +

      '</tr>';



      return;

    }





    data.forEach(function(item){

      body.innerHTML +=

      '<tr>' +





        '<td>' +

          item.nombre +

        '</td>' +





        '<td>' +

          item.correo +

        '</td>' +





        '<td>' +

          item.rol +

        '</td>' +





        '<td>' +

          '<span class="estado-cerrado">' +

            (item.estado || 'Activo') +

          '</span>' +

        '</td>' +





        '<td>' +

          '<div class="acciones-tabla">' +





            '<button ' +

              'class="btn-eliminar" ' +

              'onclick="eliminarUsuario(' +

              item.id +

              ')"' +

            '>' +

              'Eliminar' +

            '</button>' +





          '</div>' +

        '</td>' +





      '</tr>';

    });

  }

  catch(error){

    console.log(error);

  }

}





// ======================
// ELIMINAR USUARIO
// ======================

window.eliminarUsuario = async function(id){

  try{

    const confirmar = confirm(
      '¿Eliminar usuario?'
    );





    if(!confirmar){

      return;

    }





    const response =

    await window.supabaseClient

    .from('usuarios')

    .delete()

    .eq(

      'id',

      id

    );





    if(response.error){

      console.log(
        response.error
      );

      alert(
        'Error eliminando usuario'
      );

      return;

    }





    renderUsuarios();





    alert(
      'Usuario eliminado'
    );

  }

  catch(error){

    console.log(error);

  }

};





// ======================
// BUSCAR USUARIO
// ======================

const buscarUsuario =
document.getElementById(
  'buscarUsuario'
);





if(buscarUsuario){

  buscarUsuario.addEventListener(

    'keyup',

    function(){

      const filtro =
      this.value.toLowerCase();



      const filas =
      document.querySelectorAll(
        '#usuariosBody tr'
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
// LIMPIAR
// ======================

function limpiarFormulario(){

  document.getElementById(
    'nombreUsuario'
  ).value = '';



  document.getElementById(
    'correoUsuario'
  ).value = '';



  document.getElementById(
    'rolUsuario'
  ).value = 'Administrador';

}





// ======================
// INICIO
// ======================

renderUsuarios();

}
