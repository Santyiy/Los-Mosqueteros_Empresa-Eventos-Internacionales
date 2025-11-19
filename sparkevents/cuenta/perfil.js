
const API_BASE_URL = 'http://localhost:8080/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('userToken');
    const userName = localStorage.getItem('userName');
    
    if (!token) {
        alert("Necesitas iniciar sesión para ver tu perfil.");
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('welcome-message').innerText = `Hola, ${userName}`;
    
    cargarHistorial(token);
});

async function cargarHistorial(token) {
    const tableBody = document.getElementById('purchase-history-body');
    const messageArea = document.getElementById('message-area');
    tableBody.innerHTML = '<tr><td colspan="4">Cargando historial...</td></tr>';
    messageArea.innerHTML = '';

    try {
        
        const response = await fetch(`${API_BASE_URL}/users/me/compras`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el historial de compras.');
        }

        const historial = await response.json();
        
        tableBody.innerHTML = ''; 

        if (historial.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">Aún no has realizado ninguna compra.</td></tr>';
            return;
        }

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