// /cuenta/logout.js
// Script para cerrar la sesión eliminando el token del navegador

// Eliminar el token de autenticación
localStorage.removeItem('userToken');
localStorage.removeItem('userName');
localStorage.removeItem('isAdmin');

// Redirigir al usuario a la página principal
window.location.href = '../index.php';

// NOTA: Para un cierre de sesión perfecto, se debería hacer una llamada
// a la API para invalidar el token en el servidor (si aplica).