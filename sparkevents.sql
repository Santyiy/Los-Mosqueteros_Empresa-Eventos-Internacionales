-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 26, 2025 at 04:01 PM
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

-- --------------------------------------------------------

--
-- Table structure for table `accesos`
--

CREATE TABLE `accesos` (
  `id` int(11) NOT NULL,
  `id_ticket` int(11) DEFAULT NULL,
  `fecha_hora` datetime(6) DEFAULT NULL,
  `dispositivo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accesos`
--

INSERT INTO `accesos` (`id`, `id_ticket`, `fecha_hora`, `dispositivo`) VALUES
(1, 1, NULL, 'Lector_Puerta_1');

-- --------------------------------------------------------

--
-- Table structure for table `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `lugar` varchar(255) DEFAULT NULL,
  `capacidad` int(11) DEFAULT NULL,
  `categoria` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `eventos`
--

INSERT INTO `eventos` (`id`, `nombre`, `fecha`, `lugar`, `capacidad`, `categoria`) VALUES
(1, 'Anuel RHLM2', '2025-12-12', 'Tecnopolis', 35000, NULL),
(2, 'Marama', '2025-12-21', 'Movistar Arena', 80000, NULL);

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
  `id_ticket` int(11) DEFAULT NULL,
  `monto` double NOT NULL,
  `fecha` datetime(6) DEFAULT NULL,
  `metodo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `id_evento` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `codigoqr` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `lugar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `id_evento`, `id_usuario`, `codigoqr`, `estado`, `lugar`) VALUES
(1, 1, 1, 'QR-1763338424548', 'Usado', 'Tecnopolis'),
(2, 1, 1, 'QR-1763348467244', 'Activo', 'Tecnopolis'),
(3, 2, 1, 'QR-1763348474673', 'Activo', 'Movistar Arena'),
(4, 2, 2, 'QR-1763348478363', 'Activo', 'Movistar Arena'),
(5, 2, 4, 'QR-1763348482307', 'Activo', 'Movistar Arena'),
(6, 1, 1, 'QR-1763350136925', 'Activo', NULL),
(7, 1, 1, 'QR-1763350526922', 'Activo', NULL),
(8, 1, 1, 'QR-1763350531238', 'Activo', NULL),
(9, 1, 1, 'QR-1763350532060', 'Activo', NULL),
(10, 1, 1, 'QR-1764113061303', 'Activo', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `telefono` int(11) NOT NULL,
  `contraseña` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `rol` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `telefono`, `contraseña`, `email`, `nombre`, `rol`) VALUES
(1, 1130295196, 'vigo', 'vigo32@gmail.com', 'santy', 'adm');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accesos`
--
ALTER TABLE `accesos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accesos`
--
ALTER TABLE `accesos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
