<?php
// /venta_tickets_project/admin/index.php
session_start();

if (!isset($_SESSION["loggedin"]) || $_SESSION["is_admin"] !== true) {
    header("location: ../cuenta/login.php");
    exit;
}

require_once('../config/database.php');

// Obtener datos básicos para las métricas (ejemplo)
$total_shows = $mysqli->query("SELECT COUNT(id) FROM shows")->fetch_row()[0] ?? 0;
$total_tickets = $mysqli->query("SELECT SUM(cantidad_disponible) FROM tickets_stock")->fetch_row()[0] ?? 0;
$shows_activos = $mysqli->query("SELECT COUNT(DISTINCT show_id) FROM tickets_stock")->fetch_row()[0] ?? 0;

// Obtener los shows para la tabla de acceso rápido
$current_shows = [];
$sql_current = "SELECT id, nombre, lugar, fecha_hora, imagen_url FROM shows ORDER BY fecha_hora DESC LIMIT 5";
if ($result = $mysqli->query($sql_current)) {
    while ($row = $result->fetch_assoc()) {
        $current_shows[] = $row;
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Panel de Administración</title>
    <link rel="stylesheet" href="../css/style_admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>
<body>
    
    <div class="sidebar">
        <h2>Admin</h2>
        <div class="user-info" style="justify-content: center; margin-bottom: 40px; color: #fff;">
            <i class="fas fa-user-circle fa-2x"></i>
            <span style="font-weight: bold;">Hola, <?php echo htmlspecialchars($_SESSION["nombre_apellido"] ?? 'Admin'); ?></span>
        </div>

        <ul class="sidebar-menu">
            <li><a href="index.php" class="active"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
            <li><a href="gestionar_shows.php"><i class="fas fa-calendar-alt"></i> Gestionar Shows</a></li>
            <li><a href="gestionar_stock.php"><i class="fas fa-ticket-alt"></i> Gestionar Stock</a></li>
            <li><a href="../cuenta/logout.php"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a></li>
        </ul>
    </div>

    <div class="main-content">
        <div class="header-bar">
            <h1>Dashboard Principal</h1>
        </div>

        <div class="metrics-grid">
            <div class="metric-card">
                <p>Total de Shows</p>
                <strong><?php echo number_format($total_shows, 0); ?></strong>
            </div>
            <div class="metric-card" style="border-left-color: #e67e22;">
                <p>Shows con Stock</p>
                <strong><?php echo number_format($shows_activos, 0); ?></strong>
            </div>
            <div class="metric-card" style="border-left-color: #27ae60;">
                <p>Stock Total Disponible</p>
                <strong><?php echo number_format($total_tickets, 0); ?></strong>
            </div>
            <div class="metric-card" style="border-left-color: #9b59b6;">
                <p>Métricas de Venta</p>
                <strong>N/A</strong>
            </div>
        </div>
        
        <hr>

        <h2><i class="fas fa-calendar-check"></i> Últimos Shows Creados</h2>
        <p><a href="gestionar_shows.php">Ver todos y crear nuevos shows →</a></p>

        <?php if (empty($current_shows)): ?>
            <p style='color: orange;'>No hay shows cargados en el sistema.</p>
        <?php else: ?>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Lugar</th>
                        <th>Fecha/Hora</th>
                        <th>Imagen</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($current_shows as $show): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($show['nombre']); ?></td>
                            <td><?php echo htmlspecialchars($show['lugar']); ?></td>
                            <td><?php echo date('d/m/Y H:i', strtotime($show['fecha_hora'])); ?></td>
                            <td>
                                <img src="../<?php echo htmlspecialchars($show['imagen_url']); ?>" alt="Portada" class="card-image-thumb">
                            </td>
                            <td>
                                <a href="gestionar_shows.php?action=edit&id=<?php echo $show['id']; ?>" class="btn btn-primary btn-sm"><i class="fas fa-edit"></i> Editar</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
        
    </div>
</body>
</html>
<?php $mysqli->close(); ?>