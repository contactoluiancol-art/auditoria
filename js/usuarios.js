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

    const usuario =

    document.getElementById(
      'usuarioInput'
    )
    .value
    .trim()
    .toLowerCase();





    const password =

    document.getElementById(
      'passwordInput'
    )
    .value
    .trim();





    const rol =

    document.getElementById(
      'rolUsuario'
    )
    .value;





    // ======================
    // VALIDAR
    // ======================

    if(

      !usuario ||

      !password ||

      !rol

    ){

      alert(
        'Complete todos los campos'
      );

      return;

    }





    // ======================
    // VALIDAR EXISTENTE
    // ======================

    const existente =

    await window.supabaseClient

    .from('usuarios')

    .select('*')

    .eq(

      'usuario',

      usuario

    )

    .limit(1);





    if(

      existente.data &&

      existente.data.length > 0

    ){

      alert(
        'El usuario ya existe'
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

        usuario:
        usuario,

        password:
        password,

        rol:
        rol,

        estado:
        'Activo'

      }

    ]);





    // ======================
    // ERROR
    // ======================

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
    // HISTORIAL
    // ======================

    if(typeof guardarHistorial === 'function'){

      await guardarHistorial(

        'CREAR',

        'USUARIOS',

        'Se creó el usuario ' +
        usuario

      );

    }





    // ======================
    // ACTUALIZAR
    // ======================

    renderUsuarios();

    limpiarFormulario();





    alert(
      'Usuario guardado correctamente'
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





    // ======================
    // SIN DATOS
    // ======================

    if(!data || data.length === 0){

      body.innerHTML =

      '<tr>' +

      '<td colspan="4">' +

      'No hay usuarios registrados' +

      '</td>' +

      '</tr>';



      return;

    }





    // ======================
    // RECORRER
    // ======================

    data.forEach(function(item){

      let estadoClase =

      item.estado === 'Activo'

      ?

      'estado-cerrado'

      :

      'estado-pendiente';





      body.innerHTML +=

      '<tr>' +





        // ======================
        // USUARIO
        // ======================

        '<td>' +

          (item.usuario || '-') +

        '</td>' +





        // ======================
        // ROL
        // ======================

        '<td>' +

          (item.rol || '-') +

        '</td>' +





        // ======================
        // ESTADO
        // ======================

        '<td>' +

          '<span class="' +

            estadoClase +

          '">' +

            (item.estado || 'Activo') +

          '</span>' +

        '</td>' +





        // ======================
        // ACCIONES
        // ======================

        '<td>' +

          '<div class="acciones-tabla">' +





            // EDITAR

            '<button ' +

              'class="btn-editar" ' +

              'onclick="editarUsuario(' +

              item.id +

              ')"' +

            '>' +

              'Editar' +

            '</button>' +





            // ELIMINAR

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





    // ======================
    // PASSWORD
    // ======================

    const nuevaPassword = prompt(

      'Nueva contraseña:',

      usuario.password || ''

    );





    if(nuevaPassword === null){

      return;

    }





    // ======================
    // ROL
    // ======================

    const nuevoRol = prompt(

`Nuevo rol:

admin
lider
jefe
auditor
compras`,

      usuario.rol

    );





    if(!nuevoRol){

      return;

    }





    // ======================
    // ESTADO
    // ======================

    const nuevoEstado = prompt(

`Nuevo estado:

Activo
Inactivo`,

      usuario.estado || 'Activo'

    );





    // ======================
    // UPDATE
    // ======================

    const update =

    await window.supabaseClient

    .from('usuarios')

    .update({

      password:
      nuevaPassword,

      rol:
      nuevoRol,

      estado:
      nuevoEstado

    })

    .eq(

      'id',

      id

    );





    // ======================
    // ERROR
    // ======================

    if(update.error){

      console.log(
        update.error
      );

      alert(
        'Error actualizando usuario'
      );

      return;

    }





    // ======================
    // HISTORIAL
    // ======================

    if(typeof guardarHistorial === 'function'){

      await guardarHistorial(

        'EDITAR',

        'USUARIOS',

        'Se actualizó el usuario ' +
        usuario.usuario

      );

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





    // ======================
    // CONSULTAR
    // ======================

    const consulta =

    await window.supabaseClient

    .from('usuarios')

    .select('*')

    .eq(

      'id',

      id

    )

    .single();





    const usuario =
    consulta.data;





    // ======================
    // ELIMINAR
    // ======================

    const response =

    await window.supabaseClient

    .from('usuarios')

    .delete()

    .eq(

      'id',

      id

    );





    // ======================
    // ERROR
    // ======================

    if(response.error){

      console.log(
        response.error
      );

      alert(
        'Error eliminando usuario'
      );

      return;

    }





    // ======================
    // HISTORIAL
    // ======================

    if(typeof guardarHistorial === 'function'){

      await guardarHistorial(

        'ELIMINAR',

        'USUARIOS',

        'Se eliminó el usuario ' +
        usuario.usuario

      );

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
// BUSCADOR
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
    'usuarioInput'
  ).value = '';



  document.getElementById(
    'passwordInput'
  ).value = '';



  document.getElementById(
    'rolUsuario'
  ).value = 'admin';

}





// ======================
// INICIO
// ======================

renderUsuarios();

}
