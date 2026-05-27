// ======================
// EVENTO
// ======================

document.getElementById(
  'guardarUsuario'
)
?.addEventListener(
  'click',
  guardarUsuario
);



// ======================
// GUARDAR
// ======================

async function guardarUsuario(){

  const usuario =
  document.getElementById(
    'usuarioInput'
  ).value.trim();

  const password =
  document.getElementById(
    'passwordInput'
  ).value.trim();

  const rol =
  document.getElementById(
    'rolInput'
  ).value;





  if(!usuario || !password){

    alert(
      'Complete todos los campos'
    );

    return;

  }





  const { data: existeUsuario } =

  await window.supabaseClient

  .from('usuarios')

  .select('*')

  .eq('usuario', usuario);





  if(existeUsuario.length > 0){

    alert(
      'El usuario ya existe'
    );

    return;

  }





  const { error } =

  await window.supabaseClient

  .from('usuarios')

  .insert([

    {
      usuario,
      password,
      rol
    }

  ]);





  if(error){

    console.log(error);

    alert(
      'Error creando usuario'
    );

    return;

  }





  await guardarHistorial(

    'CREAR',

    'USUARIOS',

    `Se creó usuario ${usuario}`

  );





  await renderUsuarios();

  limpiarFormulario();





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





  const { data, error } =

  await window.supabaseClient

  .from('usuarios')

  .select('*')

  .order('id', {

    ascending: false

  });





  if(error){

    console.log(error);

    return;

  }





  if(!data || data.length === 0){

    body.innerHTML = `

      <tr>

        <td colspan="5">

          No hay usuarios

        </td>

      </tr>

    `;

    return;

  }





  data.forEach(item => {

    body.innerHTML += `

      <tr>

        <td>${item.usuario}</td>

        <td>${item.password}</td>

        <td>${item.rol}</td>

        <td>

          ${new Date(
            item.created_at
          ).toLocaleString()}

        </td>

        <td class="acciones-tabla">

          <button
            class="btn-eliminar"
            onclick="eliminarUsuario('${item.id}')"
          >

            Eliminar

          </button>

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
    '¿Eliminar usuario?'
  );



  if(!confirmar){

    return;

  }





  const { data } =

  await window.supabaseClient

  .from('usuarios')

  .select('*')

  .eq('id', id)

  .single();





  const { error } =

  await window.supabaseClient

  .from('usuarios')

  .delete()

  .eq('id', id);





  if(error){

    console.log(error);

    return;

  }





  await guardarHistorial(

    'ELIMINAR',

    'USUARIOS',

    `Se eliminó usuario ${data?.usuario}`

  );





  await renderUsuarios();

}





// ======================
// EDITAR
// ======================

async function editarUsuario(id){

  const { data } =

  await window.supabaseClient

  .from('usuarios')

  .select('*')

  .eq('id', id)

  .single();





  if(!data){

    return;

  }





  const nuevoPassword = prompt(
    'Nueva contraseña:',
    data.password
  );



  if(nuevoPassword === null){

    return;

  }





  const nuevoRol = prompt(
    'Nuevo rol:',
    data.rol
  );



  if(nuevoRol === null){

    return;

  }





  const { error } =

  await window.supabaseClient

  .from('usuarios')

  .update({

    password: nuevoPassword,

    rol: nuevoRol

  })

  .eq('id', id);





  if(error){

    console.log(error);

    return;

  }





  await guardarHistorial(

    'EDITAR',

    'USUARIOS',

    `Se editó usuario ${data.usuario}`

  );





  await renderUsuarios();

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
