-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 07, 2025 at 07:43 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sparkevents`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_GenerarTicketYPago` (IN `p_id_evento` INT, IN `p_id_usuario` INT, IN `p_monto` DECIMAL(10,2), IN `p_metodo_pago` VARCHAR(250), OUT `p_codigo_generado` VARCHAR(250))   BEGIN
    DECLARE v_capacidad_actual INT;
    DECLARE v_ticket_id INT;

    -- Verificar capacidad del evento
    SELECT capacidad INTO v_capacidad_actual
    FROM Events WHERE id = p_id_evento FOR UPDATE; 

    IF v_capacidad_actual > 0 THEN
        UPDATE Events
        SET capacidad = capacidad - 1
        WHERE id = p_id_evento;

        -- Generar Código QR único y registrar Ticket
        SET p_codigo_generado = UUID();
        INSERT INTO Ticket (codigoQR, estado, id_usuario, id_evento)
        VALUES (p_codigo_generado, 'VENDIDO', p_id_usuario, p_id_evento);

        SET v_ticket_id = LAST_INSERT_ID(); 

        -- Registrar el Pago asociado al Ticket
        INSERT INTO Pago (monto, metodo, id_ticket)
        VALUES (p_monto, p_metodo_pago, v_ticket_id);
        
        COMMIT; 
    ELSE
        -- Lanzar error si no hay cupo
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El evento ya no tiene capacidad disponible.';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerReporteVentas` ()   BEGIN
    SELECT 
        E.nombre AS Evento,
        E.fecha AS Fecha,
        COUNT(T.id) AS TotalTicketsVendidos,
        SUM(P.monto) AS IngresoTotal
    FROM 
        evento E
    JOIN 
        tickets T ON E.id = T.id_evento
    JOIN
        pagos P ON T.id = P.id_ticket
    WHERE
        T.estado IN ('VENDIDO', 'USADO')
    GROUP BY 
        E.id, E.nombre, E.fecha
    ORDER BY
        E.fecha DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_RegistrarNuevoUsuario` (IN `p_nombre` VARCHAR(250), IN `p_email` VARCHAR(250), IN `p_contrasena` VARCHAR(250))   BEGIN
    INSERT INTO usuarios (nombre, email, contraseña, rol)
    VALUES (p_nombre, p_email, p_contrasena, 'user');
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ValidarAcceso` (IN `p_codigo_qr` VARCHAR(250), IN `p_dispositivo` VARCHAR(250), OUT `p_validacion_status` VARCHAR(50))   BEGIN
    DECLARE v_estado VARCHAR(250);
    DECLARE v_ticket_id INT;
    
    SELECT id, estado INTO v_ticket_id, v_estado FROM tickets WHERE codigoQR = p_codigo_qr;
    
    IF v_ticket_id IS NULL THEN
        SET p_validacion_status = 'INVALIDO';
    ELSEIF v_estado = 'USADO' THEN
        SET p_validacion_status = 'DUPLICADO';
    ELSEIF v_estado = 'VENDIDO' THEN
        INSERT INTO accesos (dispositivo, id_ticket)
        VALUES (p_dispositivo, v_ticket_id);
        
        UPDATE tickets SET estado = 'USADO' WHERE id = v_ticket_id;
        
        SET p_validacion_status = 'ACCESO_PERMITIDO';
    ELSE
        SET p_validacion_status = 'ESTADO_NO_VALIDO';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_VerificarCapacidadEvento` (IN `p_id_evento` INT, OUT `p_capacidad_disponible` INT)   BEGIN
    SELECT capacidad INTO p_capacidad_disponible
    FROM evento
    WHERE id = p_id_evento;

    IF p_capacidad_disponible IS NULL THEN
        SET p_capacidad_disponible = -1; -- "Evento no encontrado"
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `accesos`
--

CREATE TABLE `accesos` (
  `id` int(11) NOT NULL,
  `dispositivo` varchar(250) DEFAULT NULL,
  `fecha_hora` datetime DEFAULT current_timestamp(),
  `id_ticket` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(250) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `lugar` varchar(250) DEFAULT NULL,
  `capacidad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `eventos`
--

INSERT INTO `eventos` (`id`, `nombre`, `fecha`, `lugar`, `capacidad`) VALUES
(1, 'Anuel RHLM2', '2025-12-12', 'Tecnopolis', 35000);

--
-- Triggers `eventos`
--
DELIMITER $$
CREATE TRIGGER `trg_ValidarFechaEventos` BEFORE INSERT ON `eventos` FOR EACH ROW BEGIN
    -- Comprueba si la fecha del nuevo evento es anterior a la fecha actual.
    IF NEW.fecha < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: No se puede agendar un evento en una fecha pasada.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `pagos`
--

CREATE TABLE `pagos` (
  `id` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `monto` decimal(10,2) DEFAULT NULL,
  `metodo` varchar(250) DEFAULT NULL,
  `id_ticket` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `pagos`
--
DELIMITER $$
CREATE TRIGGER `trg_ValidarMontoPago` BEFORE INSERT ON `pagos` FOR EACH ROW BEGIN
    -- Asegura que el monto del pago sea positivo
    IF NEW.monto <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: El monto del pago debe ser positivo.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `codigoQR` varchar(250) DEFAULT NULL,
  `estado` varchar(250) DEFAULT NULL,
  `lugar` varchar(250) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_evento` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `tickets`
--
DELIMITER $$
CREATE TRIGGER `trg_ValidarCapacidad` BEFORE INSERT ON `tickets` FOR EACH ROW BEGIN
    DECLARE v_capacidad_disp INT;

    SELECT capacidad INTO v_capacidad_disp
    FROM evento WHERE id = NEW.id_evento;

    -- Si la capacidad es 0 o menor, previene la inserción del ticket
    IF v_capacidad_disp <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: El evento no tiene cupos disponibles. (Validación por Trigger)';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(250) DEFAULT NULL,
  `email` varchar(250) DEFAULT NULL,
  `contraseña` varchar(250) DEFAULT NULL,
  `rol` enum('adm','org','user') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accesos`
--
ALTER TABLE `accesos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_ticket` (`id_ticket`);

--
-- Indexes for table `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_ticket` (`id_ticket`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_evento` (`id_evento`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accesos`
--
ALTER TABLE `accesos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accesos`
--
ALTER TABLE `accesos`
  ADD CONSTRAINT `accesos_ibfk_1` FOREIGN KEY (`id_ticket`) REFERENCES `tickets` (`id`);

--
-- Constraints for table `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_ticket`) REFERENCES `tickets` (`id`);

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`id_evento`) REFERENCES `eventos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
