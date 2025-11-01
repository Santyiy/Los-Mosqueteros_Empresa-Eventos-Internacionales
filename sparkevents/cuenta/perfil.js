// /cuenta/perfil.js

const API_BASE_URL = 'http://localhost:8080/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('userToken');
    const userName = localStorage.getItem('userName');
    
    // 1. Verificar Autenticación
    if (!token) {
        alert("Necesitas iniciar sesión para ver tu perfil.");
        window.location.href = 'login.html';
        return;
    }
    
    // 2. Mostrar mensaje de bienvenida
    document.getElementById('welcome-message').innerText = `Hola, ${userName}`;
    
    // 3. Cargar el historial de compras
    cargarHistorial(token);
});

/**
 * Consulta la API para obtener el historial de compras del usuario.
 */
async function cargarHistorial(token) {
    const tableBody = document.getElementById('purchase-history-body');
    const messageArea = document.getElementById('message-area');
    tableBody.innerHTML = '<tr><td colspan="4">Cargando historial...</td></tr>';
    messageArea.innerHTML = '';

    try {
        // Asumimos que la API tiene un endpoint para obtener las compras del usuario actual
        // usando el token JWT para identificarlo.
        const response = await fetch(`${API_BASE_URL}/users/me/compras`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Enviar el token en cada petición segura
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el historial de compras.');
        }

        const historial = await response.json();
        
        tableBody.innerHTML = ''; // Limpiar el mensaje de carga

        if (historial.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">Aún no has realizado ninguna compra.</td></tr>';
            return;
        }

        // Renderizar la tabla
        historial.forEach(compra => {
            const fechaCompra = new Date(compra.fecha_compra).toLocaleDateString('es-AR');
            const total = compra.total_pagado ? `$${compra.total_pagado.toFixed(2)}` : 'N/A';

            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${compra.show_nombre} - ${compra.tipo_ticket_nombre}</td>
                <td>${fechaCompra}</td>
                <td>${compra.cantidad}</td>
                <td>${total}</td>
            `;
        });

    } catch (error) {
        console.error('Error al cargar historial:', error);
        tableBody.innerHTML = '<tr><td colspan="4" style="color: red;">Error: No se pudo conectar a la API.</td></tr>';
    }
}

function mostrarMensaje(texto, color) {
    const display = document.getElementById('message-area');
    display.innerHTML = `<p style="color: ${color}; font-weight: bold;">${texto}</p>`;
}