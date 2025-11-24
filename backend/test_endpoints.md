Correr servidor: npm run dev

Registrar Usuario Genérico (Admin o Teacher)
POST
http://localhost:3000/api/users/register
{
  "email": "admin1@uabc.mx",
  "password": "12345",
  "name": "Administrador General",
  "role": "Admin"
}

Registrar Estudiante
POST
http://localhost:3000/api/students/register
{
  "email": "alumno1@uabc.edu.mx",
  "password": "12345",
  "name": "Juan Pérez",
  "student_number": "1183526",
  "carrera": "Ingeniería",
  "grupo": "5A"
}

Registrar Profesor
POST
http://localhost:3000/api/professors/register
{
  "email": "maestro1@uabc.edu.mx",
  "password": "12345",
  "name": "Dr. Héctor Morales",
  "employee_id": "EMP001",
  "depto": "Ingeniería"
}

Registrar Classroom
POST
http://localhost:3000/api/classrooms/create
{
  "name": "Aula 101",
  "building": "Edificio A",
  "lat": 32.514920,
  "lon": -117.001220,
  "radius_meters": 15,
  "created_by": 1
}

Registrar Curso
POST
http://localhost:3000/api/courses/create
{
  "code": "ING101",
  "name": "Introducción a Ingeniería",
  "profesor_id": 3
}

Registrar Horario de Curso
POST
http://localhost:3000/api/schedules/create
{
  "course_id": 1,
  "day_of_week": "Monday",
  "start_time": "08:00:00",
  "end_time": "09:30:00",
  "semester_start": "2025-02-01",
  "semester_end": "2025-06-30"
}

Generar sesiones
POST
http://localhost:3000/api/sessions/generate
{
  "course_id": 1,
  "classroom_id": 2
}

Obtener sesiones por curso
GET
http://localhost:3000/api/sessions/course/1

Registrar asistencia
POST
http://localhost:3000/api/attendance/register
{
  "student_id": 2,
  "session_id": 10,
  "lat": 32.63158,
  "lon": -115.44485
}

Ver lista de estudiantes
GET
http://localhost:3000/api/query/students

Ver profesores
GET
http://localhost:3000/api/query/professors

Ver cursos
GET
http://localhost:3000/api/query/courses

Ver salones
GET
http://localhost:3000/api/query/classrooms

Ver horarios de cursos
GET
http://localhost:3000/api/query/schedules