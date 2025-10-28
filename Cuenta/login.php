<?php
// /venta_tickets_project/cuenta/login.php
session_start();
$error_msg = isset($_GET['error']) ? htmlspecialchars($_GET['error']) : '';
$success_msg = isset($_GET['msg']) ? htmlspecialchars($_GET['msg']) : '';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Iniciar Sesión</title>
    <link rel="stylesheet" href="../css/style.css"> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <div class="main-container active" id="main-container">
        
        <div class="main-container__form-box welcome-box">
            <h2 class="welcome-box__title">WELCOME BACK!</h2>
            <p class="welcome-box__text">Inicia sesión para acceder a la venta de tickets.</p>
        </div>

        <div class="main-container__form-box form-box login-box">
            <h2 class="form-box__title">Sign In</h2> 
            
            <?php if (!empty($error_msg)): ?>
                <p style="color: #ff4d4d; text-align: center; margin-bottom: 10px;"><?php echo $error_msg; ?></p>
            <?php elseif (!empty($success_msg)): ?>
                <p style="color: #66ff66; text-align: center; margin-bottom: 10px;"><?php echo $success_msg; ?></p>
            <?php endif; ?>

            <form action="login_process.php" method="POST">
                
                <div class="input-box">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                    <i class="fa-solid fa-envelope icon"></i>
                </div>

                <div class="input-box">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                    <i class="fa-solid fa-lock icon"></i>
                </div>

                <button type="submit" class="button">Sign In</button>

                <p class="form-box__link">¿No tienes cuenta? <a href="register.php">Regístrate</a></p>
            </form>
        </div>
    </div>
</body>
</html>