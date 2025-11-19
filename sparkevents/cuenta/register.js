
const API_BASE_URL = 'http://localhost:8080/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('register-form').addEventListener('submit', manejarRegistro);
});

async function manejarRegistro(e) {
    e.preventDefault();

    const form = e.target;
    const messageArea = document.getElementById('message-area');
    messageArea.innerHTML = '';

    const userData = {
        nombre: form.nombre.value, 
        apellido: form.apellido.value,
        email: form.email.value,
        password: form.password.value,
    };

    if (form.password.value !== form.confirm_password.value) {
        mostrarMensaje("Las contraseñas no coinciden.", 'red');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            mostrarMensaje("¡Registro exitoso! Redirigiendo a Iniciar Sesión...", 'green');
            form.reset();
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            const errorMessage = data.message || 'Error desconocido durante el registro.';
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