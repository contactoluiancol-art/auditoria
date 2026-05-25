// ======================
// CONEXION SUPABASE
// ======================

const supabaseUrl =

'https://hurxdjoiafkjoyrmyhbd.supabase.co';



const supabaseKey =

'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1cnhkam9pYWZram95cm15aGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MzgxMTMsImV4cCI6MjA5NTMxNDExM30.Z6fRiWft3eSEVNZbWflmcvVcHAJTAEA37tPdp4LRnTg';



const supabaseClient =

supabase.createClient(

  supabaseUrl,
  supabaseKey

);





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
  // INSERTAR USUARIO
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
  // ACTUALIZAR
  // ======================

  renderUsuarios();

  limpiarFormulario();





  // ======================
  // ALERTA
  // ======================

  alert(
    'Usuario creado correctamente'
  );

}






// ======================
// RENDER USUARIOS
// ======================

async function renderUsuarios(){

  const body =

  document.getElementById(
    'usuariosBody'
  );



  body.innerHTML = '';





  // ======================
  // CONSULTAR USUARIOS
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
  // VALIDAR VACIO
  // ======================

  if(

    !data ||

    data.length === 0

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

  data.forEach(item => {

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

          ${item.fecha || ''}

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
// ELIMINAR USUARIO
// ======================

async function eliminarUsuario(id){

  const confirmar = confirm(

    '¿Desea eliminar este usuario?'

  );



  if(!confirmar){

    return;

  }





  // ======================
  // ELIMINAR
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
  // ACTUALIZAR
  // ======================

  renderUsuarios();

}






// ======================
// EDITAR USUARIO
// ======================

async function editarUsuario(id){

  // ======================
  // BUSCAR USUARIO
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
  // ACTUALIZAR
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
  // ACTUALIZAR TABLA
  // ======================

  renderUsuarios();





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
