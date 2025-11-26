// /js/index_logic.js

const API_BASE_URL = 'http://localhost:8080/api/v1';
let allEvents = [];

document.addEventListener('DOMContentLoaded', () => {
   
    fetchEventos();

    // 2. Configurar filtros de la barra superior
    document.querySelectorAll('.filter-link').forEach(link => {
        link.addEventListener('click', handleFilterClick);
    });
    
    // 3. Inicializar el botón de checkout (ejemplo, la lógica real es más compleja)
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
});


// --- LÓGICA DE CARGA DE EVENTOS ---

async function fetchEvents(filter = null) {
    const grid = document.getElementById('shows-grid');
    const title = document.getElementById('shows-section-title');
    grid.innerHTML = '<p class="no-shows">Cargando eventos...</p>';
    title.innerHTML = '🎫 Tickets Disponibles:';

    try {
        // Llama al endpoint de la API para obtener todos los eventos
        const response = await fetch(`${API_BASE_URL}/events`);
        
        if (!response.ok) {
            throw new Error('Error al obtener los eventos de la API.');
        }

        allEvents = await response.json();
        
        // Aplicar el filtro si existe
        const filteredEvents = filter 
            ? allEvents.filter(event => event.lugar === filter) 
            : allEvents;

        renderEvents(filteredEvents);

    } catch (error) {
        console.error('Fallo al obtener eventos:', error);
        grid.innerHTML = '<p class="no-shows" style="color: red;">❌ Error al conectar con el servidor de eventos. ¿Está la API de Java activa?</p>';
    }
}

function renderEvents(events) {
    const grid = document.getElementById('shows-grid');
    grid.innerHTML = ''; 

    if (events.length === 0) {
        grid.innerHTML = '<p class="no-shows">No se encontraron tickets para esta selección.</p>';
        return;
    }

    events.forEach(event => {
        // Construcción de la tarjeta de ticket
        const cardHtml = `
            <div class="show-card" data-id="${event.id}">
                <img src="${event.imagenUrl || 'img/default_ticket.jpg'}" alt="${event.nombre}" class="card-image">
                <div class="card-details">
                    <p class="show-date">${new Date(event.fechaHora).toLocaleDateString('es-AR', { dateStyle: 'long' })}</p>
                    <h3 class="show-title">${event.nombre}</h3>
                    <p class="show-location"><i class="fa-solid fa-location-dot"></i> ${event.lugar}</p>
                    <div class="ticket-info">
                        <p class="price">Desde **$${event.precioDesde.toFixed(2)}**</p>
                    </div>
                    <a href="show.html?id=${event.id}" class="add-to-cart-btn">
                        VER TICKETS <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardHtml);
    });
}

function handleFilterClick(e) {
    e.preventDefault();
    const filterValue = e.currentTarget.getAttribute('data-lugar');
    const title = document.getElementById('shows-section-title');
    
    // Si se hace clic en "Ver Todos"
    if (e.currentTarget.classList.contains('filter-all')) {
        title.innerHTML = '🎫 Todos los Tickets:';
        renderEvents(allEvents);
        return;
    }
    
    // Filtrar por lugar
    const filteredEvents = allEvents.filter(event => 
        event.lugar && event.lugar.includes(filterValue)
    );
    
    title.innerHTML = `🎫 Tickets en ${filterValue}:`;
    renderEvents(filteredEvents);
}


// --- LÓGICA BÁSICA DEL CARRITO (Solo visual, la lógica compleja va en show.html) ---

function handleCheckout() {
    alert('Redirigiendo a la pasarela de pagos. ¡Felicidades por tu compra!');
    // Aquí iría la redirección a la ruta de pago protegida.
}