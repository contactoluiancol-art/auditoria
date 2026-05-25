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
    localStorage.getItem('usuarios')
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