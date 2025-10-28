<?php
// /venta_tickets_project/admin/gestionar_shows.php
session_start();
require_once('../config/database.php');

if (!isset($_SESSION["loggedin"]) || $_SESSION["is_admin"] !== true) {
    header("location: ../cuenta/login.php?error=Acceso Denegado");
    exit;
}

$mensaje = '';

// --- PROCESAR ELIMINAR SHOW ---
if(isset($_GET['action']) && $_GET['action'] == 'delete' && isset($_GET['show_id'])){
    $show_id = (int)$_GET['show_id'];

    if ($show_id > 0) {
        $sql = "DELETE FROM shows WHERE id = ?";
        
        if($stmt = $mysqli->prepare($sql)){
            $stmt->bind_param("i", $show_id);
            
            if($stmt->execute()){
                $mensaje = "<p style='color: green;'>Show ID {$show_id} eliminado con éxito, incluyendo su stock asociado.</p>";
            } else {
                $mensaje = "<p style='color: red;'>Error al eliminar show: " . $stmt->error . "</p>";
            }
            $stmt->close();
        }
    }
}

// --- PROCESAR AGREGAR SHOW (Con ruta 'img/') ---
if($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action']) && $_POST['action'] == 'add_show'){
    
    $nombre = trim($_POST['nombre']);
    $lugar = trim($_POST['lugar']);
    $fecha_hora = trim($_POST['fecha_hora']);
    $descripcion = trim($_POST['descripcion']);
    $imagen_url = 'img/default.jpg'; 

    // Manejo de la subida de archivos
    if (isset($_FILES["imagen_portada"]) && $_FILES["imagen_portada"]["error"] == 0) {
        
        $target_dir = realpath(__DIR__ . '/../img/');
        
        if ($target_dir && is_dir($target_dir)) {
            
            $file_extension = strtolower(pathinfo($_FILES["imagen_portada"]["name"], PATHINFO_EXTENSION));
            $new_file_name = uniqid('show_', true) . '.' . $file_extension;
            $target_file = $target_dir . '/' . $new_file_name; 

            if (move_uploaded_file($_FILES["imagen_portada"]["tmp_name"], $target_file)) {
                $imagen_url = "img/" . $new_file_name; 
            } else {
                $mensaje = "<p style='color: red;'>Error: Hubo un problema al subir el archivo (Verifique permisos).</p>";
            }
        }
    }
    
    if (strpos($mensaje, 'Error:') === false) { 
        $sql = "INSERT INTO shows (nombre, lugar, fecha_hora, descripcion, imagen_url) VALUES (?, ?, ?, ?, ?)"; 
        
        if($stmt = $mysqli->prepare($sql)){
            $stmt->bind_param("sssss", $nombre, $lugar, $fecha_hora, $descripcion, $imagen_url); 
            
            if(!$stmt->execute()){
                $mensaje = "<p style='color: red;'>Error al agregar el show: " . $stmt->error . "</p>";
            } else {
                 $mensaje = "<p style='color: green;'>Show '{$nombre}' agregado con éxito! Imagen guardada en: {$imagen_url}</p>";
            }
            $stmt->close();
        }
    }
}

// --- OBTENER SHOWS PARA LA TABLA ---
$current_shows = [];
$sql_current = "SELECT id, nombre, lugar, fecha_hora, imagen_url FROM shows ORDER BY fecha_hora DESC";
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
    <title>Gestionar Shows</title>
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
            <li><a href="index.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
            <li><a href="gestionar_shows.php" class="active"><i class="fas fa-calendar-alt"></i> Gestionar Shows</a></li>
            <li><a href="gestionar_stock.php"><i class="fas fa-ticket-alt"></i> Gestionar Stock</a></li>
            <li><a href="../cuenta/logout.php"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a></li>
        </ul>
    </div>
    
    <div class="main-content">
        <div class="container">
            <h1><i class="fas fa-calendar-alt"></i> Gestionar Shows</h1>
            
            <?php echo $mensaje; ?>

            <h2><i class="fas fa-plus-circle"></i> Agregar Nuevo Show</h2>
            <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="action" value="add_show">

                <label for="nombre">Nombre del Show:</label>
                <input type="text" id="nombre" name="nombre" required>

                <label for="lugar">Lugar:</label>
                <select id="lugar" name="lugar" required>
                    <option value="">Seleccione el Lugar</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="Movistar Arena">Movistar Arena</option>
                    <option value="Luna Park">Luna Park</option>
                </select>

                <label for="fecha_hora">Fecha y Hora:</label>
                <input type="datetime-local" id="fecha_hora" name="fecha_hora" required>
                
                <label for="descripcion">Descripción:</label>
                <textarea id="descripcion" name="descripcion" rows="4"></textarea>

                <label for="imagen_portada">Subir Imagen de Portada (JPG/PNG, máx. 5MB):</label>
                <input type="file" id="imagen_portada" name="imagen_portada" accept="image/*" required>

                <button type="submit" class="btn btn-green">Crear Show</button>
            </form>
            
            <hr>

            <h2><i class="fas fa-list-alt"></i> Shows Existentes (Editar/Eliminar)</h2>

            <?php if (empty($current_shows)): ?>
                <p style='color: orange;'>No hay shows cargados en el sistema.</p>
            <?php else: ?>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Lugar</th>
                            <th>Fecha/Hora</th>
                            <th>Imagen</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($current_shows as $show): ?>
                            <tr>
                                <td><?php echo $show['id']; ?></td>
                                <td><?php echo htmlspecialchars($show['nombre']); ?></td>
                                <td><?php echo htmlspecialchars($show['lugar']); ?></td>
                                <td><?php echo date('d/m/Y H:i', strtotime($show['fecha_hora'])); ?></td>
                                <td>
                                    <img src="../<?php echo htmlspecialchars($show['imagen_url']); ?>" alt="Portada" class="card-image-thumb">
                                </td>
                                <td>
                                    <a href="editar_show.php?id=<?php echo $show['id']; ?>" class="btn btn-primary btn-sm" title="Editar Show">
                                        <i class="fas fa-edit"></i> Editar
                                    </a>
                                    
                                    <a href="gestionar_shows.php?action=delete&show_id=<?php echo $show['id']; ?>" 
                                       onclick="return confirm('¿Está seguro de que desea eliminar este SHOW? Se eliminará todo el stock asociado.');"
                                       class="btn btn-danger btn-sm" title="Eliminar Show">
                                        <i class="fas fa-trash-alt"></i> Eliminar
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
            
        </div>
    </div>
</body>
</html>
<?php $mysqli->close(); ?>