
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.admin-nav .nav-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    loadDashboardStats();
    
    document.getElementById('admin-logout-btn').addEventListener('click', handleLogout);

    document.getElementById('add-event-btn').addEventListener('click', handleAddEvent);
    
    checkAdminAccess(); 
});

const API_BASE_URL = 'http://localhost:8080/api/v1';


function checkAdminAccess() {
    const userRole = localStorage.getItem('userRole'); 
    const userName = localStorage.getItem('userName'); 

    if (userRole !== 'ADMIN') {
        alert('Acceso Denegado. Se requiere ser Administrador.');
        window.location.href = '../index.html'; // Redirigir al portal público
        return;
    }
    
    document.getElementById('admin-username').textContent = userName || 'Admin';
}


function handleNavigation(e) {
    e.preventDefault();
    const targetModule = e.currentTarget.getAttribute('data-module');

    document.querySelectorAll('.admin-nav .nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.module-content section').forEach(section => section.style.display = 'none');

    e.currentTarget.classList.add('active');
    
    document.getElementById(targetModule).style.display = 'block';
    
    document.getElementById('module-title').textContent = e.currentTarget.textContent.trim();
    
    if (targetModule === 'events') {
        loadEventsABM();
    }
}


async function loadDashboardStats() {
    try {
        const eventsResp = await fetch(`${API_BASE_URL}/events/count`); // API debe tener un endpoint para el conteo
        const salesResp = await fetch(`${API_BASE_URL}/reports/sales-today`); 

        const eventCount = await eventsResp.json();
        const salesToday = await salesResp.json();
        
        document.getElementById('stat-events').textContent = eventCount || '0';
        document.getElementById('stat-sales').textContent = `$${(salesToday || 0).toFixed(2)}`;
        document.getElementById('stat-access').textContent = '15'; 

    } catch (error) {
        console.error('Error al cargar stats:', error);
    }
}

async function loadEventsABM() {
    const tableContainer = document.getElementById('events-table-container');
    tableContainer.innerHTML = 'Cargando eventos para el ABM...';

    try {
        const response = await fetch(`${API_BASE_URL}/events`);
        const events = await response.json();
        
        tableContainer.innerHTML = generateEventsTable(events);
        
    } catch (error) {
        tableContainer.innerHTML = '<p style="color: red;">No se pudo conectar con la API para cargar la lista de eventos.</p>';
    }
}

function generateEventsTable(events) {
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


function handleAddEvent() {
    alert('Cargando formulario para crear nuevo evento...');
}

function handleLogout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    alert('Sesión cerrada correctamente.');
    window.location.href = '../cuenta/login.html';
}