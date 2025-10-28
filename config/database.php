<?php

define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');  
define('DB_NAME', 'evento');

$mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

if($mysqli === false){

    die("ERROR: No se pudo conectar a la base de datos. " . $mysqli->connect_error);
}

$mysqli->set_charset("utf8mb4");

?>