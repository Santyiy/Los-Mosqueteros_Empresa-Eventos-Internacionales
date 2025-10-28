<?php
// /venta_tickets_project/cuenta/register.php
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Registro de Usuario</title>
    <link rel="stylesheet" href="../css/style.css"> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <div class="main-container active" id="main-container">
        
        <div class="main-container__form-box welcome-box">
            <h2 class="welcome-box__title">WELCOME!</h2>
            <p class="welcome-box__text">
                Crea tu cuenta para acceder a la compra de tickets de tus shows favoritos.
            </p>
        </div>

        <div class="main-container__form-box form-box register-box">
            <h2 class="form-box__title">Sign Up</h2> 
            
            <form action="register_process.php" method="POST">
                
                <div class="input-box">
                    <label for="full_name">Nombre y Apellido</label>
                    <input type="text" id="full_name" name="full_name" required>
                    <i class="fa-solid fa-user icon"></i>
                </div>

                <div class="input-box">
                    <label for="phone">Número Teléfono</label>
                    <input type="tel" id="phone" name="phone" required>
                    <i class="fa-solid fa-phone icon"></i>
                </div>

                <div class="input-box">
                    <label for="email">Gmail</label>
                    <input type="email" id="email" name="email" required>
                    <i class="fa-solid fa-envelope icon"></i>
                </div>

                <div class="input-box">
                    <label for="document">Documento (DNI/CUIT)</label>
                    <input type="text" id="document" name="document" required>
                    <i class="fa-solid fa-id-card icon"></i>
                </div>

                <div class="input-box">
                    <label for="password_reg">Contraseña</label>
                    <input type="password" id="password_reg" name="password" required>
                    <i class="fa-solid fa-lock icon"></i>
                </div>

                <button type="submit" class="button">Sign Up</button>

                <p class="form-box__link">¿Ya tienes cuenta? <a href="login.php">Login</a></p>
            </form>
        </div>
    </div>
</body>
</html>