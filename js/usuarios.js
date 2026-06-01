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
        'Activo',

        password:
        '123456'

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
// RENDER
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





    body.innerHTML = '';





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





    if(!data || data.length === 0){

      body.innerHTML =

      '<tr>' +

      '<td colspan="3">' +

      'No hay usuarios registrados' +

      '</td>' +

      '</tr>';



      return;

    }





    data.forEach(function(item){

      body.innerHTML +=

      '<tr>' +





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

              'class="btn-editar" ' +

              'onclick="editarUsuario(' +

              item.id +

              ')"' +

            '>' +

              'Editar' +

            '</button>' +





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
// EDITAR USUARIO
// ======================

window.editarUsuario = async function(id){

  try{

    const response =

    await window.supabaseClient

    .from('usuarios')

    .select('*')

    .eq(

      'id',

      id

    )

    .single();





    const usuario =
    response.data;





    if(!usuario){

      alert(
        'Usuario no encontrado'
      );

      return;

    }





    const nuevoRol = prompt(

`Nuevo rol:

Administrador
Auditor
Lider
Jefe`,

      usuario.rol

    );





    if(!nuevoRol){

      return;

    }





    const nuevaPassword = prompt(

      'Nueva contraseña:',

      usuario.password || ''

    );





    if(nuevaPassword === null){

      return;

    }





    const nuevoEstado = prompt(

`Nuevo estado:

Activo
Inactivo`,

      usuario.estado || 'Activo'

    );





    const update =

    await window.supabaseClient

    .from('usuarios')

    .update({

      rol:
      nuevoRol,

      password:
      nuevaPassword,

      estado:
      nuevoEstado

    })

    .eq(

      'id',

      id

    );





    if(update.error){

      console.log(
        update.error
      );

      alert(
        'Error actualizando usuario'
      );

      return;

    }





    renderUsuarios();





    alert(
      'Usuario actualizado'
    );

  }

  catch(error){

    console.log(error);

  }

};





// ======================
// ELIMINAR
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
