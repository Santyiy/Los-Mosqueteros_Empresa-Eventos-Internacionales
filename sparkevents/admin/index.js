// /admin/index.js

// URL base de la API (Asegúrate de que esta URL sea correcta en tu configuración de Backend)
const API_BASE_URL = 'http://localhost:8080/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    // Estas funciones se llaman al cargar la página.
    cargarMetricas();
    cargarUltimosShows();
});

/**
 * Carga las métricas del sistema (total shows, stock, etc.) desde la API.
 * Asume que hay un endpoint GET /api/v1/metrics en el Backend.
 */
async function cargarMetricas() {
    // NOTA: Si tu API no tiene un endpoint /metrics, puedes omitir esta función
    // o modificarla para que calcule las métricas a partir de la lista completa de shows.
    try {
        const response = await fetch(`${API_BASE_URL}/metrics`);
        
        // Si no hay endpoint /metrics, asumimos un objeto de métricas vacío
        const data = response.ok ? await response.json() : {}; 
        
        // Datos de ejemplo si no hay métricas reales
        const totalShows = data.totalShows ?? '...';
        const showsActivos = data.showsActivos ?? '...';
        const totalTickets = data.totalStock ?? '...';

        const metricsHtml = `
            <div class="metric-card">
                <p>Total de Shows</p>
                <strong>${totalShows}</strong>
            </div>
            <div class="metric-card" style="border-left-color: #e67e22;">
                <p>Shows con Stock</p>
                <strong>${showsActivos}</strong>
            </div>
            <div class="metric-card" style="border-left-color: #27ae60;">
                <p>Stock Total Disponible</p>
                <strong>${totalTickets}</strong>
            </div>
            <div class="metric-card" style="border-left-color: #9b59b6;">
                <p>Métricas de Venta</p>
                <strong>N/A</strong>
            </div>
        `;
        document.getElementById('metrics-grid').innerHTML = metricsHtml;

    } catch (error) {
        console.error('Error al cargar métricas:', error);
        document.getElementById('metrics-grid').innerHTML = '<p style="color: red;">No se pudo conectar a la API para métricas.</p>';
    }
}

/**
 * Carga los últimos shows (limitados a 5) desde la API y los inserta en la tabla.
 */
async function cargarUltimosShows() {
    try {
        // Asumimos que la API permite obtener todos los shows o los 5 más recientes (GET /api/v1/shows)
        const response = await fetch(`${API_BASE_URL}/shows`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const shows = await response.json();
        const ultimosShows = shows.slice(0, 5); // Tomamos los 5 primeros si la API los devuelve ordenados

        const tbody = document.getElementById('shows-table-body');
        tbody.innerHTML = ''; 

        if (ultimosShows.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5"><p sty   le="color: orange;">No hay shows cargados en el sistema.</p></td></tr>';
            return;
        }

        ultimosShows.forEach(show => {
            const fechaFormateada = new Date(show.fechaHora).toLocaleString('es-AR', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${show.nombre}</td>
                <td>${show.lugar}</td>
                <td>${fechaFormateada}</td>
                <td>
                    <img src="../${show.imagenUrl}" alt="Portada" class="card-image-thumb">
                </td>
                <td>
                    <a href="editar_show.html?id=${show.id}" class="btn btn-primary btn-sm"><i class="fas fa-edit"></i> Editar</a>
                </td>
            `;
        });

    } catch (error) {
        console.error('Error al cargar shows:', error);
        const tbody = document.getElementById('shows-table-body');
        tbody.innerHTML = '<tr><td colspan="5"><p style="color: red;">Error al cargar datos desde la API.</p></td></tr>';
    }
}