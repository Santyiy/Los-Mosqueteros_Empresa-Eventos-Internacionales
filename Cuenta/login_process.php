<?php
// /venta_tickets_project/cuenta/login_process.php
session_start();
require_once('../config/database.php'); 

if($_SERVER["REQUEST_METHOD"] == "POST"){
    
    $email = trim($_POST["email"]);
    $password = $_POST["password"]; 
    $login_error = "Credenciales inválidas."; 

    $sql = "SELECT id, nombre_apellido, contrasena_hash, is_admin FROM usuarios WHERE email = ?";
    
    if($stmt = $mysqli->prepare($sql)){
        $stmt->bind_param("s", $param_email);
        $param_email = $email;
        
        if($stmt->execute()){
            $stmt->store_result();
            
            if($stmt->num_rows == 1){                    
                $stmt->bind_result($id, $nombre_apellido, $contrasena_hash, $is_admin);
                
                if($stmt->fetch()){
                    
                    // ======================================================================
                    // === BYPASS TEMPORAL PARA ADM@GMAIL.COM (ELIMINAR EN PRODUCCIÓN) ===
                    // ======================================================================
                    $login_ok = false;
                    
                    if ($email === 'adm@gmail.com' && $password === '123') {
                        $login_ok = true; 
                    } elseif(password_verify($password, $contrasena_hash)){
                        $login_ok = true; 
                    } 
                    // ======================================================================

                    if($login_ok){ 
                        // Iniciar sesión
                        $_SESSION["loggedin"] = true;
                        $_SESSION["id"] = $id;
                        $_SESSION["nombre_apellido"] = $nombre_apellido;
                        $_SESSION["is_admin"] = (bool)$is_admin; 

                        if ($_SESSION["is_admin"] === true) {
                            header("location: ../admin/index.php"); 
                        } else {
                            header("location: ../index.php");
                        }
                        exit; 
                        
                    } else {
                        $login_error = "Contraseña incorrecta.";
                    }
                }
            } else {
                $login_error = "No existe una cuenta con ese email.";
            }
        } else {
            $login_error = "Error interno del servidor.";
        }
        $stmt->close();
    } else {
        $login_error = "Error al preparar la consulta SQL.";
    }
    
    header("location: login.php?error=" . urlencode($login_error));
    exit;
}

$mysqli->close();
?>