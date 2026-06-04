// ======================
// VALIDAR LIBRERIA
// ======================

if (!window.supabase) {

alert(
'Error cargando Supabase'
);

throw new Error(
'Supabase no cargó correctamente'
);

}

// ======================
// CONEXION SUPABASE
// ======================

const supabaseUrl =
'https://hurxdjoiafkjoyrmyhbd.supabase.co';

const supabaseKey =
'TU_SUPABASE_KEY';

// ======================
// CLIENTE GLOBAL
// ======================

window.supabaseClient =

window.supabase.createClient(
supabaseUrl,
supabaseKey
);

// ======================
// FORM LOGIN
// ======================

const form = document.getElementById(
'loginForm'
);

// ======================
// EVENTO LOGIN
// ======================

if (form) {

form.addEventListener(
'submit',
login
);

}

// ======================
// LOGIN
// ======================

async function login(e) {

try {

```
e.preventDefault();

const usuarioInput =
document.getElementById(
  'usuario'
);

const passwordInput =
document.getElementById(
  'password'
);

if (
  !usuarioInput ||
  !passwordInput
) {

  alert(
    'Inputs no encontrados'
  );

  return;

}

const usuario =
usuarioInput.value
.trim()
.toLowerCase();

const password =
passwordInput.value
.trim();

if (
  !usuario ||
  !password
) {

  alert(
    'Complete todos los campos'
  );

  return;

}

const { data, error } =

await window.supabaseClient

.from('usuarios')

.select('*')

.eq(
  'usuario',
  usuario
)

.eq(
  'password',
  password
)

.limit(1);

if (error) {

  console.log(error);

  alert(
    'Error conectando con Supabase'
  );

  return;

}

if (
  !data ||
  data.length === 0
) {

  alert(
    'Usuario o contraseña incorrectos'
  );

  return;

}

const usuarioData =
data[0];

if (
  usuarioData.estado ===
  'Inactivo'
) {

  alert(
    'Usuario inactivo'
  );

  return;

}

// ======================
// GUARDAR SESION
// ======================

localStorage.setItem(

  'usuarioLogueado',

  JSON.stringify(
    usuarioData
  )

);

// ======================
// MOSTRAR MODAL
// ======================

window.mostrarBienvenida(

  usuarioData.usuario,

  usuarioData.rol

);

return;
```

}

catch (error) {

```
console.log(error);

alert(
  'Error general en login'
);
```

}

}

// ======================
// MODAL BIENVENIDA
// ======================

window.mostrarBienvenida = function (

usuario,
rol

) {

document.getElementById(
'bienvenidaUsuario'
).innerText = usuario;

document.getElementById(
'bienvenidaRol'
).innerText = rol;

const modal =

document.getElementById(
'modalBienvenida'
);

modal.style.display =
'flex';

};

window.cerrarModalBienvenida = function () {

document.getElementById(
'modalBienvenida'
).style.display =
'none';

window.location.href =
'dashboard.html';

};

// ======================
// OCULTAR MODAL
// AL INICIAR
// ======================

document.addEventListener(

'DOMContentLoaded',

function () {

```
const modal =

document.getElementById(
  'modalBienvenida'
);

if (modal) {

  modal.style.display =
  'none';

}

}

);
