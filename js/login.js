// ======================
// USUARIOS DEMO
// ======================

const usuariosDemo = [

  {
    usuario: 'admin',
    password: '1234',
    rol: 'admin'
  },

  {
    usuario: 'lider',
    password: '1234',
    rol: 'lider'
  },

  {
    usuario: 'jefe',
    password: '1234',
    rol: 'jefe'
  },

  {
    usuario: 'auditor',
    password: '1234',
    rol: 'auditor'
  }

];




// ======================
// GUARDAR USUARIOS
// ======================

localStorage.setItem(

  'usuarios',

  JSON.stringify(
    usuariosDemo
  )

);




// ======================
// FORM LOGIN
// ======================

const form =

document.getElementById(
  'loginForm'
);




// ======================
// EVENTO
// ======================

form.addEventListener(

  'submit',

  login

);




// ======================
// LOGIN
// ======================

function login(e){

  e.preventDefault();




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




  const usuarios = JSON.parse(

    localStorage.getItem(
      'usuarios'
    )

  ) || [];




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




  if(!usuarioEncontrado){

    alert(
      'Usuario o contraseña incorrectos'
    );

    return;

  }




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
