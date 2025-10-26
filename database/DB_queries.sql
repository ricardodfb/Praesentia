-- 1. Insertar un usuario
INSERT INTO users (email, password_hash, role, name, consent_location)
VALUES ('juan@example.com', 'hashed_password', 'Student', 'Juan Perez', TRUE);

-- 2. Insertar un estudiante vinculado a un usuario
INSERT INTO students (user_id, student_number, carrera, grupo)
VALUES (1, '20251001', 'Ingeniería', 'A');

-- 3. Insertar un profesor
INSERT INTO professors (user_id, employee_id, depto)
VALUES (2, 'EMP123', 'Sistemas');

-- 4. Crear un aula
INSERT INTO classrooms (name, building, lat, lon, radius_meters, created_by)
VALUES ('Aula 101', 'Edificio A', 19.432608, -99.133209, 10, 2);

-- 5. Crear un curso
INSERT INTO courses (code, name, profesor_id)
VALUES ('CS101', 'Programación I', 2);

-- 6. Definir horario de curso (para generar sesiones automáticamente)
INSERT INTO course_schedule (course_id, day_of_week, start_time, end_time, semester_start, semester_end)
VALUES (1, 'Monday', '08:00:00', '09:30:00', '2025-09-01', '2025-12-15');

-- 8. Registrar asistencia de un estudiante
INSERT INTO attendance_records (session_id, student_id, lat, lon, distance_meters, status, metadata)
VALUES (1, 1, 19.432608, -99.133209, 2.5, 'present', '{"device":"mobile"}');

-- 9. Consultar asistencia de un estudiante
SELECT s.name AS course_name, a.status, a.timestamp
FROM attendance_records a
JOIN sessions se ON a.session_id = se.id
JOIN courses s ON se.course_id = s.id
WHERE a.student_id = 1;

-- 10. Consultar sesiones de un curso
SELECT se.id, se.start_datetime, se.end_datetime, c.name AS classroom
FROM sessions se
JOIN classrooms c ON se.classroom_id = c.id
WHERE se.course_id = 1;