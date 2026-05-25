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
}
