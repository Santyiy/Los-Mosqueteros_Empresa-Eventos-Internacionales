
const API_BASE_URL = 'http://localhost:8080/api/v1';
const token = localStorage.getItem('userToken');
let currentShowId = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarShowsParaSelect();
    
    document.getElementById('load-stock-button').addEventListener('click', () => {
        currentShowId = document.getElementById('show-select').value;
        if (currentShowId) {
            cargarStockPorShow(currentShowId);
        } else {
            mostrarMensaje('Seleccione un show para cargar su stock.', 'info');
        }
    });

    document.getElementById('toggle-add-form').addEventListener('click', () => {
        document.getElementById('stock-form-section').style.display = 'block';
        limpiarFormularioStock();
    });

    document.getElementById('cancel-stock-button').addEventListener('click', () => {
        document.getElementById('stock-form-section').style.display = 'none';
        limpiarFormularioStock();
    });

    document.getElementById('stock-form').addEventListener('submit', manejarEnvioStock);
});

// ==========================================================
// CARGA INICIAL DE SHOWS (para el <select>)
// ==========================================================

async function cargarShowsParaSelect() {
    const select = document.getElementById('show-select');
    try {
        const response = await fetch(`${API_BASE_URL}/shows`, { headers: { 'Authorization': `Bearer ${token}` } });
        const shows = await response.json();

        select.innerHTML = '<option value="">-- Seleccione un Show --</option>';
        shows.forEach(show => {
            select.innerHTML += `<option value="${show.id}">${show.nombre} (${new Date(show.fecha_hora).toLocaleDateString()})</option>`;
        });
    } catch (error) {
        select.innerHTML = '<option value="">Error al cargar shows.</option>';
        mostrarMensaje('Error al cargar la lista de shows.', 'error');
    }
}

// ==========================================================
// LECTURA DE STOCK (GET)
// ==========================================================

async function cargarStockPorShow(showId) {
    const tableBody = document.getElementById('stock-table-body');
    const showName = document.getElementById('show-select').options[document.getElementById('show-select').selectedIndex].text;
    document.getElementById('current-show-name').innerText = showName;
    document.getElementById('form-show-id').value = showId;
    document.getElementById('stock-display-section').style.display = 'block';
    tableBody.innerHTML = '<tr><td colspan="5">Cargando tipos de tickets...</td></tr>';

    try {
        const response = await fetch(`${API_BASE_URL}/tickets/stock?show_id=${showId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al obtener el stock.');
        
        const stockItems = await response.json();
        renderizarTablaStock(stockItems);

    } catch (error) {
        console.error('Error al cargar stock:', error);
        mostrarMensaje(`Error: ${error.message}`, 'error');
        tableBody.innerHTML = '<tr><td colspan="5">No se pudo cargar el stock.</td></tr>';
    }
}

function renderizarTablaStock(stockItems) {
    const tableBody = document.getElementById('stock-table-body');
    tableBody.innerHTML = '';

    if (stockItems.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">No hay tipos de tickets definidos para este show.</td></tr>';
        return;
    }

    stockItems.forEach(item => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nombre_tipo}</td>
            <td>$${parseFloat(item.precio).toFixed(2)}</td>
            <td>${item.cantidad_disponible}</td>
            <td>
                <button onclick="cargarStockParaEditar(${item.id})" class="btn btn-sm btn-primary">Editar</button>
                <button onclick="eliminarStock(${item.id})" class="btn btn-sm btn-danger">Eliminar</button>
            </td>
        `;
    });
}

// ==========================================================
// CREACIÓN Y EDICIÓN (POST)
// ==========================================================

async function manejarEnvioStock(e) {
    e.preventDefault();
    const stockId = document.getElementById('stock-id').value;
    const isEditing = !!stockId;

    const form = e.target;
    const stockData = {
        show_id: parseInt(form['form-show-id'].value),
        nombre_tipo: form.tipo_ticket_nombre.value,
        precio: parseFloat(form.precio.value),
        cantidad_disponible: parseInt(form.cantidad_disponible.value)
    };
    
    const url = isEditing ? `${API_BASE_URL}/tickets/stock/${stockId}` : `${API_BASE_URL}/tickets/stock`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(stockData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status} al guardar el stock.`);
        }

        mostrarMensaje(`Stock ${isEditing ? 'actualizado' : 'creado'} con éxito!`, 'success');
        document.getElementById('stock-form-section').style.display = 'none';
        limpiarFormularioStock();
        cargarStockPorShow(currentShowId); 
        
    } catch (error) {
        console.error('Error en la operación:', error);
        mostrarMensaje(`Error: ${error.message}`, 'error');
    }
}

async function cargarStockParaEditar(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/tickets/stock/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Stock no encontrado para editar.');
        
        const item = await response.json();
        
        document.getElementById('stock-id').value = item.id;
        document.getElementById('tipo_ticket_nombre').value = item.nombre_tipo;
        document.getElementById('precio').value = item.precio;
        document.getElementById('cantidad_disponible').value = item.cantidad_disponible;

        document.getElementById('stock-form-title').innerText = 'Editar Tipo de Ticket (ID: ' + item.id + ')';
        document.getElementById('submit-stock-button').innerText = 'Actualizar Stock';
        document.getElementById('stock-form-section').style.display = 'block';

    } catch (error) {
        console.error('Error al cargar stock para editar:', error);
        mostrarMensaje(`Error al cargar datos para editar: ${error.message}`, 'error');
    }
}

function limpiarFormularioStock() {
    document.getElementById('stock-form').reset();
    document.getElementById('stock-id').value = '';
    document.getElementById('stock-form-title').innerText = 'Agregar Nuevo Tipo de Ticket';
    document.getElementById('submit-stock-button').innerText = 'Guardar Stock';
}

// ==========================================================
// ELIMINACIÓN (DELETE)
// ==========================================================

async function eliminarStock(id) {
    if (!confirm(`¿Estás seguro de que quieres eliminar el Tipo de Ticket ID ${id}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tickets/stock/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status} al eliminar el stock.`);
        }

        mostrarMensaje(`Tipo de Ticket ID ${id} eliminado con éxito.`, 'success');
        cargarStockPorShow(currentShowId); 
        
    } catch (error) {
        console.error('Error al eliminar stock:', error);
        mostrarMensaje(`Error: ${error.message}`, 'error');
    }
}



function mostrarMensaje(texto, tipo) {
    const messageArea = document.getElementById('message-area');
    messageArea.innerHTML = '';
    
    const alertClass = (tipo === 'success') ? 'alert-success' : (tipo === 'info' ? 'alert-info' : 'alert-error');
    const iconClass = (tipo === 'success') ? 'fa-check-circle' : (tipo === 'info' ? 'fa-info-circle' : 'fa-times-circle');
    
    const html = `<div class="alert ${alertClass}"><i class="fas ${iconClass}"></i> ${texto}</div>`;
    messageArea.insertAdjacentHTML('beforeend', html);
    
    setTimeout(() => { messageArea.innerHTML = ''; }, 5000);
}