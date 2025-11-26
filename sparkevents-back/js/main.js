// /js/main.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("Sistema de Venta de Tickets activo.");

    // --- 1. Lógica para el formulario de compra de tickets ---
    const purchaseForm = document.getElementById('purchase-form');
    if (purchaseForm) {
        
        const quantityInput = document.getElementById('quantity');
        const submitButton = document.getElementById('submit-purchase');
        
        // Función para validar la cantidad de tickets (opcional: usando el stock disponible del HTML)
        function validateQuantity() {
            const currentStock = parseInt(quantityInput.getAttribute('max'));
            const quantity = parseInt(quantityInput.value);
            
            if (isNaN(quantity) || quantity <= 0) {
                alert("Por favor, ingrese una cantidad válida.");
                return false;
            }
            
            if (quantity > currentStock) {
                alert(`Solo quedan ${currentStock} tickets disponibles. Por favor, reduzca la cantidad.`);
                return false;
            }
            return true;
        }

        // Agregar evento de validación antes de enviar el formulario
        purchaseForm.addEventListener('submit', function(e) {
            if (!validateQuantity()) {
                e.preventDefault(); // Detiene el envío si la validación falla
            } else {
                // Confirmación visual antes de enviar
                if (!confirm(`¿Está seguro de comprar ${quantityInput.value} tickets?`)) {
                    e.preventDefault();
                }
            }
        });
    }

    // --- 2. Lógica para el botón "Comprar" en el index.php (si lo usas) ---
    const buyButtons = document.querySelectorAll('.btn-buy-ticket');
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Se puede agregar una animación o una pequeña validación visual
            console.log(`Intentando comprar ticket para Show ID: ${this.dataset.showId}`);
        });
    });

});

// Conecta este script a tu index.php y otras vistas de usuario:
// <script src="js/main.js"></script>