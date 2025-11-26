

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('main-nav');
    const token = localStorage.getItem('userToken');
    const userName = localStorage.getItem('userName');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    let navHtml = '';

    if (token) {
        navHtml += `
            <a href="cuenta/perfil.html">Hola, **${userName}**</a>
        `;
        
        if (isAdmin) {
            navHtml += `<a href="admin/index.html" class="btn-admin">Admin</a>`;
        }
        
        navHtml += `<a href="#" id="logout-btn" class="btn-logout">Cerrar Sesión</a>`;
    } else {
        navHtml += `
            <a href="cuenta/login.html" class="btn-login">Login</a>
            <a href="cuenta/register.html" class="btn-register">Registro</a>
        `;
    }

    if (nav) {
        nav.innerHTML = navHtml;
    }
    
  
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('userToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('isAdmin');
            window.location.href = 'index.html'; 
        });
    }

    if (window.location.pathname.includes('admin/')) {
        if (!token || !isAdmin) {
            alert("Acceso denegado. No eres administrador o no has iniciado sesión.");
            window.location.href = '../index.html';
        }
    }
});