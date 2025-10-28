<?php
// /venta_tickets_project/process_order.php
session_start();
require_once('config/database.php');

header('Content-Type: application/json');

$response = ['success' => false, 'message' => 'Error desconocido.'];

// 1. Verificar si el usuario está logueado
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    $response['message'] = 'Debe iniciar sesión para realizar una compra.';
    echo json_encode($response);
    exit;
}

$json_data = file_get_contents('php://input');
$cart_items = json_decode($json_data, true);

if (empty($cart_items)) {
    $response['message'] = 'El carrito está vacío o el formato de datos es incorrecto.';
    echo json_encode($response);
    exit;
}

// Iniciar una transacción
$mysqli->begin_transaction();
$order_successful = true;
$total_cost = 0;

try {
    foreach ($cart_items as $item) {
        $show_id = $item['id'];
        $cantidad_comprada = (int)$item['cantidad'];
        
        // Simplicado: busca el ID del ticket_stock más barato asociado al show.
        $sql_find_stock = "SELECT id, precio, cantidad_disponible FROM tickets_stock WHERE show_id = ? ORDER BY precio ASC LIMIT 1";
        $stmt_find = $mysqli->prepare($sql_find_stock);
        $stmt_find->bind_param("i", $show_id);
        $stmt_find->execute();
        $result_find = $stmt_find->get_result();
        
        if ($result_find->num_rows === 0) { $order_successful = false; $response['message'] = "Error: No se encontró stock para el show."; break; }

        $stock_row = $result_find->fetch_assoc();
        $ticket_stock_id = $stock_row['id'];
        $stock_actual = $stock_row['cantidad_disponible'];
        $precio_unitario = $stock_row['precio'];
        $stmt_find->close();

        if ($stock_actual < $cantidad_comprada) {
            $order_successful = false;
            $response['message'] = "Stock insuficiente para {$item['nombre']}. Solo quedan {$stock_actual} unidades.";
            break;
        }

        // Descontar el stock (UPDATE)
        $sql_update = "UPDATE tickets_stock SET cantidad_disponible = cantidad_disponible - ? WHERE id = ?";
        $stmt_update = $mysqli->prepare($sql_update);
        $stmt_update->bind_param("ii", $cantidad_comprada, $ticket_stock_id);
        
        if (!$stmt_update->execute()) {
             $order_successful = false; $response['message'] = "Error al actualizar la base de datos para {$item['nombre']}."; break;
        }
        $stmt_update->close();
        
        $total_cost += ($precio_unitario * $cantidad_comprada);
    }
    
    // Finalizar la Transacción
    if ($order_successful) {
        $mysqli->commit();
        $response['success'] = true;
        $response['message'] = 'Compra completada con éxito.';
        $response['total'] = $total_cost;
    } else {
        $mysqli->rollback();
    }

} catch (Exception $e) {
    $mysqli->rollback();
    $response['message'] = 'Error en el servidor: ' . $e->getMessage();
}

$mysqli->close();
echo json_encode($response);
?>