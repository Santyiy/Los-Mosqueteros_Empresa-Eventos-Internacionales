<?php
// /venta_tickets_project/cuenta/register_process.php
require_once('../config/database.php');

if($_SERVER["REQUEST_METHOD"] == "POST"){
    
    // Recolección y Sanitización
    $nombre_apellido = trim($_POST["full_name"]);
    $telefono = trim($_POST["phone"]);
    $email = trim($_POST["email"]);
    $documento = trim($_POST["document"]);
    $contrasena = trim($_POST["password"]);

    // Hash de la Contraseña
    $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);

    // Inserción en BDD
    $sql = "INSERT INTO usuarios (nombre_apellido, telefono, email, documento, contrasena_hash) VALUES (?, ?, ?, ?, ?)";
    
    if($stmt = $mysqli->prepare($sql)){
        $stmt->bind_param("sssss", $nombre_apellido, $telefono, $email, $documento, $contrasena_hash);
        
        if($stmt->execute()){
            header("location: login.php?msg=Registro exitoso. Inicie Sesión.");
            exit();
        } else{
            // Error: si email o documento ya existen
            header("location: register.php?error=El email o documento ya está en uso.");
            exit();
        }

        $stmt->close();
    }
}
$mysqli->close();
?>