// /admin/gestionar_shows.js

const API_BASE_URL = 'http://localhost:8080/api/v1';
const token = localStorage.getItem('userToken');

document.addEventListener('DOMContentLoaded', () => {
    cargarShows();
    
    // Asignar el listener al formulario
    document.getElementById('show-form').addEventListener('submit', manejarEnvioFormulario);
    
    // Asignar el listener al botón de cancelar edición
    document.getElementById('cancel-button').addEventListener('click', limpiarFormulario);
});

// ==========================================================
// LECTURA (GET)
// ==========================================================

async function cargarShows() {
    const tableBody = document.getElementById('shows-table-body');
    tableBody.innerHTML = '<tr><td colspan="5">Cargando shows...</td></tr>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/shows`, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener la lista de shows.');
        }

        const shows = await response.json();
        renderizarTabla(shows);

    } catch (error) {
        console.error('Error al cargar shows:', error);
        mostrarMensaje(`Error: ${error.message}`, 'error');
        tableBody.innerHTML = '<tr><td colspan="5">No se pudieron cargar los shows.</td></tr>';
    }
}

function renderizarTabla(shows) {
    const tableBody = document.getElementById('shows-table-body');
    tableBody.innerHTML = '';

    if (shows.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">No hay shows registrados.</td></tr>';
        return;
    }

    shows.forEach(show => {
        const fechaHora = new Date(show.fecha_hora);
        const fecha_fmt = fechaHora.toLocaleDateString('es-AR', { dateStyle: 'short' });
        const hora_fmt = fechaHora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${show.id}</td>
            <td>${show.nombre}</td>
            <td>${fecha_fmt} ${hora_fmt}</td>
            <td>${show.lugar}</td>
            <td>
                <button onclick="cargarShowParaEditar(${show.id})" class="btn btn-sm btn-primary">Editar</button>
                <button onclick="eliminarShow(${show.id})" class="btn btn-sm btn-danger">Eliminar</button>
            </td>
        `;
    });
}

// ==========================================================
// CREACIÓN Y EDICIÓN (POST / PUT)
// ==========================================================

async function manejarEnvioFormulario(e) {
    e.preventDefault();
    const showId = document.getElementById('show-id').value;
    const isEditing = !!showId; // true si showId tiene valor (estamos editando)

    const form = e.target;
    const showData = {
        nombre: form.nombre.value,
        lugar: form.lugar.value,
        fecha_hora: form.fecha_hora.value, // Formato datetime-local es compatible con ISO-8601
        imagen_url: form.imagen_url.value,
        descripcion: form.descripcion.value
    };
    
    const url = isEditing ? `${API_BASE_URL}/shows/${showId}` : `${API_BASE_URL}/shows`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(showData)
        });

        if (!response.ok) {
            // Intenta leer el mensaje de error del cuerpo de la respuesta
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status} al ${isEditing ? 'actualizar' : 'crear'} el show.`);
        }

        mostrarMensaje(`Show ${isEditing ? 'actualizado' : 'creado'} con éxito!`, 'success');
        limpiarFormulario();
        cargarShows(); // Recargar la tabla
        
    } catch (error) {
        console.error('Error en la operación:', error);
        mostrarMensaje(`Error: ${error.message}`, 'error');
    }
}

async function cargarShowParaEditar(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/shows/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        
        if (!response.ok) throw new Error('Show no encontrado para editar.');
        
        const show = await response.json();
        
        // Convertir la fecha al formato que requiere el input datetime-local (YYYY-MM-DDTHH:MM)
        const date = new Date(show.fecha_hora);
        // Función auxiliar para formatear la fecha a YYYY-MM-DDTHH:MM
        const formattedDate = date.toISOString().substring(0, 16); 
        
        // Llenar el formulario
        document.getElementById('show-id').value = show.id;
        document.getElementById('nombre').value = show.nombre;
        document.getElementById('lugar').value = show.lugar;
        document.getElementById('fecha_hora').value = formattedDate;
        document.getElementById('imagen_url').value = show.imagen_url;
        document.getElementById('descripcion').value = show.descripcion;

        // Cambiar la UI a modo Edición
        document.getElementById('form-title').innerText = 'Editar Show (ID: ' + show.id + ')';
        document.getElementById('submit-button').innerText = 'Actualizar Show';
        document.getElementById('cancel-button').style.display = 'inline-block';

    } catch (error) {
        console.error('Error al cargar show para editar:', error);
        mostrarMensaje(`Error al cargar datos para editar: ${error.message}`, 'error');
    }
}

function limpiarFormulario() {
    document.getElementById('show-form').reset();
    document.getElementById('show-id').value = '';
    
    // Restaurar la UI a modo Creación
    document.getElementById('form-title').innerText = 'Crear Nuevo Show';
    document.getElementById('submit-button').innerText = 'Guardar Show';
    document.getElementById('cancel-button').style.display = 'none';
}

// ==========================================================
// ELIMINACIÓN (DELETE)
// ==========================================================

async function eliminarShow(id) {
    if (!confirm(`¿Estás seguro de que quieres eliminar el Show ID ${id}? Esta acción es irreversible.`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/shows/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status} al eliminar el show.`);
        }

        mostrarMensaje(`Show ID ${id} eliminado con éxito.`, 'success');
        cargarShows(); // Recargar la tabla
        
    } catch (error) {
        console.error('Error al eliminar show:', error);
        mostrarMensaje(`Error: ${error.message}`, 'error');
    }
}

// ==========================================================
// UTILIDADES
// ==========================================================

function mostrarMensaje(texto, tipo) {
    const messageArea = document.getElementById('message-area');
    // Limpiar mensajes anteriores
    messageArea.innerHTML = '';
    
    const alertClass = (tipo === 'success') ? 'alert-success' : 'alert-error';
    const iconClass = (tipo === 'success') ? 'fa-check-circle' : 'fa-times-circle';
    
    const html = `
        <div class="alert ${alertClass}">
            <i class="fas ${iconClass}"></i> ${texto}
        </div>
    `;
    messageArea.insertAdjacentHTML('beforeend', html);
    
    // Opcional: Ocultar mensaje después de unos segundos
    setTimeout(() => {
        messageArea.innerHTML = '';
    }, 5000);
}