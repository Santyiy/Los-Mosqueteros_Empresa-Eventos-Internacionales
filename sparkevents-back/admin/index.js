
const API_BASE_URL = 'http://localhost:8080/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    cargarMetricas();
    cargarUltimosShows();
});


async function cargarMetricas() {
    try {
        const response = await fetch(`${API_BASE_URL}/metrics`);
        
        const data = response.ok ? await response.json() : {}; 
        
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


async function cargarUltimosShows() {
    try {
        const response = await fetch(`${API_BASE_URL}/shows`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const shows = await response.json();
        const ultimosShows = shows.slice(0, 5); 

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