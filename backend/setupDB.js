const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      
  password: '',
  multipleStatements: true
});

const sql = `
CREATE DATABASE IF NOT EXISTS \`TravelAgency\`;
USE \`TravelAgency\`;

CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`username\` varchar(255) NOT NULL,
  \`email\` varchar(255) NOT NULL,
  \`password\` varchar(255) NOT NULL,
  \`role\` enum('user','agency') DEFAULT 'user',
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS \`agencies\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`user_id\` int(11) NOT NULL,
  \`agency_name\` varchar(255) NOT NULL,
  \`wilaya\` varchar(100) NOT NULL,
  \`phone\` varchar(20) NOT NULL,
  \`logo\` text DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`user_id\` (\`user_id\`),
  CONSTRAINT \`agencies_ibfk_1\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS \`tours\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`agency_id\` int(11) DEFAULT NULL,
  \`title\` varchar(255) NOT NULL,
  \`city\` varchar(255) NOT NULL,
  \`wilaya\` varchar(100) DEFAULT NULL,
  \`distance\` int(11) DEFAULT NULL,
  \`photo\` text DEFAULT NULL,
  \`desc\` text DEFAULT NULL,
  \`price\` int(11) NOT NULL,
  \`maxGroupSize\` int(11) DEFAULT 10,
  \`featured\` tinyint(1) DEFAULT 0,
  \`tour_date\` date DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`fk_agency\` (\`agency_id\`),
  CONSTRAINT \`tours_ibfk_1\` FOREIGN KEY (\`agency_id\`) REFERENCES \`agencies\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS \`bookings\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`user_id\` int(11) NOT NULL,
  \`tour_id\` int(11) NOT NULL,
  \`email\` varchar(255) DEFAULT NULL,
  \`full_name\` varchar(255) NOT NULL,
  \`phone\` varchar(20) NOT NULL,
  \`guest_size\` int(11) DEFAULT 1,
  \`book_date\` date NOT NULL,
  \`total_price\` int(11) NOT NULL,
  \`card_number\` varchar(20) DEFAULT NULL,
  \`expiry_date\` varchar(10) DEFAULT NULL,
  \`cvv\` varchar(4) DEFAULT NULL,
  \`status\` varchar(50) DEFAULT 'confirmed',
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`user_id\` (\`user_id\`),
  KEY \`tour_id\` (\`tour_id\`),
  CONSTRAINT \`bookings_ibfk_1\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`bookings_ibfk_2\` FOREIGN KEY (\`tour_id\`) REFERENCES \`tours\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS \`reviews\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`tour_id\` int(11) NOT NULL,
  \`user_name\` varchar(255) NOT NULL,
  \`reviewText\` text NOT NULL,
  \`rating\` int(11) DEFAULT NULL CHECK (\`rating\` >= 1 and \`rating\` <= 5),
  \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  KEY \`tour_id\` (\`tour_id\`),
  CONSTRAINT \`reviews_ibfk_1\` FOREIGN KEY (\`tour_id\`) REFERENCES \`tours\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS \`newsletter\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`email\` varchar(255) NOT NULL,
  \`subscribed_at\` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS \`knowledge\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`question\` text NOT NULL,
  \`answer\` text NOT NULL,
  \`category\` varchar(100) DEFAULT 'general',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Sample Data
INSERT IGNORE INTO \`knowledge\` (question, answer, category) VALUES 
('best time to visit', 'Spring (March to May) and Autumn (September to November) are ideal for the north. For the Sahara desert, winter (December to February) is the best time.', 'travel'),
('is algeria safe', 'Yes, Algeria is generally safe for tourists, especially in major cities and popular tourist destinations. Always follow local advice.', 'safety'),
('visa', 'Most foreign nationals require a visa. It is recommended to contact the nearest Algerian consulate well in advance of your trip.', 'entry'),
('currency', 'The currency used is the Algerian Dinar (DZD). Credit cards are accepted in major hotels and some shops, but cash is king in markets.', 'money'),
('what to eat', 'Do not miss out on Couscous (the national dish), Tajine, Bourek, and traditional Algerian sweets like Baklawa and Makroud.', 'food');
`;

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }

  console.log('Executing SQL script to set up the database...');

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing SQL:', err);
    } else {
      console.log('Database and tables created successfully!');
    }
    process.exit();
  });
});
