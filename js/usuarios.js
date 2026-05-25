// ======================
// EVENTOS
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

function guardarUsuario(){

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
  // STORAGE
  // ======================

  const usuarios = JSON.parse(
    localStorage.getItem(
      'usuarios'
    )
  ) || [];





  // ======================
  // VALIDAR DUPLICADOS
  // ======================

  const existeUsuario =
  usuarios.some(

    item =>

    item.usuario
    .toLowerCase() ===
    usuario.toLowerCase()

  );



  if(existeUsuario){

    alert(
      'El usuario ya existe'
    );

    return;

  }





  // ======================
  // NUEVO USUARIO
  // ======================

  const nuevoUsuario = {

    id: Date.now(),

    usuario,

    password,

    rol,

    fecha:
    new Date()
    .toLocaleDateString()

  };





  // ======================
  // AGREGAR
  // ======================

  usuarios.push(
    nuevoUsuario
  );





  // ======================
  // GUARDAR
  // ======================

  localStorage.setItem(

    'usuarios',

    JSON.stringify(
      usuarios
    )

  );





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

function renderUsuarios(){

  const usuarios = JSON.parse(
    localStorage.getItem(
      'usuarios'
    )
  ) || [];



  const body =
  document.getElementById(
    'usuariosBody'
  );



  body.innerHTML = '';





  // ======================
  // VALIDAR VACIO
  // ======================

  if(usuarios.length === 0){

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

  usuarios.forEach(item => {

    body.innerHTML += `

      <tr>




        <!-- USUARIO -->

        <td>

          ${item.usuario}

        </td>





        <!-- PASSWORD -->

        <td>

          <span
            class="password-text"
          >

            ${item.password}

          </span>

        </td>





        <!-- ROL -->

        <td>

          ${item.rol}

        </td>





        <!-- FECHA -->

        <td>

          ${item.fecha}

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

function eliminarUsuario(id){

  const confirmar = confirm(

    '¿Desea eliminar este usuario?'

  );



  if(!confirmar){

    return;

  }



  let usuarios = JSON.parse(
    localStorage.getItem(
      'usuarios'
    )
  ) || [];



  usuarios = usuarios.filter(

    item =>

    String(item.id) !==
    String(id)

  );



  localStorage.setItem(

    'usuarios',

    JSON.stringify(
      usuarios
    )

  );



  renderUsuarios();

}





// ======================
// EDITAR USUARIO
// ======================

function editarUsuario(id){

  const usuarios = JSON.parse(
    localStorage.getItem(
      'usuarios'
    )
  ) || [];



  const usuarioEditar =
  usuarios.find(

    item =>

    String(item.id) ===
    String(id)

  );



  if(!usuarioEditar){

    return;

  }





  // ======================
  // NUEVOS DATOS
  // ======================

  const nuevoPassword = prompt(

    'Nueva contraseña:',

    usuarioEditar.password

  );



  if(
    nuevoPassword === null
  ){

    return;

  }



  const nuevoRol = prompt(

`Nuevo rol:

admin
lider
auditor
jefe`,

    usuarioEditar.rol

  );



  if(
    nuevoRol === null
  ){

    return;

  }





  // ======================
  // ACTUALIZAR
  // ======================

  usuarioEditar.password =
  nuevoPassword;



  usuarioEditar.rol =
  nuevoRol;





  // ======================
  // GUARDAR
  // ======================

  localStorage.setItem(

    'usuarios',

    JSON.stringify(
      usuarios
    )

  );





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