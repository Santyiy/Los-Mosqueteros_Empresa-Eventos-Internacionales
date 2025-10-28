<?php
// /venta_tickets_project/admin/gestionar_stock.php
session_start();
require_once('../config/database.php');

if (!isset($_SESSION["loggedin"]) || $_SESSION["is_admin"] !== true) {
    header("location: ../cuenta/login.php?error=Acceso Denegado");
    exit;
}

$mensaje = '';

// --- 1. PROCESAR AGREGAR STOCK (Se mantiene igual) ---
if($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action']) && $_POST['action'] == 'add_stock'){
    
    $show_id = (int)$_POST['show_id'];
    $nombre_ticket = trim($_POST['nombre_ticket']);
    $precio = (float)$_POST['precio'];
    $cantidad = (int)$_POST['cantidad'];
    
    if ($show_id > 0 && $precio > 0 && $cantidad >= 0) {
        $sql = "INSERT INTO tickets_stock (show_id, nombre_ticket, precio, cantidad_disponible) VALUES (?, ?, ?, ?)";
        
        if($stmt = $mysqli->prepare($sql)){
            $stmt->bind_param("isdi", $show_id, $nombre_ticket, $precio, $cantidad);
            
            if($stmt->execute()){
                $mensaje = "<p style='color: green;'>Stock '{$nombre_ticket}' agregado para el Show ID {$show_id}.</p>";
            } else {
                $mensaje = "<p style='color: red;'>Error al agregar stock: " . $stmt->error . "</p>";
            }
            $stmt->close();
        } else {
            $mensaje = "<p style='color: red;'>Error en la preparación de la consulta SQL.</p>";
        }
    } else {
        $mensaje = "<p style='color: red;'>Datos inválidos. Asegúrese de que el precio y la cantidad sean correctos.</p>";
    }
}


// --- 2. PROCESAR ELIMINAR STOCK (¡NUEVA FUNCIONALIDAD!) ---
if(isset($_GET['action']) && $_GET['action'] == 'delete_stock' && isset($_GET['stock_id'])){
    $stock_id = (int)$_GET['stock_id'];

    if ($stock_id > 0) {
        $sql = "DELETE FROM tickets_stock WHERE id = ?";
        
        if($stmt = $mysqli->prepare($sql)){
            $stmt->bind_param("i", $stock_id);
            
            if($stmt->execute()){
                $mensaje = "<p style='color: green;'>Stock ID {$stock_id} eliminado con éxito.</p>";
            } else {
                $mensaje = "<p style='color: red;'>Error al eliminar stock: " . $stmt->error . "</p>";
            }
            $stmt->close();
        } else {
            $mensaje = "<p style='color: red;'>Error en la preparación de la consulta SQL para eliminar.</p>";
        }
    } else {
        $mensaje = "<p style='color: red;'>ID de stock inválido para eliminar.</p>";
    }
}


// --- 3. OBTENER LISTA DE SHOWS Y STOCK ACTUAL (Se mantiene igual) ---
// Obtener todos los shows para el formulario de selección
$shows_list = [];
$sql_shows = "SELECT id, nombre, lugar, fecha_hora FROM shows ORDER BY fecha_hora DESC";
if ($result = $mysqli->query($sql_shows)) {
    while ($row = $result->fetch_assoc()) {
        // Formatear la fecha para la visualización
        $fecha_formateada = date('d/m/Y H:i', strtotime($row['fecha_hora']));
        $row['display_name'] = htmlspecialchars($row['nombre'] . ' (' . $row['lugar'] . ' - ' . $fecha_formateada . ')');
        $shows_list[] = $row;
    }
}

// Obtener el stock detallado por show
$stock_details = [];
$sql_stock = "
    SELECT 
        ts.id AS stock_id, 
        ts.nombre_ticket, 
        ts.precio, 
        ts.cantidad_disponible, 
        s.nombre AS show_nombre 
    FROM 
        tickets_stock ts
    INNER JOIN 
        shows s ON ts.show_id = s.id
    ORDER BY 
        s.fecha_hora DESC, ts.precio ASC";

if ($result = $mysqli->query($sql_stock)) {
    while ($row = $result->fetch_assoc()) {
        $stock_details[] = $row;
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Gestionar Stock de Tickets</title>
    <link rel="stylesheet" href="../css/style_admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>
<body>
    <div class="container">
        <h1>Gestionar Stock de Tickets</h1>
        <p><a href="index.php">← Volver al Panel</a></p>
        
        <?php echo $mensaje; ?>

        <h2><i class="fas fa-plus-circle"></i> Agregar Nuevo Tipo de Ticket/Stock</h2>
        
        <?php if (empty($shows_list)): ?>
            <p style='color: orange;'>⚠️ Primero debe crear shows en "Gestionar Shows" antes de agregar stock.</p>
        <?php else: ?>

            <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="POST" class="form-stock">
                <input type="hidden" name="action" value="add_stock">

                <label for="show_id">Seleccionar Show:</label>
                <select id="show_id" name="show_id" required>
                    <option value="">-- Elija un Show --</option>
                    <?php foreach ($shows_list as $show): ?>
                        <option value="<?php echo $show['id']; ?>">
                            <?php echo $show['display_name']; ?>
                        </option>
                    <?php endforeach; ?>
                </select><br><br>

                <label for="nombre_ticket">Nombre del Ticket (Ej: VIP, General):</label>
                <input type="text" id="nombre_ticket" name="nombre_ticket" required><br><br>

                <label for="precio">Precio Unitario ($):</label>
                <input type="number" id="precio" name="precio" step="0.01" min="0" required><br><br>

                <label for="cantidad">Cantidad Inicial de Stock:</label>
                <input type="number" id="cantidad" name="cantidad" min="0" required><br><br>

                <button type="submit" class="btn btn-green">Añadir Stock</button>
            </form>
        <?php endif; ?>

        <hr>

        <h2><i class="fas fa-list-alt"></i> Stock de Tickets Existente</h2>

        <?php if (empty($stock_details)): ?>
            <p style='color: orange;'>No hay stock de tickets cargado en el sistema.</p>
        <?php else: ?>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Show</th>
                        <th>Tipo de Ticket</th>
                        <th>Precio</th>
                        <th>Stock Disp.</th>
                        <th>Acciones</th> </tr>
                </thead>
                <tbody>
                    <?php foreach ($stock_details as $stock): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($stock['show_nombre']); ?></td>
                            <td><?php echo htmlspecialchars($stock['nombre_ticket']); ?></td>
                            <td>$<?php echo number_format($stock['precio'], 2, ',', '.'); ?></td>
                            <td class="stock-count"><?php echo htmlspecialchars($stock['cantidad_disponible']); ?></td>
                            <td>
                                <a href="gestionar_stock.php?action=delete_stock&stock_id=<?php echo $stock['stock_id']; ?>" 
                                   onclick="return confirm('¿Está seguro de que desea eliminar este tipo de ticket? Esta acción es irreversible.');"
                                   class="btn btn-sm btn-danger">
                                    <i class="fas fa-trash-alt"></i> Eliminar
                                </a>
                                
                                <button class="btn btn-sm btn-primary" disabled title="La edición requiere una página separada para funcionar">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
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