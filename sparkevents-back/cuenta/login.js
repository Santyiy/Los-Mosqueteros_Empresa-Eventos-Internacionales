
const API_BASE_URL = 'http://localhost:8080/api/v1';

document.addEventListener('DOMContentLoaded', () => {
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
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (response.ok && data.jwt) {
            const { jwt, nombre, isAdmin } = data; 
            
            localStorage.setItem('userToken', jwt);
            localStorage.setItem('userName', nombre); 
            localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false'); 
            
            mostrarMensaje(`¡Bienvenido, ${nombre}! Redirigiendo...`, 'green');
            form.reset();
            
            setTimeout(() => {
                if (isAdmin) {
                    window.location.href = '../admin/index.html';
                } else {
                    window.location.href = '../index.html'; 
                }
            }, 1000);

        } else {
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