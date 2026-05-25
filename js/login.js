// ======================
// USUARIOS DEMO
// ======================

if(!localStorage.getItem('usuarios')){

  const usuariosDemo = [

    {

      usuario: 'admin',

      password: '1234',

      rol: 'Administrador'

    },

    {

      usuario: 'auditor',

      password: '1234',

      rol: 'Auditor'

    },

    {

      usuario: 'operador',

      password: '1234',

      rol: 'Operador'

    }

  ];



  localStorage.setItem(

    'usuarios',

    JSON.stringify(usuariosDemo)

  );

}





// ======================
// FORM LOGIN
// ======================

const form =
document.getElementById(
  'loginForm'
);




// ======================
// EVENTO LOGIN
// ======================

form.addEventListener(
  'submit',
  login
);




// ======================
// LOGIN
// ======================

function login(e){

  // EVITAR RECARGA

  e.preventDefault();




  // INPUTS

  const usuario =
  document.getElementById(
    'usuario'
  ).value;

  const password =
  document.getElementById(
    'password'
  ).value;

  const rol =
  document.getElementById(
    'rol'
  ).value;




  // STORAGE

  const usuarios = JSON.parse(

    localStorage.getItem(
      'usuarios'
    )

  ) || [];




  // BUSCAR USUARIO

  const usuarioEncontrado =
  usuarios.find(item => {

    return(

      item.usuario === usuario

      &&

      item.password === password

      &&

      item.rol === rol

    );

  });




  // VALIDAR

  if(!usuarioEncontrado){

    alert(
      'Usuario o contraseña incorrectos'
    );

    return;

  }




  // GUARDAR SESION

  localStorage.setItem(

    'usuarioLogueado',

    JSON.stringify(
      usuarioEncontrado
    )

  );




  // REDIRECCIONAR

  window.location.href =
  'dashboard.html';

}
