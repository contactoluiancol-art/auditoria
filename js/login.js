// ======================
// CONEXION SUPABASE
// ======================

const supabaseUrl =
'https://hurxdjoiafkjoyrmyhbd.supabase.co';

const supabaseKey =
'TU_API_KEY';

const supabase = window.supabase.createClient(

  supabaseUrl,
  supabaseKey

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

async function login(e){

  e.preventDefault();




  // ======================
  // INPUTS
  // ======================

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





  // ======================
  // CONSULTAR USUARIO
  // ======================

  const { data, error } = await supabase

  .from('usuarios')

  .select('*')

  .eq('usuario', usuario)

  .eq('password', password)

  .eq('rol', rol)

  .single();





  // ======================
  // ERROR SUPABASE
  // ======================

  if(error){

    console.log(error);

  }





  // ======================
  // VALIDAR LOGIN
  // ======================

  if(!data){

    alert(
      'Usuario o contraseña incorrectos'
    );

    return;

  }





  // ======================
  // GUARDAR SESION
  // ======================

  localStorage.setItem(

    'usuarioLogueado',

    JSON.stringify(
      data
    )

  );





  // ======================
  // REDIRECCIONAR
  // ======================

  window.location.href =
  'dashboard.html';

}
