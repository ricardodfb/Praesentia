<template>
  <div>
    <!-- Barra superior -->
    <div class="app-bar">
      <div class="toolbar-title">Sistema de Asistencia - Profesores</div>
      <div class="spacer"></div>
      <button class="icon-btn">
        <span></span>
      </button>
    </div>

    <!-- Filtros -->
    <div class="card">
      <div class="toolbar">
        <div class="filters">
          <div class="form-field">
            <label>Clase</label>
            <select v-model="filtros.clase" class="select-input">
              <option value="">Seleccione una clase</option>
              <option v-for="clase in clases" :key="clase.id" :value="clase.clave">
                {{ clase.clave }} - {{ clase.nombre }}
              </option>
            </select>
          </div>
          
          <div class="form-field">
            <label>Fecha</label>
            <input 
              type="date" 
              v-model="filtros.fecha" 
              class="text-input"
            >
          </div>
        </div>
        
        <div class="spacer"></div>
        <button class="primary-btn" @click="buscarAsistencias">
          <span class="btn-icon"></span>
          Buscar
        </button>
      </div>

      <!-- Tabla de asistencias -->
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre del Alumno</th>
            <th>Matrícula</th>
            <th>Fecha</th>
            <th>Hora de Asistencia</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(asistencia, index) in asistencias" :key="asistencia.id">
            <td>{{ index + 1 }}</td>
            <td>{{ asistencia.alumno }}</td>
            <td>{{ asistencia.matricula }}</td>
            <td>{{ asistencia.fecha }}</td>
            <td>{{ asistencia.hora }}</td>
            <td>
              <span :class="['status', asistencia.estado]">
                {{ asistencia.estado }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mensaje cuando no hay datos -->
      <div v-if="asistencias.length === 0" class="no-data">
        <p>No hay registros de asistencia disponibles</p>
      </div>
    </div>

    <!-- Dialogo para tomar asistencia -->
    <div v-if="dialogAsistenciaVisible" class="dialog-overlay" @click="cerrarDialogAsistencia">
      <div class="dialog" @click.stop style="max-width: 700px;">
        <div class="dialog-header">
          <div class="dialog-title">Tomar Asistencia</div>
        </div>
        
        <div class="dialog-content">
          <div class="info-grid">
            <div class="info-item">
              <label>Clase:</label>
              <span>{{ asistenciaActual.clase }}</span>
            </div>
            <div class="info-item">
              <label>Fecha:</label>
              <span>{{ asistenciaActual.fecha }}</span>
            </div>
            <div class="info-item">
              <label>Hora:</label>
              <span>{{ asistenciaActual.hora }}</span>
            </div>
          </div>

          <div class="students-list">
            <h3>Lista de Alumnos</h3>
            <div class="student-item" v-for="alumno in alumnos" :key="alumno.id">
              <div class="student-info">
                <span class="student-name">{{ alumno.nombre }}</span>
                <span class="student-id">{{ alumno.matricula }}</span>
              </div>
              <button 
                class="attendance-btn"
                :class="{ 'present': alumno.asistio }"
                @click="marcarAsistencia(alumno)"
              >
                {{ alumno.asistio ? ' Presente' : ' Ausente' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="dialog-actions">
          <button class="secondary-btn" @click="cerrarDialogAsistencia">Cancelar</button>
          <button class="primary-btn" @click="guardarAsistencia">Guardar Asistencia</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfesoresAsistencia',
  
  data() {
    return {
      dialogAsistenciaVisible: false,
      
      filtros: {
        clase: '',
        fecha: ''
      },
      
      clases: [
        {
          id: 1,
          clave: 'MAT101',
          nombre: 'Matemáticas Básicas'
        },
        {
          id: 2,
          clave: 'FIS201',
          nombre: 'Física General'
        },
        {
          id: 3,
          clave: 'PROG301',
          nombre: 'Programación Avanzada'
        }
      ],
      
      asistencias: [
        {
          id: 1,
          alumno: 'Ana García López',
          matricula: 'A12345',
          fecha: '2024-01-15',
          hora: '08:05 AM',
          estado: 'presente'
        },
        {
          id: 2,
          alumno: 'Carlos Rodríguez Silva',
          matricula: 'A12346',
          fecha: '2024-01-15',
          hora: '08:10 AM',
          estado: 'presente'
        },
        {
          id: 3,
          alumno: 'María Fernández Cruz',
          matricula: 'A12347',
          fecha: '2024-01-16',
          hora: '02:15 PM',
          estado: 'ausente'
        },
        {
          id: 4,
          alumno: 'José Martínez Ruiz',
          matricula: 'A12348',
          fecha: '2024-01-17',
          hora: '09:05 AM',
          estado: 'presente'
        }
      ],
      
      alumnos: [
        {
          id: 1,
          nombre: 'Ana García López',
          matricula: 'A12345',
          asistio: false
        },
        {
          id: 2,
          nombre: 'Carlos Rodríguez Silva',
          matricula: 'A12346',
          asistio: false
        },
        {
          id: 3,
          nombre: 'María Fernández Cruz',
          matricula: 'A12347',
          asistio: false
        },
        {
          id: 4,
          nombre: 'José Martínez Ruiz',
          matricula: 'A12348',
          asistio: false
        },
        {
          id: 5,
          nombre: 'Laura Díaz Mendoza',
          matricula: 'A12349',
          asistio: false
        }
      ],
      
      asistenciaActual: {
        clase: '',
        fecha: '',
        hora: ''
      }
    }
  },

  methods: {
    buscarAsistencias() {
      console.log('Buscando asistencias con filtros:', this.filtros)
      // Aquí iría la logica de busqueda real
    },

    abrirDialogAsistencia() {
      const now = new Date()
      this.asistenciaActual = {
        clase: this.clases.find(c => c.clave === this.filtros.clase)?.nombre || 'Clase No Especificada',
        fecha: this.filtros.fecha || now.toISOString().split('T')[0],
        hora: now.toTimeString().split(' ')[0].substring(0, 5)
      }
      this.dialogAsistenciaVisible = true
    },

    marcarAsistencia(alumno) {
      alumno.asistio = !alumno.asistio
      console.log(`Asistencia de ${alumno.nombre}: ${alumno.asistio ? 'Presente' : 'Ausente'}`)
    },

    guardarAsistencia() {
      console.log('Guardando asistencia:', this.alumnos.filter(a => a.asistio))
      this.dialogAsistenciaVisible = false
      // Reiniciar estados
      this.alumnos.forEach(alumno => alumno.asistio = false)
    },

    cerrarDialogAsistencia() {
      this.dialogAsistenciaVisible = false
      // Reiniciar estados
      this.alumnos.forEach(alumno => alumno.asistio = false)
    }
  },

  mounted() {
    // Establecer fecha actual por defecto
    const today = new Date().toISOString().split('T')[0]
    this.filtros.fecha = today
  }
}
</script>

<style scoped>
.app-bar {
  background-color: #1976D2;
  color: white;
  padding: 16px;
  display: flex;
  align-items: center;
}

.toolbar-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.spacer {
  flex-grow: 1;
}

.icon-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
}

.card {
  margin: 24px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.toolbar {
  background-color: #f5f5f5;
  padding: 16px;
  display: flex;
  align-items: center;
}

.filters {
  display: flex;
  gap: 16px;
  align-items: end;
  flex-wrap: wrap;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field label {
  margin-bottom: 4px;
  font-weight: bold;
  font-size: 0.9rem;
}

.text-input, .select-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 200px;
}

.primary-btn {
  background-color: #1976D2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.secondary-btn {
  background: none;
  border: none;
  color: #666;
  padding: 8px 16px;
  cursor: pointer;
}

.btn-icon {
  margin-right: 8px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background-color: #f5f5f5;
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.status.presente {
  background-color: #E8F5E8;
  color: #2E7D32;
}

.status.ausente {
  background-color: #FFEBEE;
  color: #C62828;
}

.no-data {
  padding: 40px;
  text-align: center;
  color: #666;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: white;
  width: 600px;
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.dialog-header {
  padding: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.dialog-content {
  padding: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-weight: bold;
  font-size: 0.9rem;
  color: #666;
}

.students-list h3 {
  margin-bottom: 16px;
  color: #333;
}

.student-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.student-info {
  display: flex;
  flex-direction: column;
}

.student-name {
  font-weight: bold;
}

.student-id {
  font-size: 0.8rem;
  color: #666;
}

.attendance-btn {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.attendance-btn.present {
  background-color: #E8F5E8;
  border-color: #2E7D32;
  color: #2E7D32;
}

.dialog-actions {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>