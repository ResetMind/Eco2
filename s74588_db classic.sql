-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 19, 2021 at 03:19 PM
-- Server version: 5.7.24
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `s74588_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `sponsorgamer@gmail.com_cultures`
--

CREATE TABLE `sponsorgamer@gmail.com_cultures` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sponsorgamer@gmail.com_cultures`
--

INSERT INTO `sponsorgamer@gmail.com_cultures` (`id`, `name`) VALUES
(1, 'Культура1'),
(2, 'Культура2'),
(3, 'Культура3');

-- --------------------------------------------------------

--
-- Table structure for table `sponsorgamer@gmail.com_factors`
--

CREATE TABLE `sponsorgamer@gmail.com_factors` (
  `id` int(11) NOT NULL,
  `year` int(11) DEFAULT NULL,
  `field` varchar(100) DEFAULT NULL,
  `culture` varchar(100) DEFAULT NULL,
  `sumT` float DEFAULT NULL,
  `sumT10` float DEFAULT NULL,
  `sumT15` float DEFAULT NULL,
  `sumT20` float DEFAULT NULL,
  `chdT10` int(11) DEFAULT NULL,
  `chdT15` int(11) DEFAULT NULL,
  `chdT20` int(11) DEFAULT NULL,
  `sumO` float DEFAULT NULL,
  `sumO2` float DEFAULT NULL,
  `chdO` int(11) DEFAULT NULL,
  `chdO2` int(11) DEFAULT NULL,
  `sumB` int(11) DEFAULT NULL,
  `sumB40` int(11) DEFAULT NULL,
  `sumB45` int(11) DEFAULT NULL,
  `sumB50` int(11) DEFAULT NULL,
  `chdB40` int(11) DEFAULT NULL,
  `chdB45` int(11) DEFAULT NULL,
  `chdB50` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sponsorgamer@gmail.com_factors`
--

INSERT INTO `sponsorgamer@gmail.com_factors` (`id`, `year`, `field`, `culture`, `sumT`, `sumT10`, `sumT15`, `sumT20`, `chdT10`, `chdT15`, `chdT20`, `sumO`, `sumO2`, `chdO`, `chdO2`, `sumB`, `sumB40`, `sumB45`, `sumB50`, `chdB40`, `chdB45`, `chdB50`) VALUES
(1, 1970, 'Поле1', 'Культура1, Культура2', 429, 360, 273, 63, 22, 15, 4, 9.8, 9.8, 2, 2, 869, 350, 310, 219, 7, 6, 4),
(2, 1972, 'Поле2', 'Культура1', 470, 451, 312, 63, 28, 17, 3, 22.3, 21.1, 3, 2, 938, 299, 255, 111, 6, 5, 2),
(3, 1974, 'Поле1', 'Культура3', 379, 303, 123, 0, 21, 7, 0, 59.3, 55, 13, 9, 1542, 1380, 1044, 761, 26, 18, 12),
(4, 1975, 'Поле3', 'Культура1, Культура3', 375, 567, 529, 253, 30, 27, 12, 36.5, 36.5, 2, 2, 852, 228, 102, 54, 5, 2, 1),
(5, 1976, 'Поле2', 'Культура1, Культура2', 367, 299, 151, 0, 21, 9, 0, 66.9, 63.6, 10, 8, 1503, 1118, 1078, 987, 19, 18, 16),
(6, 1977, 'Поле2', 'Культура2, Культура3', 502, 466, 396, 206, 27, 21, 10, 10.6, 9.7, 3, 2, 1151, 673, 460, 415, 13, 8, 7),
(7, 1978, 'Поле1', 'Культура1', 374, 322, 100, 0, 24, 6, 0, 30.9, 28.7, 8, 6, 1437, 1046, 963, 868, 17, 15, 13),
(8, 1979, 'Поле1', 'Культура1', 575, 575, 484, 289, 31, 24, 13, 19.9, 19.9, 3, 3, 841, 194, 153, 107, 4, 3, 1),
(9, 1980, 'Поле3', 'Культура2', 348, 260, 99, 0, 18, 6, 0, 105.8, 102.5, 13, 10, 1568, 1191, 1147, 960, 19, 18, 14),
(10, 1982, 'Поле2', 'Культура3', 398, 357, 129, 0, 26, 7, 0, 65.2, 65.2, 10, 10, 1255, 675, 342, 394, 14, 6, 5),
(11, 1986, 'Поле1', 'Культура2, Культура3', 438, 388, 327, 87, 23, 18, 4, 30.1, 29.5, 6, 3, 1119, 410, 410, 219, 7, 7, 2),
(12, 1987, 'Поле2', 'Культура3, Культура2', 469, 442, 256, 84, 28, 14, 4, 33.2, 30.2, 8, 4, 1254, 781, 492, 355, 16, 9, 9),
(13, 1988, 'Поле1', 'Культура1', 471, 437, 323, 103, 27, 18, 5, 22.5, 20.3, 8, 5, 949, 307, 223, 177, 6, 4, 3),
(14, 1989, 'Поле2', 'Культура2', 433, 410, 212, 0, 28, 13, 0, 50.2, 49.4, 10, 8, 1325, 783, 624, 369, 15, 9, 8),
(15, 1990, 'Поле3', 'Культура3', 373, 311, 112, 0, 23, 7, 0, 38.1, 36.2, 10, 5, 1158, 629, 382, 291, 13, 7, 5);

-- --------------------------------------------------------

--
-- Table structure for table `sponsorgamer@gmail.com_fields`
--

CREATE TABLE `sponsorgamer@gmail.com_fields` (
  `id` int(11) NOT NULL,
  `cadastral` varchar(50) DEFAULT NULL,
  `coordinates` varchar(100) DEFAULT NULL,
  `owner` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sponsorgamer@gmail.com_fields`
--

INSERT INTO `sponsorgamer@gmail.com_fields` (`id`, `cadastral`, `coordinates`, `owner`) VALUES
(1, 'Поле1', 'Поле1', NULL),
(2, 'Поле2', 'Поле2', NULL),
(3, 'Поле3', 'Поле1', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `email` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `password` varchar(60) NOT NULL,
  `code` varchar(100) DEFAULT NULL,
  `status` int(1) DEFAULT '0',
  `token` varchar(60) DEFAULT NULL,
  `new_password` varchar(60) DEFAULT NULL,
  `new_email` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `name`, `password`, `code`, `status`, `token`, `new_password`, `new_email`) VALUES
(34, 'sponsorgamer@gmail.com', 'Андрей ', '$2y$10$Fu9oTifnGklWPdTms2L04eLCcTdMISYfZrG605Oe9b5ZAu19kobF2', '57ea806d555ae709a0bd72e8e93b099c', 1, '$2y$10$7Ci1nS0KwRASInVMuskZbez0jvpMUixAA63TUc8NvbJ1zJ4E7CvsC', '$2y$10$pI6PhtgqMdALRx9WX834J.THmcFdW2O3smpFGDxC.63ceA3/NITXm', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sponsorgamer@gmail.com_cultures`
--
ALTER TABLE `sponsorgamer@gmail.com_cultures`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sponsorgamer@gmail.com_factors`
--
ALTER TABLE `sponsorgamer@gmail.com_factors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sponsorgamer@gmail.com_fields`
--
ALTER TABLE `sponsorgamer@gmail.com_fields`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sponsorgamer@gmail.com_cultures`
--
ALTER TABLE `sponsorgamer@gmail.com_cultures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sponsorgamer@gmail.com_factors`
--
ALTER TABLE `sponsorgamer@gmail.com_factors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `sponsorgamer@gmail.com_fields`
--
ALTER TABLE `sponsorgamer@gmail.com_fields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
