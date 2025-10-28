<?php
// /venta_tickets_project/admin/editar_show.php
session_start();
require_once('../config/database.php');

if (!isset($_SESSION["loggedin"]) || $_SESSION["is_admin"] !== true) {
    header("location: ../cuenta/login.php?error=Acceso Denegado");
    exit;
}

$mensaje = '';
$show_id = (int)($_GET['id'] ?? 0); // Obtener el ID del show de la URL

// -----------------------------------------------------
// 1. OBTENER DATOS DEL SHOW ANTES DE MOSTRAR EL FORMULARIO
// -----------------------------------------------------
if ($show_id > 0) {
    $sql_fetch = "SELECT id, nombre, lugar, fecha_hora, descripcion, imagen_url FROM shows WHERE id = ?";
    if ($stmt_fetch = $mysqli->prepare($sql_fetch)) {
        $stmt_fetch->bind_param("i", $show_id);
        $stmt_fetch->execute();
        $result = $stmt_fetch->get_result();

        if ($result->num_rows == 1) {
            $show_data = $result->fetch_assoc();
        } else {
            $mensaje = "<p style='color: red;'>Error: Show no encontrado.</p>";
            $show_data = null;
        }
        $stmt_fetch->close();
    } else {
        $mensaje = "<p style='color: red;'>Error en la preparación de la consulta de lectura.</p>";
    }
} else {
    $mensaje = "<p style='color: red;'>ID de Show inválido.</p>";
    $show_data = null;
}


// -----------------------------------------------------
// 2. PROCESAR LA ACTUALIZACIÓN DEL FORMULARIO
// -----------------------------------------------------
if($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['action']) && $_POST['action'] == 'update_show' && $show_data){
    
    $nombre = trim($_POST['nombre']);
    $lugar = trim($_POST['lugar']);
    $fecha_hora = trim($_POST['fecha_hora']);
    $descripcion = trim($_POST['descripcion']);
    
    // Si no se sube una nueva imagen, mantenemos la existente
    $imagen_url = $show_data['imagen_url']; 

    // --- MANEJO DE LA SUBIDA DE NUEVA IMAGEN ---
    if (isset($_FILES["imagen_portada"]) && $_FILES["imagen_portada"]["error"] == 0) {
        
        $target_dir = realpath(__DIR__ . '/../img/');
        
        if ($target_dir && is_dir($target_dir)) {
            $file_extension = strtolower(pathinfo($_FILES["imagen_portada"]["name"], PATHINFO_EXTENSION));
            $new_file_name = uniqid('show_', true) . '.' . $file_extension;
            $target_file = $target_dir . '/' . $new_file_name; 

            // Subir la nueva imagen
            if (move_uploaded_file($_FILES["imagen_portada"]["tmp_name"], $target_file)) {
                $imagen_url = "img/" . $new_file_name;
                
                // Opcional: Eliminar la imagen antigua si no es la por defecto
                if ($show_data['imagen_url'] != 'img/default.jpg' && file_exists('../' . $show_data['imagen_url'])) {
                    unlink('../' . $show_data['imagen_url']);
                }
            } else {
                $mensaje = "<p style='color: red;'>Error al subir la nueva imagen.</p>";
            }
        }
    }
    
    // Si no hubo errores de subida, actualizamos la BDD
    if (strpos($mensaje, 'Error:') === false) { 
        $sql_update = "UPDATE shows SET nombre=?, lugar=?, fecha_hora=?, descripcion=?, imagen_url=? WHERE id=?";
        
        if($stmt_update = $mysqli->prepare($sql_update)){
            $stmt_update->bind_param("sssssi", $nombre, $lugar, $fecha_hora, $descripcion, $imagen_url, $show_id); 
            
            if($stmt_update->execute()){
                $mensaje = "<p style='color: green;'>Show '{$nombre}' actualizado con éxito!</p>";
                
                // Recargar los datos actualizados para el formulario
                $show_data['nombre'] = $nombre;
                $show_data['lugar'] = $lugar;
                $show_data['fecha_hora'] = $fecha_hora;
                $show_data['descripcion'] = $descripcion;
                $show_data['imagen_url'] = $imagen_url;

            } else {
                $mensaje = "<p style='color: red;'>Error al actualizar el show: " . $stmt_update->error . "</p>";
            }
            $stmt_update->close();
        }
    }
}

// -----------------------------------------------------
// 3. ESTRUCTURA HTML (Muestra el formulario si show_data existe)
// -----------------------------------------------------

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Editar Show ID: <?php echo $show_id; ?></title>
    <link rel="stylesheet" href="../css/style_admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>
<body>
    
    <div class="sidebar">
        <h2>Admin</h2>
        <ul class="sidebar-menu">
            <li><a href="index.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
            <li><a href="gestionar_shows.php" class="active"><i class="fas fa-calendar-alt"></i> Gestionar Shows</a></li>
            <li><a href="gestionar_stock.php"><i class="fas fa-ticket-alt"></i> Gestionar Stock</a></li>
            <li><a href="../cuenta/logout.php"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a></li>
        </ul>
    </div>
    
    <div class="main-content">
        <div class="container">
            <h1><i class="fas fa-edit"></i> Editar Show</h1>
            <p><a href="gestionar_shows.php">← Volver a Gestionar Shows</a></p>
            
            <?php echo $mensaje; ?>

            <?php if ($show_data): ?>
                <h2>Editando: <?php echo htmlspecialchars($show_data['nombre']); ?> (ID: <?php echo $show_data['id']; ?>)</h2>
                
                <form action="editar_show.php?id=<?php echo $show_id; ?>" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="action" value="update_show">

                    <label for="nombre">Nombre del Show:</label>
                    <input type="text" id="nombre" name="nombre" value="<?php echo htmlspecialchars($show_data['nombre']); ?>" required>

                    <label for="lugar">Lugar:</label>
                    <select id="lugar" name="lugar" required>
                        <?php 
                        $lugares = ['Buenos Aires', 'Movistar Arena', 'Luna Park'];
                        foreach ($lugares as $lugar) {
                            $selected = ($lugar == $show_data['lugar']) ? 'selected' : '';
                            echo "<option value=\"{$lugar}\" {$selected}>{$lugar}</option>";
                        }
                        ?>
                    </select>

                    <label for="fecha_hora">Fecha y Hora:</label>
                    <?php 
                        // Formatear la fecha para el input datetime-local
                        $fecha_formato = date('Y-m-d\TH:i', strtotime($show_data['fecha_hora']));
                    ?>
                    <input type="datetime-local" id="fecha_hora" name="fecha_hora" value="<?php echo $fecha_formato; ?>" required>
                    
                    <label for="descripcion">Descripción:</label>
                    <textarea id="descripcion" name="descripcion" rows="4"><?php echo htmlspecialchars($show_data['descripcion']); ?></textarea>

                    <label>Imagen Actual:</label>
                    <div style="margin-bottom: 15px;">
                        <img src="../<?php echo htmlspecialchars($show_data['imagen_url']); ?>" alt="Portada Actual" class="card-image-thumb" style="width: 150px; height: auto;">
                    </div>

                    <label for="imagen_portada">Subir Nueva Imagen de Portada (Opcional):</label>
                    <input type="file" id="imagen_portada" name="imagen_portada" accept="image/*">

                    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                    <a href="gestionar_shows.php" class="btn btn-danger">Cancelar</a>
                </form>

            <?php elseif (!$mensaje): ?>
                <p style='color: orange;'>Debe seleccionar un Show para editar.</p>
            <?php endif; ?>
            
        </div>
    </div>
</body>
</html>
<?php $mysqli->close(); ?>