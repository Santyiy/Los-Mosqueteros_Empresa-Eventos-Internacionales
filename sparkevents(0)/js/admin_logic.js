// /admin/admin_logic.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Configurar la navegación de la sidebar
    document.querySelectorAll('.admin-nav .nav-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // 2. Cargar datos iniciales del Dashboard
    loadDashboardStats();
    
    // 3. Inicializar el botón de Logout (Cerrar Sesión)
    document.getElementById('admin-logout-btn').addEventListener('click', handleLogout);

    // 4. Inicializar botón de ABM (para cambiar a la vista de crear/editar)
    document.getElementById('add-event-btn').addEventListener('click', handleAddEvent);
    
    // 5. Verificar que el usuario sea Admin (Esta lógica debe estar en auth_check.js)
    checkAdminAccess(); 
});

const API_BASE_URL = 'http://localhost:8080/api/v1';

// --- Verificación de Seguridad ---

function checkAdminAccess() {
    // Implementación mínima. La lógica real de JWT y roles DEBE estar en auth_check.js
    const userRole = localStorage.getItem('userRole'); 
    const userName = localStorage.getItem('userName'); 

    if (userRole !== 'ADMIN') {
        alert('Acceso Denegado. Se requiere ser Administrador.');
        window.location.href = '../index.html'; // Redirigir al portal público
        return;
    }
    
    document.getElementById('admin-username').textContent = userName || 'Admin';
}

// --- Lógica de Navegación de Módulos ---

function handleNavigation(e) {
    e.preventDefault();
    const targetModule = e.currentTarget.getAttribute('data-module');

    // Desactivar todos los ítems de navegación
    document.querySelectorAll('.admin-nav .nav-item').forEach(item => item.classList.remove('active'));
    // Ocultar todos los módulos
    document.querySelectorAll('.module-content section').forEach(section => section.style.display = 'none');

    // Activar el ítem seleccionado
    e.currentTarget.classList.add('active');
    
    // Mostrar el módulo objetivo
    document.getElementById(targetModule).style.display = 'block';
    
    // Actualizar el título de la cabecera
    document.getElementById('module-title').textContent = e.currentTarget.textContent.trim();
    
    // Lógica específica para cargar el módulo
    if (targetModule === 'events') {
        loadEventsABM();
    }
    // Añadir aquí: if (targetModule === 'reports') { loadReports(); }
}

// --- Lógica de Carga de Datos y Módulos ---

async function loadDashboardStats() {
    // Ejemplo: Peticiones a la API para obtener contadores
    try {
        const eventsResp = await fetch(`${API_BASE_URL}/events/count`); // API debe tener un endpoint para el conteo
        const salesResp = await fetch(`${API_BASE_URL}/reports/sales-today`); 

        const eventCount = await eventsResp.json();
        const salesToday = await salesResp.json();
        
        document.getElementById('stat-events').textContent = eventCount || '0';
        document.getElementById('stat-sales').textContent = `$${(salesToday || 0).toFixed(2)}`;
        // stat-access es un dato de prueba
        document.getElementById('stat-access').textContent = '15'; 

    } catch (error) {
        console.error('Error al cargar stats:', error);
    }
}

async function loadEventsABM() {
    const tableContainer = document.getElementById('events-table-container');
    tableContainer.innerHTML = 'Cargando eventos para el ABM...';

    // Aquí llamarías a la API: GET /api/v1/events/admin para obtener una lista completa
    try {
        const response = await fetch(`${API_BASE_URL}/events`);
        const events = await response.json();
        
        // Generar la tabla HTML (Tópico de la siguiente respuesta)
        tableContainer.innerHTML = generateEventsTable(events);
        
    } catch (error) {
        tableContainer.innerHTML = '<p style="color: red;">No se pudo conectar con la API para cargar la lista de eventos.</p>';
    }
}

function generateEventsTable(events) {
    // Lógica para construir la tabla HTML con botones de Editar/Eliminar
    // Esto es un placeholder, el código real es más extenso.
    let html = `<table class="admin-table">
                    <thead><tr><th>ID</th><th>Nombre</th><th>Fecha</th><th>Lugar</th><th>Acciones</th></tr></thead>
                    <tbody>`;
    events.forEach(event => {
        html += `<tr>
                    <td>${event.id}</td>
                    <td>${event.nombre}</td>
                    <td>${new Date(event.fechaHora).toLocaleDateString()}</td>
                    <td>${event.lugar}</td>
                    <td>
                        <button class="btn-edit" data-id="${event.id}"><i class="fa-solid fa-edit"></i></button>
                        <button class="btn-delete" data-id="${event.id}"><i class="fa-solid fa-trash"></i></button>
                    </td>
                 </tr>`;
    });
    html += `</tbody></table>`;
    return html;
}

// --- Lógica de Botones ---

function handleAddEvent() {
    // Aquí se cargaría un formulario para crear un nuevo evento
    alert('Cargando formulario para crear nuevo evento...');
    // loadEventForm(null); // Función para cargar formulario vacío
}

function handleLogout() {
    // Limpiar el JWT y el rol del almacenamiento local
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    alert('Sesión cerrada correctamente.');
    window.location.href = '../cuenta/login.html';
}