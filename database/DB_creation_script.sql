-- CREAR BASE DE DATOS MYSQL
CREATE DATABASE IF NOT EXISTS praesentia;
USE praesentia;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Student','Teacher','Admin') NOT NULL,
    name VARCHAR(255) NOT NULL,
    consent_location BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    user_id INT PRIMARY KEY,
    student_number VARCHAR(50) UNIQUE NOT NULL,
    carrera VARCHAR(100),
    grupo VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE professors (
    user_id INT PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    depto VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE classrooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    building VARCHAR(100),
    lat DECIMAL(9,6),
    lon DECIMAL(9,6),
    radius_meters INT DEFAULT 10,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    profesor_id INT,
    FOREIGN KEY (profesor_id) REFERENCES professors(user_id) ON DELETE SET NULL
);

CREATE TABLE course_schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    day_of_week ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    semester_start DATE NOT NULL,
    semester_end DATE NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    classroom_id INT NOT NULL,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    type VARCHAR(50) DEFAULT 'Regular',
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE
);

CREATE TABLE attendance_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    student_id INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    lat DECIMAL(9,6),
    lon DECIMAL(9,6),
    distance_meters FLOAT,
    status ENUM('present','absent','excused','pending') DEFAULT 'pending',
    metadata JSON,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE
);

CREATE TABLE settings (
    param_key VARCHAR(100) PRIMARY KEY,
    param_value VARCHAR(255)
);
