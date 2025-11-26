
    if (window.location.pathname.includes('admin/')) {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        
        if (!token || !isAdmin) {
            alert("Acceso denegado. No eres administrador o tu sesión ha expirado.");
            window.location.href = '../index.html'; 
        }
    };