<?php
// /venta_tickets_project/index.php
session_start();
require_once('config/database.php'); 

// 1. OBTENER EL FILTRO DE LUGAR
$filtro_lugar = null;
if (isset($_GET['lugar'])) {
    $filtro_lugar = htmlspecialchars(trim($_GET['lugar']));
}

// 2. CONSTRUIR LA CONSULTA SQL
$where_clause = $filtro_lugar ? " WHERE s.lugar = ? " : "";
$titulo_seccion = $filtro_lugar ? "Shows en " . $filtro_lugar : "Recomendaciones:";

$sql = "
    SELECT 
        s.id AS show_id, s.nombre AS show_nombre, s.lugar, s.imagen_url,
        MIN(ts.precio) AS precio_desde 
    FROM 
        shows s
    INNER JOIN 
        tickets_stock ts ON s.id = ts.show_id
    {$where_clause}
    GROUP BY
        s.id, s.nombre, s.lugar, s.imagen_url
    ORDER BY 
        s.fecha_hora ASC
";

$shows = [];
if ($stmt = $mysqli->prepare($sql)) {
    if ($filtro_lugar) {
        $stmt->bind_param("s", $filtro_lugar);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $shows[] = $row;
    }
    $stmt->close();
}
$mysqli->close();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Venta de Tickets - <?php echo $titulo_seccion; ?></title>
    <link rel="stylesheet" href="css/style_index.css"> 
</head>
<body>
    <header>
        <a href="index.php" class="logo">QUANTUM</a> 
        <nav>
            <?php if (isset($_SESSION["loggedin"])): ?>
                <span>Hola, **<?php echo htmlspecialchars($_SESSION["nombre_apellido"]); ?>**</span>
                <?php if (isset($_SESSION["is_admin"]) && $_SESSION["is_admin"] === true): ?>
                    <a href="admin/index.php" class="btn-admin">Admin</a>
                <?php endif; ?>
                <a href="cuenta/logout.php" class="btn-logout">Cerrar Sesión</a>
            <?php else: ?>
                <a href="cuenta/login.php" class="btn-login">Login</a>
                <a href="cuenta/register.php" class="btn-register">Registro</a>
            <?php endif; ?>
        </nav>
    </header>

    <div class="header-images">
        <a href="index.php?lugar=Movistar Arena" class="filter-link">
            <img src="img/logos/MovistarArena.png" alt="Movistar Arena">
        </a>
        <a href="index.php?lugar=Buenos Aires" class="filter-link">
            <img src="img/logos/BuenosAires.png" alt="Buenos Aires">
        </a>
        <a href="index.php?lugar=Luna Park" class="filter-link">
            <img src="img/logos/LunaPark.png" alt="Luna Park">
        </a>
    </div>

    <main class="container">
        <div class="content-wrapper">

            <div class="shows-section">
                <h2><?php echo $titulo_seccion; ?></h2>
                <div class="card-grid">
                    <?php if (empty($shows)): ?>
                        <p class="no-shows">No hay shows disponibles para la venta.</p>
                    <?php else: ?>
                        <?php foreach ($shows as $show): ?>
                            <div class="show-card">
                                <img src="<?php echo htmlspecialchars($show['imagen_url'] ?? 'img/default.jpg'); ?>" alt="<?php echo htmlspecialchars($show['show_nombre']); ?>" class="card-image">
                                
                                <div class="card-details">
                                    <p class="show-title">Show <?php echo htmlspecialchars($show['show_nombre']); ?></p>
                                    <div class="ratings">⭐⭐⭐⭐⭐</div>
                                    <p class="price">Desde $<?php echo number_format($show['precio_desde'], 0, ',', '.'); ?> </p>
                                    
                                    <a href="#" 
                                       class="add-to-cart-btn" 
                                       data-id="<?php echo $show['show_id']; ?>" 
                                       data-nombre="Show <?php echo htmlspecialchars($show['show_nombre']); ?>"
                                       data-precio="<?php echo htmlspecialchars($show['precio_desde']); ?>"
                                    >Añadir al carrito</a>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>

            <div class="cart-section">
                <div class="cart-header">Carrito</div>
                <div class="cart-table-wrapper">
                    <table>
                        <thead><tr><th>Nombre</th><th>Precio</th><th>Cant</th></tr></thead>
                        <tbody id="cart-items">
                            <tr><td colspan="3" style="text-align: center; padding: 20px; font-size: 0.9em; color:#bbb;">El carrito está vacío.</td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="cart-footer">
                    <p>Total: <span id="cart-total">$0</span></p>
                    <button id="checkout-btn" class="btn-checkout" disabled>Finalizar Compra</button>
                </div>
            </div>
        </div>
    </main>

    <footer>
        <p>&copy; <?php echo date("Y"); ?> Venta de Tickets BUE.</p>
    </footer>
    
    <script src="js/script_cart.js"></script> 
</body>
</html>