-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 07 jan. 2024 à 22:14
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `database_development_incidenz`
--

-- --------------------------------------------------------

--
-- Structure de la table `administrators`
--

CREATE TABLE `administrators` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `entreprises`
--

CREATE TABLE `entreprises` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `entreprises`
--

INSERT INTO `entreprises` (`id`, `nom`, `password`, `contact`, `createdAt`, `updatedAt`) VALUES
(1, 'Eneo', '$2b$05$1UQ/exOchBCcGYjmBXGmtuXmiePB6EY2pQWhGfNXsNqbDUilOcITC', 'Dans le mur Maria', '2023-12-20 21:20:38', '2023-12-20 21:20:38'),
(2, 'Camwater', '$2b$05$DW6PXVBdp3IiO94eaE/U6.K157AlnJQ.bPGE01vdK4VcNUOv9yS5m', 'Dans le mur Rose', '2023-12-20 22:46:18', '2023-12-20 22:46:18'),
(3, 'Sosucam', '$2b$05$V6YyZDKOBcohY4Zn.iATOekFgJYqVxMTemxy9tjcOWj0KkszEV9Iy', 'Mahr', '2023-12-20 22:46:58', '2023-12-20 22:46:58'),
(4, 'Camtel', '$2b$05$NE6oWQK1pj8QMm4w2hKcRuwS9zRv5s4Y7MrTHYwB9PkKPbDLln2dC', 'Yaounde', '2023-12-20 22:47:41', '2023-12-20 22:47:41'),
(5, 'Umbrella', '$2b$05$3NUD1u5mVHh.KHY9qDszb.xinl9jySnKEhXmXeVPL8jfmn8IJs7vK', 'Gotham', '2023-12-20 22:48:23', '2023-12-20 22:48:23'),
(6, 'Wayne', '$2b$05$CbE0mNvfKG5dhK1RA./naundfM/iob3Wx3Hv0kXJFoKuX.n46raT6', 'Gotham City', '2023-12-20 22:48:58', '2023-12-20 22:48:58'),
(7, 'Stark', '$2b$05$XEwkZhdp8ydOSgcywJKHNuT/9Oi0ZD5DPr5OEyZVC8cGJyTcsFbgO', 'Stark Industry', '2023-12-20 22:49:51', '2023-12-20 22:49:51');

-- --------------------------------------------------------

--
-- Structure de la table `incidents`
--

CREATE TABLE `incidents` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `tel` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `media` blob DEFAULT NULL,
  `audio` blob DEFAULT NULL,
  `gravite` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `localisation` varchar(255) DEFAULT NULL,
  `etat` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `incidents`
--

INSERT INTO `incidents` (`id`, `title`, `tel`, `type`, `media`, `audio`, `gravite`, `description`, `localisation`, `etat`, `createdAt`, `updatedAt`) VALUES
(1, 'Chute du mur Maria', 3, 4, '', '', 5, 'Le colossal a détruit le mûr.', 'La porte d\'entrée de l\'enceinte.', 'begin', '2024-01-06 19:18:34', '2024-01-06 20:14:15');

-- --------------------------------------------------------

--
-- Structure de la table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20231211083459-create-user.js'),
('20231211083630-create-entreprise.js'),
('20231211083924-create-type-incident.js'),
('20231211084609-create-administrator.js'),
('20231211090726-create-incident.js');

-- --------------------------------------------------------

--
-- Structure de la table `typeincidents`
--

CREATE TABLE `typeincidents` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `entreprise` int(11) DEFAULT NULL,
  `image` blob DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `typeincidents`
--

INSERT INTO `typeincidents` (`id`, `nom`, `entreprise`, `image`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'aerien', 2, '', 'Début du grand terrassemenent', '2024-01-06 18:35:56', '2024-01-06 18:35:56'),
(2, 'aerien5', 2, '', 'Début du grand terrassemenent', '2024-01-06 18:37:02', '2024-01-06 18:37:02'),
(4, 'tfytvy', 3, '', 'hgvhgv', '2024-01-06 18:38:55', '2024-01-06 18:38:55'),
(5, 'nganga', 4, '', 'nga nga nga nga nga', '2024-01-06 18:42:31', '2024-01-06 18:42:31'),
(6, 'tijitiji', 4, '', 'nga nga nga nga nga tiji tiji', '2024-01-06 18:42:57', '2024-01-06 18:42:57');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `tel` varchar(255) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `isBlocked` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `tel`, `nom`, `prenom`, `password`, `email`, `isBlocked`, `createdAt`, `updatedAt`) VALUES
(1, '54458532', 'Nganga', 'Tiji', '$2b$05$8NaKSng2pfEfih0iETiYzeZY9.AUg2.83CmqN93pzqyxNkeGxyzQi', 'nganga@gmail.com', 0, '2023-12-14 14:23:42', '2023-12-14 14:23:42'),
(2, '654458530', 'Ndzana', 'Ndzana', '$2b$05$s4xFoALXQ20gHXP3p6C2BuwLJp.SP39mv07StvnO.IC4q5cqRDo/a', 'ndzana@gmail.com', 0, '2023-12-20 20:54:05', '2023-12-20 20:54:05'),
(3, '654457537', 'Wellpo', 'Wellpo', '$2b$05$n0AfwxuEIwroK3IK2b.RYOKasJJueDZ76.4LWTdVmM2g4WsPz6Czi', 'wellpo@gmail.com', 0, '2023-12-20 22:51:06', '2023-12-20 22:51:06'),
(5, '675057537', 'Zengus', 'Zengus', '$2b$05$xQh8iMsVeYf106vKSxEpwuiv8S21QhT34mrSBE0UHoqSxjQD7Egda', 'zengus@gmail.com', 0, '2023-12-20 22:53:14', '2023-12-20 22:53:14'),
(6, '675054537', 'Mediver', 'Medivert', '$2b$05$cOjM/kvcTmLONRuSn0MG0.TMJqu31EeW7FLpsrxbtNuWsW7Zd3jLi', 'medivert@gmail.com', 0, '2023-12-20 22:55:07', '2023-12-20 22:55:07'),
(7, '675053537', 'Chico', 'Chico', '$2b$05$83bi.6OGWCOw0MJmmeczOOHPBlTFzZObVUjBFovHJOgCKYbQz0pli', 'chico@gmail.com', 0, '2023-12-20 22:56:29', '2023-12-20 22:56:29'),
(8, '670053537', 'Femme', 'Femme', '$2b$05$KNBurpLLf85wQ6RbyWlS1e4CChdsFGL4hzqtb/brsvMP3LMSqBpny', 'femme@gmail.com', 0, '2023-12-20 22:57:06', '2023-12-20 22:57:06'),
(9, '679053537', 'Eren', 'Eren', '$2b$05$IegqmDLhz7ClosPsQh5yweq2p/Kpj8Es2JULg0r9bUtL1gRRUYwfi', 'eren@gmail.com', 0, '2023-12-20 22:57:54', '2023-12-20 22:57:54'),
(10, '65445530', 'user', 'user', 'user1', 'user@gmail.com', 0, '2024-01-01 17:43:23', '2024-01-01 18:15:25'),
(11, '654458537', 'Starke', 'Starke', '$2b$05$itxNY2jQdOibcEPMvFnJ5O624LJiG4Y8YwTCSsLOAiFqTbLhxJmri', 'starke@gmail.com', 0, '2024-01-04 11:28:09', '2024-01-04 11:28:09'),
(12, '99999999', 'ndzana', 'ndzana', '$2b$05$yC15sjdAdGDIAos7FJIHDuL3PKdnx8mNgfzzwOr4ZFeisbV4WCqmC', 'ndzana@gmail.com', 0, '2024-01-06 18:33:01', '2024-01-06 18:33:01');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `administrators`
--
ALTER TABLE `administrators`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `entreprises`
--
ALTER TABLE `entreprises`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `incidents`
--
ALTER TABLE `incidents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tel` (`tel`),
  ADD KEY `type` (`type`);

--
-- Index pour la table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `typeincidents`
--
ALTER TABLE `typeincidents`
  ADD PRIMARY KEY (`id`,`nom`),
  ADD KEY `entreprise` (`entreprise`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `administrators`
--
ALTER TABLE `administrators`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `entreprises`
--
ALTER TABLE `entreprises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `incidents`
--
ALTER TABLE `incidents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `typeincidents`
--
ALTER TABLE `typeincidents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `incidents`
--
ALTER TABLE `incidents`
  ADD CONSTRAINT `incidents_ibfk_1` FOREIGN KEY (`tel`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `incidents_ibfk_2` FOREIGN KEY (`type`) REFERENCES `typeincidents` (`id`);

--
-- Contraintes pour la table `typeincidents`
--
ALTER TABLE `typeincidents`
  ADD CONSTRAINT `typeincidents_ibfk_1` FOREIGN KEY (`entreprise`) REFERENCES `entreprises` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
