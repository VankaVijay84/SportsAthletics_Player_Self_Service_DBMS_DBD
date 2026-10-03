-- Sports & Athletics Mobile App Database Schema (MySQL 8.0+)
-- Database: sports_athletics_db

CREATE DATABASE IF NOT EXISTS sports_athletics_db;
USE sports_athletics_db;

-- 1. Users Table (Authentication & Core Roles)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('PLAYER', 'COACH', 'SPORTS_ADMIN', 'ADMIN') NOT NULL DEFAULT 'PLAYER',
  avatar_url VARCHAR(500) DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Sports Table
CREATE TABLE IF NOT EXISTS sports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  category VARCHAR(50) DEFAULT 'Team Sport',
  icon VARCHAR(50) DEFAULT 'trophy',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Coaches Table
CREATE TABLE IF NOT EXISTS coaches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(30) DEFAULT NULL,
  specialization VARCHAR(100) DEFAULT NULL,
  experience_years INT DEFAULT 0,
  sport_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Teams Table
CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  sport_id INT NOT NULL,
  coach_id INT DEFAULT NULL,
  season VARCHAR(50) DEFAULT '2026 Season',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE CASCADE,
  FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE SET NULL,
  INDEX idx_teams_sport (sport_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Players Table
CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  player_id_code VARCHAR(30) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(30) DEFAULT NULL,
  dob DATE DEFAULT NULL,
  gender ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
  address TEXT DEFAULT NULL,
  emergency_contact VARCHAR(150) DEFAULT NULL,
  sport_id INT DEFAULT NULL,
  team_id INT DEFAULT NULL,
  position VARCHAR(50) DEFAULT 'Forward',
  jersey_number INT DEFAULT NULL,
  playing_level VARCHAR(50) DEFAULT 'University Varsity',
  experience_years INT DEFAULT 2,
  profile_completion INT DEFAULT 85,
  performance_score INT DEFAULT 87,
  attendance_percentage INT DEFAULT 92,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE SET NULL,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
  INDEX idx_players_code (player_id_code),
  INDEX idx_players_sport (sport_id),
  INDEX idx_players_team (team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Player Teams Junction Table
CREATE TABLE IF NOT EXISTS player_teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  team_id INT NOT NULL,
  assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  UNIQUE KEY unique_player_team (player_id, team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Training Sessions Table
CREATE TABLE IF NOT EXISTS training_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  sport_id INT NOT NULL,
  team_id INT DEFAULT NULL,
  coach_id INT DEFAULT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(200) NOT NULL,
  session_type VARCHAR(50) DEFAULT 'Tactical & Conditioning',
  instructions TEXT DEFAULT NULL,
  status ENUM('Upcoming', 'Completed', 'Cancelled', 'Missed') DEFAULT 'Upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
  FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE SET NULL,
  INDEX idx_training_date (session_date),
  INDEX idx_training_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Training Attendance Table
CREATE TABLE IF NOT EXISTS training_attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  player_id INT NOT NULL,
  status ENUM('Present', 'Absent', 'Late') DEFAULT 'Present',
  notes VARCHAR(255) DEFAULT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES training_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  UNIQUE KEY unique_session_player (session_id, player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Performance Records Table
CREATE TABLE IF NOT EXISTS performance_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  recorded_date DATE NOT NULL,
  speed INT DEFAULT 80,
  strength INT DEFAULT 80,
  endurance INT DEFAULT 80,
  agility INT DEFAULT 80,
  flexibility INT DEFAULT 80,
  reaction_time INT DEFAULT 80,
  accuracy INT DEFAULT 80,
  overall_score INT DEFAULT 80,
  remarks TEXT DEFAULT NULL,
  coach_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE SET NULL,
  INDEX idx_perf_player (player_id),
  INDEX idx_perf_date (recorded_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Fitness Records Table
CREATE TABLE IF NOT EXISTS fitness_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  recorded_date DATE NOT NULL,
  height_cm DECIMAL(5,2) DEFAULT 178.00,
  weight_kg DECIMAL(5,2) DEFAULT 72.50,
  bmi DECIMAL(4,2) DEFAULT 22.88,
  body_fat_percentage DECIMAL(4,2) DEFAULT 12.50,
  resting_hr INT DEFAULT 58,
  vo2_max DECIMAL(4,1) DEFAULT 54.5,
  flexibility_score INT DEFAULT 85,
  strength_score INT DEFAULT 82,
  fitness_score INT DEFAULT 88,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  INDEX idx_fitness_player (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Competitions Table
CREATE TABLE IF NOT EXISTS competitions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  sport_id INT NOT NULL,
  category VARCHAR(100) DEFAULT 'Inter-University League',
  competition_date DATE NOT NULL,
  location VARCHAR(200) NOT NULL,
  opponent VARCHAR(150) DEFAULT NULL,
  status ENUM('Upcoming', 'Registered', 'Completed', 'Cancelled') DEFAULT 'Upcoming',
  description TEXT DEFAULT NULL,
  result_summary VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE CASCADE,
  INDEX idx_comp_date (competition_date),
  INDEX idx_comp_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Competition Registrations Table
CREATE TABLE IF NOT EXISTS competition_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  competition_id INT NOT NULL,
  player_id INT NOT NULL,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Registered', 'Approved', 'Rejected') DEFAULT 'Registered',
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  UNIQUE KEY unique_comp_player (competition_id, player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  award_type ENUM('Gold Medal', 'Silver Medal', 'Bronze Medal', 'Trophy', 'Certificate', 'Award', 'Personal Record') NOT NULL,
  event_name VARCHAR(200) NOT NULL,
  year INT NOT NULL,
  description TEXT DEFAULT NULL,
  icon VARCHAR(50) DEFAULT 'award',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  INDEX idx_achieve_player (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  doc_name VARCHAR(200) NOT NULL,
  doc_type ENUM('ID Proof', 'Medical Certificate', 'Sports Certificate', 'Insurance Document', 'Academic Document', 'Competition Document') NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size VARCHAR(50) DEFAULT '1.2 MB',
  uploaded_date DATE NOT NULL,
  status ENUM('Verified', 'Pending', 'Rejected') DEFAULT 'Verified',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  INDEX idx_docs_player (player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  category ENUM('Training', 'Competition', 'Performance', 'System') DEFAULT 'System',
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notif_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  content TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_msg_sender (sender_id),
  INDEX idx_msg_receiver (receiver_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
