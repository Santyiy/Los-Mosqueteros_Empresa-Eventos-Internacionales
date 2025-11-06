// ... (código anterior de llenado de navegación y logout) ...

    // Control de Acceso de ADMINISTRADOR
    if (window.location.pathname.includes('admin/')) {
        // Usamos '=== 'false'' porque localStorage guarda todo como string
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        
        if (!token || !isAdmin) {
            // Si no hay token o no es admin, bloqueamos el acceso
            alert("Acceso denegado. No eres administrador o tu sesión ha expirado.");
            // La redirección usa '../' para salir de la carpeta 'admin'
            window.location.href = '../index.html'; 
        }
    };