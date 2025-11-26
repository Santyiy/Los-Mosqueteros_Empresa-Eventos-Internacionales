const API_BASE_URL = 'http://localhost:8080/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const showId = params.get('id');

    if (showId) {
        cargarDatosShow(showId);
        document.getElementById('edit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            guardarCambios(showId);
        });
    } else {
        mostrarMensaje('Error: ID de show no proporcionado.', 'red');
    }
});

async function cargarDatosShow(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/shows/${id}`);
        if (!response.ok) throw new Error('Error al obtener datos');

        const data = await response.json();
        
        document.getElementById('nombre').value = data.nombre;
        document.getElementById('lugar').value = data.lugar;
        
        const fechaHora = new Date(data.fechaHora).toISOString().slice(0, 16);
        document.getElementById('fecha_hora').value = fechaHora;

        document.getElementById('descripcion').value = data.descripcion;
        document.getElementById('current-image').src = `../${data.imagenUrl}`; 
        
    } catch (error) {
        console.error('Error al cargar el show:', error);
        mostrarMensaje('No se pudo cargar la información del show.', 'red');
    }
}

async function guardarCambios(id) {
    const updatedData = {
        nombre: document.getElementById('nombre').value,
        lugar: document.getElementById('lugar').value,
        fechaHora: document.getElementById('fecha_hora').value + ':00', 
        descripcion: document.getElementById('descripcion').value,
    };

    try {
        const response = await fetch(`${API_BASE_URL}/shows/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            mostrarMensaje('Show actualizado con éxito!', 'green');
            cargarDatosShow(id); 
        } else {
            mostrarMensaje(`Error al actualizar: ${response.statusText}`, 'red');
        }

    } catch (error) {
        mostrarMensaje('Error de conexión con el servidor API.', 'red');
    }
}

function mostrarMensaje(texto, color) {
    const mensajeDiv = document.getElementById('mensaje-display');
    if (mensajeDiv) {
        mensajeDiv.innerHTML = `<p style='color: ${color};'>${texto}</p>`;
    }
}