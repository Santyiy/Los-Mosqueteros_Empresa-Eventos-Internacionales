// /cuenta/login.js

const API_BASE_URL = 'http://localhost:8080/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    // Escucha el evento de envío del formulario de login (ID: login-form)
    document.getElementById('login-form').addEventListener('submit', manejarLogin);
});

async function manejarLogin(e) {
    e.preventDefault();

    const form = e.target;
    const messageArea = document.getElementById('message-area');
    messageArea.innerHTML = '';

    const credentials = {
        email: form.email.value,
        password: form.password.value
    };

    try {
        // 1. Enviar petición POST a la API: POST /auth/login
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        // 2. Manejar respuesta y almacenar datos
        if (response.ok && data.jwt) {
            // Éxito: La API de Java DEBE devolver el token, el nombre del usuario y el rol.
            const { jwt, nombre, isAdmin } = data; 
            
            // a) Almacenar en el navegador (LocalStorage)
            localStorage.setItem('userToken', jwt);
            localStorage.setItem('userName', nombre); 
            // Guardamos el rol como string para futuras comprobaciones
            localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false'); 
            
            mostrarMensaje(`¡Bienvenido, ${nombre}! Redirigiendo...`, 'green');
            form.reset();
            
            // b) Redirigir según el rol
            setTimeout(() => {
                if (isAdmin) {
                    window.location.href = '../admin/index.html'; // Redirigir al Dashboard Admin
                } else {
                    window.location.href = '../index.html'; // Redirigir a la página principal
                }
            }, 1000);

        } else {
            // Error: Credenciales inválidas o API fallida
            const errorMessage = data.message || 'Credenciales inválidas o error de servidor.';
            mostrarMensaje(errorMessage, 'red');
        }

    } catch (error) {
        console.error('Error de red/servidor:', error);
        mostrarMensaje('No se pudo conectar con el servidor API. Intente más tarde.', 'red');
    }
}

function mostrarMensaje(texto, color) {
    const display = document.getElementById('message-area');
    const colorCode = color === 'green' ? '#2ecc71' : '#e74c3c';
    display.innerHTML = `<p style="color: ${colorCode}; font-weight: bold;">${texto}</p>`;
}