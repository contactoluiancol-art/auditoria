// ======================
// CLIENTE GLOBAL
// ======================

const supabaseClient =

window.supabaseClient;





// ======================
// EVENTO
// ======================

document.getElementById(
  'guardarUsuario'
)
.addEventListener(
  'click',
  guardarUsuario
);





// ======================
// GUARDAR USUARIO
// ======================

async function guardarUsuario(){

  const usuario =

  document.getElementById(
    'usuarioInput'
  )
  .value
  .trim();




  const password =

  document.getElementById(
    'passwordInput'
  )
  .value
  .trim();




  const rol =

  document.getElementById(
    'rolInput'
  )
  .value;





  // ======================
  // VALIDAR
  // ======================

  if(

    !usuario ||

    !password

  ){

    alert(
      'Complete todos los campos'
    );

    return;

  }





  // ======================
  // VALIDAR DUPLICADO
  // ======================

  const { data: existeUsuario } =

  await supabaseClient

  .from('usuarios')

  .select('*')

  .eq('usuario', usuario);





  if(

    existeUsuario &&

    existeUsuario.length > 0

  ){

    alert(
      'El usuario ya existe'
    );

    return;

  }





  // ======================
  // INSERTAR
  // ======================

  const { error } =

  await supabaseClient

  .from('usuarios')

  .insert([

    {

      usuario,

      password,

      rol

    }

  ]);





  // ======================
  // ERROR
  // ======================

  if(error){

    console.log(error);

    alert(
      'Error creando usuario'
    );

    return;

  }





  // ======================
  // HISTORIAL
  // ======================

  guardarHistorial(

    'CREAR',

    'USUARIOS',

    `Se creó el usuario ${usuario}`

  );





  // ======================
  // ACTUALIZAR
  // ======================

  await renderUsuarios();

  limpiarFormulario();





  // ======================
  // ALERTA
  // ======================

  alert(
    'Usuario creado correctamente'
  );

}






// ======================
// RENDER
// ======================

async function renderUsuarios(){

  const body =

  document.getElementById(
    'usuariosBody'
  );



  if(!body){

    return;

  }



  body.innerHTML = '';





  // ======================
  // CONSULTAR
  // ======================

  const { data, error } =

  await supabaseClient

  .from('usuarios')

  .select('*')

  .order('id', {

    ascending: false

  });





  // ======================
  // ERROR
  // ======================

  if(error){

    console.log(error);

    return;

  }





  // ======================
  // VALIDAR DUPLICADOS
  // ======================

  const usuariosUnicos = [];

  const ids = new Set();





  data.forEach(item => {

    if(!ids.has(item.id)){

      ids.add(item.id);

      usuariosUnicos.push(item);

    }

  });





  // ======================
  // VACIO
  // ======================

  if(

    usuariosUnicos.length === 0

  ){

    body.innerHTML = `

      <tr>

        <td colspan="5">

          No hay usuarios registrados

        </td>

      </tr>

    `;

    return;

  }





  // ======================
  // TABLA
  // ======================

  usuariosUnicos.forEach(item => {

    body.innerHTML += `

      <tr>

        <td>

          ${item.usuario}

        </td>

        <td>

          <span class="password-text">

            ${item.password}

          </span>

        </td>

        <td>

          ${item.rol}

        </td>

        <td>

          ${new Date(item.created_at)
            .toLocaleString()}

        </td>





        <!-- ACCIONES -->

        <td class="acciones-tabla">




          <!-- ELIMINAR -->

          <button
            class="btn-eliminar"
            onclick="eliminarUsuario('${item.id}')"
          >

            Eliminar

          </button>





          <!-- EDITAR -->

          <button
            class="btn-editar"
            onclick="editarUsuario('${item.id}')"
          >

            Editar

          </button>

        </td>

      </tr>

    `;

  });

}






// ======================
// ELIMINAR
// ======================

async function eliminarUsuario(id){

  const confirmar = confirm(

    '¿Desea eliminar este usuario?'

  );



  if(!confirmar){

    return;

  }





  // ======================
  // CONSULTAR USUARIO
  // ======================

  const { data: usuarioEliminar } =

  await supabaseClient

  .from('usuarios')

  .select('*')

  .eq('id', id)

  .single();





  // ======================
  // DELETE
  // ======================

  const { error } =

  await supabaseClient

  .from('usuarios')

  .delete()

  .eq('id', id);





  // ======================
  // ERROR
  // ======================

  if(error){

    console.log(error);

    alert(
      'Error eliminando usuario'
    );

    return;

  }





  // ======================
  // HISTORIAL
  // ======================

  guardarHistorial(

    'ELIMINAR',

    'USUARIOS',

    `Se eliminó el usuario ${usuarioEliminar?.usuario}`

  );





  // ======================
  // ACTUALIZAR
  // ======================

  await renderUsuarios();





  // ======================
  // ALERTA
  // ======================

  alert(
    'Usuario eliminado'
  );

}






// ======================
// EDITAR
// ======================

async function editarUsuario(id){

  // ======================
  // CONSULTAR
  // ======================

  const { data } =

  await supabaseClient

  .from('usuarios')

  .select('*')

  .eq('id', id)

  .single();





  if(!data){

    return;

  }





  // ======================
  // NUEVA PASSWORD
  // ======================

  const nuevoPassword = prompt(

    'Nueva contraseña:',

    data.password

  );



  if(

    nuevoPassword === null

  ){

    return;

  }





  // ======================
  // NUEVO ROL
  // ======================

  const nuevoRol = prompt(

`Nuevo rol:

admin
lider
jefe
auditor`,

    data.rol

  );



  if(

    nuevoRol === null

  ){

    return;

  }





  // ======================
  // UPDATE
  // ======================

  const { error } =

  await supabaseClient

  .from('usuarios')

  .update({

    password: nuevoPassword,

    rol: nuevoRol

  })

  .eq('id', id);





  // ======================
  // ERROR
  // ======================

  if(error){

    console.log(error);

    alert(
      'Error actualizando usuario'
    );

    return;

  }





  // ======================
  // HISTORIAL
  // ======================

  guardarHistorial(

    'EDITAR',

    'USUARIOS',

    `Se actualizó el usuario ${data.usuario}`

  );





  // ======================
  // ACTUALIZAR
  // ======================

  await renderUsuarios();





  // ======================
  // ALERTA
  // ======================

  alert(
    'Usuario actualizado'
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
    'rolInput'
  ).value = 'lider';

}






// ======================
// INICIO
// ======================

renderUsuarios();
