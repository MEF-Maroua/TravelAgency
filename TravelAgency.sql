-- Création de la base de données
CREATE DATABASE IF NOT EXISTS `TravelAgency`;
USE `TravelAgency`;

-- 1. Table des utilisateurs (Clients et Agences)
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','agency') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table des agences (Profils détaillés)
CREATE TABLE IF NOT EXISTS `agencies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `agency_name` varchar(255) NOT NULL,
  `wilaya` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `logo` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `agencies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table des tours (Offres de voyage)
CREATE TABLE IF NOT EXISTS `tours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `agency_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `wilaya` varchar(100) DEFAULT NULL,
  `distance` int(11) DEFAULT NULL,
  `photo` text DEFAULT NULL,
  `desc` text DEFAULT NULL,
  `price` int(11) NOT NULL,
  `maxGroupSize` int(11) DEFAULT 10,
  `featured` tinyint(1) DEFAULT 0,
  `tour_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_agency` (`agency_id`),
  CONSTRAINT `tours_ibfk_1` FOREIGN KEY (`agency_id`) REFERENCES `agencies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Table des réservations (Bookings)
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `tour_id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `guest_size` int(11) DEFAULT 1,
  `book_date` date NOT NULL,
  `total_price` int(11) NOT NULL,
  `card_number` varchar(20) DEFAULT NULL,
  `expiry_date` varchar(10) DEFAULT NULL,
  `cvv` varchar(4) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'confirmed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `tour_id` (`tour_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Table des avis (Reviews)
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tour_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `reviewText` text NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `tour_id` (`tour_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Table de la Newsletter
CREATE TABLE IF NOT EXISTS `newsletter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `subscribed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Table pour le ChatBot (Base de connaissances)
CREATE TABLE IF NOT EXISTS `knowledge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `category` varchar(100) DEFAULT 'general',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Données d'exemple pour le ChatBot
INSERT IGNORE INTO `knowledge` (question, answer, category) VALUES 
('best time to visit', 'Le printemps (mars à mai) et l\'automne (septembre à novembre) sont idéaux pour le nord. Pour le Sahara, l\'hiver (décembre à février) est préférable.', 'travel'),
('is algeria safe', 'Oui, l\'Algérie est généralement sûre pour les touristes, surtout dans les grandes villes et les destinations populaires.', 'safety'),
('visa', 'La plupart des ressortissants étrangers ont besoin d\'un visa. Contactez le consulat algérien le plus proche.', 'entry'),
('currency', 'La monnaie utilisée est le Dinar Algérien (DZD).', 'money'),
('what to eat', 'Ne manquez pas le Couscous, le Tajine, le Bourek, et les pâtisseries traditionnelles comme la Baklawa.', 'food');
