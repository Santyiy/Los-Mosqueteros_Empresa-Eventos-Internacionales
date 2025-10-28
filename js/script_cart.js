// /js/script_cart.js
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SELECTORES CRÍTICOS
    const cartItemsContainer = document.getElementById('cart-items');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartTotalElement = document.getElementById('cart-total');

    let cart = JSON.parse(localStorage.getItem('ticketCart')) || [];

    // --- FUNCIONES ---

    function saveCart() {
        localStorage.setItem('ticketCart', JSON.stringify(cart));
    }

    function addUpdateListeners() {
        cartItemsContainer.querySelectorAll('.cart-update-btn').forEach(button => {
            button.removeEventListener('click', handleUpdateQuantity); 
            button.addEventListener('click', handleUpdateQuantity);
        });
    }

    function handleUpdateQuantity(event) {
        const button = event.target.closest('.cart-update-btn');
        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;
        const itemIndex = cart.findIndex(item => item.id === id);

        if (itemIndex === -1) return;

        if (action === 'increase') {
            cart[itemIndex].cantidad += 1;
        } else if (action === 'decrease') {
            cart[itemIndex].cantidad -= 1;
            
            if (cart[itemIndex].cantidad <= 0) {
                cart.splice(itemIndex, 1);
            }
        }

        saveCart();
        renderCart();
    }
    
    function addItemToCart(id, nombre, precio) {
        const itemIndex = cart.findIndex(item => item.id === id);

        if (itemIndex !== -1) {
            cart[itemIndex].cantidad += 1;
        } else {
            cart.push({ id, nombre, precio: parseFloat(precio), cantidad: 1 });
        }

        saveCart();
        renderCart();
    }


    /**
     * Renderiza el carrito actual en el HTML y calcula el total.
     */
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align: center; padding: 20px; font-size: 0.9em; color:#bbb;">El carrito está vacío.</td>
                </tr>
            `;
            checkoutBtn.disabled = true; 
        } else {
            cart.forEach(item => {
                const row = document.createElement('tr');
                const totalItemPrice = item.precio * item.cantidad;
                total += totalItemPrice; 

                row.innerHTML = `
                    <td>${item.nombre}</td>
                    <td>$${totalItemPrice.toLocaleString('es-AR')}</td>
                    <td>
                        <div style="display:flex; justify-content:center; gap:5px;">
                            <button class="cart-update-btn" data-id="${item.id}" data-action="decrease">-</button>
                            <span>${item.cantidad}</span>
                            <button class="cart-update-btn" data-id="${item.id}" data-action="increase">+</button>
                        </div>
                    </td>
                `;
                cartItemsContainer.appendChild(row);
            });
            checkoutBtn.disabled = false;
            addUpdateListeners();
        }

        cartTotalElement.textContent = `$${total.toLocaleString('es-AR')}`;
    }

    
    /**
     * Lógica AJAX para enviar la orden a process_order.php
     */
    function processCheckout() {
        if (cart.length === 0) {
            alert("El carrito está vacío.");
            return;
        }
        
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Procesando...';

        // Enviar datos al script PHP
        fetch('process_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cart),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`¡Compra Exitosa! Total: $${data.total.toLocaleString('es-AR')}.`);
                cart = [];
                saveCart();
                renderCart();
            } else {
                alert(`Error en la compra: ${data.message || 'Error desconocido en el servidor.'}`);
            }
        })
        .catch(error => {
            console.error('Error al procesar la compra:', error);
            alert('Error de conexión con el servidor. Intente nuevamente.');
        })
        .finally(() => {
            checkoutBtn.disabled = (cart.length === 0);
            checkoutBtn.textContent = 'Finalizar Compra';
        });
    }


    // --- ASIGNACIÓN DE EVENTOS INICIALES ---

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const id = button.dataset.id;
            const nombre = button.dataset.nombre;
            const precio = button.dataset.precio;
            addItemToCart(id, nombre, precio);
        });
    });

    checkoutBtn.addEventListener('click', processCheckout);

    // Cargar el carrito al inicio
    renderCart();
});