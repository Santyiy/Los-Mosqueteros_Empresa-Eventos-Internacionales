

const API_BASE_URL = 'http://localhost:8080/api/v1';
let currentEvent = null;
let cart = []; 

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    if (eventId) {
        fetchEventDetails(eventId);
    } else {
        document.getElementById('event-details-card').innerHTML = '<h2 style="color: red;">ERROR: ID de evento no especificado.</h2>';
    }
    
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
});

// --- PASO 1: OBTENER DATOS DE LA API DE JAVA ---

async function fetchEventDetails(eventId) {
    try {
        // La API debe tener un endpoint GET /events/{id} que devuelva el evento Y sus tipos de tickets
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
        
        if (response.status === 404) {
             document.getElementById('event-details-card').innerHTML = `<h2 style="color: red;">Evento con ID ${eventId} no encontrado.</h2>`;
             return;
        }
        if (!response.ok) {
            throw new Error(`Error ${response.status} al cargar detalles.`);
        }

        currentEvent = await response.json();
        
        // 1. Renderizar el título de la página
        document.title = currentEvent.nombre + " | Tickets - QUANTUM";

        // 2. Renderizar la tarjeta del evento
        renderEventCard(currentEvent);

        // 3. Renderizar las opciones de tickets (precios y stock)
        renderTicketSelection(currentEvent.tiposTickets); // Suponemos que la API devuelve una lista 'tiposTickets'

    } catch (error) {
        console.error('Fallo al obtener detalles del evento:', error);
        document.getElementById('event-details-card').innerHTML = `<h2 style="color: red;">❌ Error al conectar con el servidor. ${error.message}</h2>`;
    }
}

function renderEventCard(event) {
    const cardElement = document.getElementById('event-details-card');
    
    // Formato de fecha
    const date = new Date(event.fechaHora);
    const formattedDate = date.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    cardElement.innerHTML = `
        <img src="${event.imagenUrl || 'img/default_show.jpg'}" alt="${event.nombre}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 10px;">
        <div class="card-details" style="padding: 20px 0;">
            <h1 style="color: #7d00ff;">${event.nombre}</h1>
            <p style="font-size: 1.1em; margin: 10px 0;">
                <i class="fa-solid fa-calendar-alt"></i> ${formattedDate} a las ${formattedTime}
            </p>
            <p style="font-size: 1.1em; margin: 10px 0;">
                <i class="fa-solid fa-location-dot"></i> ${event.lugar}
            </p>
            <p style="margin-top: 20px;">${event.descripcion || 'Descripción del evento no disponible.'}</p>
            <hr style="border-color: #333; margin: 20px 0;">
            <p>Duración estimada: **${event.duracionMinutos} minutos**</p>
            <p>Capacidad Total: **${event.capacidad || 'N/A'}**</p>
        </div>
    `;
}

// --- PASO 2: RENDERIZAR OPCIONES DE COMPRA ---

function renderTicketSelection(tiposTickets) {
    const selectionArea = document.getElementById('ticket-selection-area');
    selectionArea.innerHTML = ''; 

    if (!tiposTickets || tiposTickets.length === 0) {
        selectionArea.innerHTML = '<p style="color: orange;">⚠️ Lo sentimos, los tickets para este evento están agotados o no disponibles.</p>';
        return;
    }

    tiposTickets.forEach(tipo => {
        const isSoldOut = tipo.cantidadDisponible <= 0;
        const buttonText = isSoldOut ? 'AGOTADO' : 'Añadir al Carrito';
        
        // Estructura de cada opción de ticket
        const ticketHtml = `
            <div class="ticket-option" style="background: #1a1a1a; padding: 15px; border-radius: 8px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="color: #fff; margin-bottom: 5px;">${tipo.nombreTipo}</h4>
                    <p style="color: #ccc;">Precio: **$${tipo.precio.toFixed(2)}**</p>
                    <p style="font-size: 0.8em; color: ${isSoldOut ? 'red' : 'green'};">
                        ${isSoldOut ? 'Stock: 0' : `Stock Disponible: ${tipo.cantidadDisponible}`}
                    </p>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="number" min="1" max="${tipo.cantidadDisponible > 10 ? 10 : tipo.cantidadDisponible}" value="1" id="qty-${tipo.id}" style="width: 60px; padding: 5px; background: #333; color: white; border: none; border-radius: 4px;" ${isSoldOut ? 'disabled' : ''}>
                    <button class="button add-ticket-btn" data-id="${tipo.id}" 
                            data-name="${tipo.nombreTipo}" 
                            data-price="${tipo.precio}" 
                            ${isSoldOut ? 'disabled' : ''}
                            style="padding: 10px 15px; background-color: ${isSoldOut ? '#444' : '#7d00ff'};">
                        ${buttonText}
                    </button>
                </div>
            </div>
        `;
        selectionArea.insertAdjacentHTML('beforeend', ticketHtml);
    });
    
    // Añadir listeners a todos los botones "Añadir al Carrito"
    document.querySelectorAll('.add-ticket-btn').forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });
}

// --- PASO 3: LÓGICA DEL CARRITO (Añadir/Actualizar) ---

function handleAddToCart(e) {
    const idTipoTicket = parseInt(e.currentTarget.getAttribute('data-id'));
    const nombreTipo = e.currentTarget.getAttribute('data-name');
    const precio = parseFloat(e.currentTarget.getAttribute('data-price'));
    const qtyInput = document.getElementById(`qty-${idTipoTicket}`);
    const cantidad = parseInt(qtyInput.value);

    if (cantidad < 1 || isNaN(cantidad)) {
        document.getElementById('message-area').textContent = '⚠️ Selecciona una cantidad válida.';
        return;
    }

    document.getElementById('message-area').textContent = '';

    const existingItemIndex = cart.findIndex(item => item.idTipoTicket === idTipoTicket);

    if (existingItemIndex > -1) {
        // El ticket ya está en el carrito, se suma la cantidad
        cart[existingItemIndex].cantidad += cantidad;
    } else {
        // Nuevo ticket en el carrito
        cart.push({ idTipoTicket, nombreTipo, precio, cantidad });
    }
    
    // Almacenar el carrito en localStorage para que index.html también lo vea (opcional)
    localStorage.setItem('cart', JSON.stringify(cart));
    
    renderCart();
    qtyInput.value = 1; // Resetear el input
    alert(`Se añadieron ${cantidad} tickets de ${nombreTipo} al carrito.`);
}

function renderCart() {
    const cartItemsElement = document.getElementById('cart-items');
    let subtotal = 0;
    cartItemsElement.innerHTML = '';

    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999;">Aún no hay tickets</td></tr>';
        document.getElementById('checkout-btn').disabled = true;
        document.getElementById('cart-subtotal').textContent = `$0`;
        document.getElementById('cart-total').textContent = `$0`;
        return;
    }
    
    cart.forEach(item => {
        const itemTotal = item.precio * item.cantidad;
        subtotal += itemTotal;
        
        const row = `
            <tr>
                <td>${item.nombreTipo}</td>
                <td>$${item.precio.toFixed(2)}</td>
                <td>${item.cantidad}</td>
            </tr>
        `;
        cartItemsElement.insertAdjacentHTML('beforeend', row);
    });
    
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    // Aquí podrías añadir impuestos o tasas
    document.getElementById('cart-total').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkout-btn').disabled = false;
}

// --- PASO 4: LÓGICA DE CHECKOUT (Placeholder) ---

function handleCheckout() {
    // Aquí es donde el Frontend enviaría la lista de tickets (el objeto 'cart') 
    // al endpoint POST /api/tickets para iniciar la compra real.
    
    // La API de Java:
    // 1. Verificará el stock final.
    // 2. Procesará el pago (Patrón Strategy).
    // 3. Generará los códigos QR.
    // 4. Devolverá el éxito.
    
    alert('🛒 Iniciar Proceso de Compra Real...');
    // window.location.href = 'checkout.html'; // Redirigir a una página de pago dedicada.
}