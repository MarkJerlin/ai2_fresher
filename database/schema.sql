-- MySQL Database Schema for AI Freshers Connect Portal
-- Database: ai_freshers_portal

CREATE DATABASE IF NOT EXISTS `ai_freshers_portal`;
USE `ai_freshers_portal`;

-- --------------------------------------------------------
-- Table `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'admin') DEFAULT 'student',
  `avatar` VARCHAR(255) DEFAULT 'default_avatar.png',
  `department` VARCHAR(100) DEFAULT NULL,
  `roll_no` VARCHAR(50) DEFAULT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `departments`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `departments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `code` VARCHAR(10) NOT NULL UNIQUE,
  `description` TEXT,
  `hod_name` VARCHAR(100),
  `hod_email` VARCHAR(100),
  `location` VARCHAR(100),
  `phone` VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `faculty`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `faculty` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `designation` VARCHAR(100) NOT NULL,
  `department_id` INT,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20),
  `room_no` VARCHAR(20),
  `specialization` VARCHAR(255),
  `image_url` VARCHAR(255) DEFAULT 'default_faculty.png',
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `events`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `event_date` DATE NOT NULL,
  `event_time` TIME NOT NULL,
  `venue` VARCHAR(150) NOT NULL,
  `poster_url` VARCHAR(255) DEFAULT NULL,
  `category` ENUM('cultural', 'academic', 'sports', 'workshop', 'party') DEFAULT 'cultural',
  `coordinator` VARCHAR(100),
  `contact` VARCHAR(20),
  `max_registrations` INT DEFAULT 100,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `party_registration`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `party_registration` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `event_id` INT NOT NULL,
  `food_preference` ENUM('veg', 'non-veg') DEFAULT 'veg',
  `tshirt_size` ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL') DEFAULT 'M',
  `qr_code` VARCHAR(255) NOT NULL UNIQUE,
  `status` ENUM('pending', 'approved', 'checked_in') DEFAULT 'pending',
  `registered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_event` (`user_id`, `event_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `clubs`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `clubs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `lead_name` VARCHAR(100),
  `lead_email` VARCHAR(100),
  `logo_url` VARCHAR(255) DEFAULT 'default_club.png',
  `registration_link` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(50) DEFAULT 'Technical'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `resources`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `resources` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `category` ENUM('syllabus', 'notes', 'timetable', 'circular', 'map') DEFAULT 'syllabus',
  `file_url` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `uploaded_by` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `announcements`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `category` ENUM('academic', 'events', 'exam', 'general') DEFAULT 'general',
  `date_posted` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `feedback`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `feedback` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `message` TEXT NOT NULL,
  `rating` INT DEFAULT 5,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table `chat_history`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `chat_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `message` TEXT NOT NULL,
  `response` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------
-- SEED DATA
-- --------------------------------------------------------

-- Insert Departments
INSERT INTO `departments` (`name`, `code`, `description`, `hod_name`, `hod_email`, `location`, `phone`) VALUES
('Computer Science and Engineering', 'CSE', 'Empowering students with foundational computing theories and state-of-the-art software technologies.', 'Dr. Alan Turing', 'hod.cse@university.edu', 'Turing Block, 3rd Floor', '+1-555-0101'),
('Information Technology', 'IT', 'Focused on database management, networking, cloud systems, and cybersecurity.', 'Dr. Grace Hopper', 'hod.it@university.edu', 'Babbage Building, 2nd Floor', '+1-555-0102'),
('Electronics and Communication', 'ECE', 'Deep dive into analog and digital circuitry, signal processing, and communication hardware.', 'Dr. Nikola Tesla', 'hod.ece@university.edu', 'Tesla Block, Ground Floor', '+1-555-0103'),
('Mechanical Engineering', 'MECH', 'Study of thermodynamics, materials science, dynamics, and advanced automotive engineering.', 'Dr. James Watt', 'hod.mech@university.edu', 'Workshop Block A', '+1-555-0104');

-- Insert Faculty
INSERT INTO `faculty` (`name`, `designation`, `department_id`, `email`, `phone`, `room_no`, `specialization`, `image_url`) VALUES
('Dr. Charles Babbage', 'Professor', 1, 'charles.babbage@university.edu', '+1-555-0201', 'T-302', 'Compiler Design, Computer Architecture', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'),
('Prof. Ada Lovelace', 'Assistant Professor', 1, 'ada.lovelace@university.edu', '+1-555-0202', 'T-305', 'Algorithms, Machine Learning', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'),
('Dr. Tim Berners-Lee', 'Professor & Dean', 2, 'tim.lbl@university.edu', '+1-555-0203', 'B-214', 'Web Engineering, Semantic Web', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'),
('Dr. Claude Shannon', 'Professor', 3, 'claude.shannon@university.edu', '+1-555-0204', 'Tesla-104', 'Information Theory, Networking', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80');

-- Insert Admin User (password is 'admin123' encrypted with bcrypt - pre-hashed: $2b$10$tZ26fV64t153.ZqD/n3ZxeG.0oB/bNn/52yK1cK.xN4KxK6q033U.)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `department`, `roll_no`) VALUES
('System Admin', 'admin@university.edu', '$2b$10$tZ26fV64t153.ZqD/n3ZxeG.0oB/bNn/52yK1cK.xN4KxK6q033U.', 'admin', 'CSE', 'ADMIN001'),
('John Doe', 'john.doe@student.edu', '$2b$10$tZ26fV64t153.ZqD/n3ZxeG.0oB/bNn/52yK1cK.xN4KxK6q033U.', 'student', 'CSE', 'CSE2026001');

-- Insert Events
INSERT INTO `events` (`title`, `description`, `event_date`, `event_time`, `venue`, `poster_url`, `category`, `coordinator`, `contact`, `max_registrations`) VALUES
('Freshers Fiesta 2026', 'The Official Freshers Welcome Party! Get ready for live music, interactive DJ set, ice breakers, games, and a delicious buffet.', '2026-08-15', '18:00:00', 'Main Auditorium', 'freshers_fiesta_2026.png', 'party', 'GDG Campus Team', '+1-555-9000', 500),
('Tech Expo & Hackathon Intro', 'A kickoff session showcasing GDG club projects, upcoming hackathons, and guides on how to survive your first year in tech.', '2026-08-20', '10:00:00', 'Seminar Hall B', NULL, 'workshop', 'Prof. Ada Lovelace', '+1-555-0202', 200),
('Inter-Department Sports Meet', 'The annual freshman sports trials. Showcase your skills in football, basketball, badminton, and chess.', '2026-08-25', '08:30:00', 'University Sports Arena', NULL, 'sports', 'Coach Armstrong', '+1-555-9988', 150);

-- Insert Clubs
INSERT INTO `clubs` (`name`, `description`, `lead_name`, `lead_email`, `logo_url`, `registration_link`, `category`) VALUES
('Google Developer Groups (GDG) On Campus', 'A community-backed club aimed at building apps, learning cloud technologies, and mastering AI with Google tools.', 'Sarah Chen', 'sarah.c@student.edu', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80', 'https://gdg.community.dev/', 'Technical'),
('Robotics & IoT Club', 'Build drones, IoT sensing grids, and participate in international robowars tournaments.', 'Alex Mercer', 'alex.m@student.edu', 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=200&auto=format&fit=crop&q=80', 'https://robotics-club.edu/', 'Technical'),
('Music & Dramatic Arts (MDA)', 'The hub of campus culture! Organizes rock shows, dance showcases, acoustic nights, and street plays.', 'Liam Gallagher', 'liam.g@student.edu', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80', 'https://mda-arts.edu/', 'Cultural');

-- Insert Announcements
INSERT INTO `announcements` (`title`, `content`, `category`) VALUES
('Welcome to Academic Session 2026-27!', 'Welcome freshers! Regular classes for all branches begin on August 10, 2026. Make sure to download your timetable.', 'academic'),
('Freshers Party Mandatory Registration', 'Register online for the Freshers Fiesta 2026 to generate your entry QR code. Strictly no admission without QR pass.', 'events'),
('Bus Route Upgrades for First-Year Students', 'New bus routes have been added covering the North and East suburbs. Contact the transport desk at Admin Block.', 'general');
