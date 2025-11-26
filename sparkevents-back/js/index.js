// /admin/index.js

const API_BASE_URL = 'http://localhost:8080/api/v1';
const token = localStorage.getItem('userToken');

document.addEventListener('DOMContentLoaded', () => {
    cargarMétricas();
    cargarShowsRecientes();
});

async function cargarMétricas() {

    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/metrics`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al cargar métricas.');
        
        const metrics = await response.json();

        // Asumiendo que tu API devuelve: { totalShows, ticketsVendidos, ingresosTotales }
        document.getElementById('metric-shows').innerText = metrics.totalShows || 0;
        document.getElementById('metric-sold').innerText = metrics.ticketsVendidos || 0;
        document.getElementById('metric-revenue').innerText = `$${formatoMoneda(metrics.ingresosTotales) || 0}`;

    } catch (error) {
        console.error('Error cargando métricas:', error);
      
    }
}

async function cargarShowsRecientes() {
    const tableBody = document.getElementById('shows-table-body');
    tableBody.innerHTML = '<tr><td colspan="5">Cargando datos...</td></tr>';
    
    try {
        // Ejemplo: Obtener una lista corta de shows (tal vez los últimos 5)
        const response = await fetch(`${API_BASE_URL}/shows?limit=5`, {
             headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al cargar shows recientes.');

        const shows = await response.json();
        tableBody.innerHTML = '';
        
        if (shows.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No hay shows registrados.</td></tr>';
            return;
        }

        shows.forEach(show => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${show.id}</td>
                <td>${show.nombre}</td>
                <td>${show.lugar}</td>
                <td>${new Date(show.fecha_hora).toLocaleDateString()} ${new Date(show.fecha_hora).toLocaleTimeString()}</td>
                <td><a href="gestionar_shows.html?edit=${show.id}" class="btn btn-sm btn-primary">Editar</a></td>
            `;
        });

    } catch (error) {
        console.error('Error cargando shows recientes:', error);
        tableBody.innerHTML = '<tr><td colspan="5" style="color: red;">Error al cargar shows.</td></tr>';
    }
}

function formatoMoneda(numero) {
    return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0 }).format(numero);
}