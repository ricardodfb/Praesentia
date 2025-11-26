<template>
  <div>
    <!-- Barra superior -->
    <div class="app-bar">
      <div class="toolbar-title">Sistema de Asistencia - Alumnos</div>
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
        </div>
        
        <div class="spacer"></div>
        <button class="primary-btn" @click="abrirDialogRegistro">
          <span class="btn-icon"></span>
          Registrar Asistencia
        </button>
      </div>

      <!-- Tabla de asistencias -->
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Hora de Registro</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(asistencia, index) in asistenciasFiltradas" :key="asistencia.id">
            <td>{{ index + 1 }}</td>
            <td>{{ asistencia.fecha }}</td>
            <td>{{ asistencia.hora || 'No registrado' }}</td>
            <td>
              <span :class="['status', asistencia.estado]">
                {{ asistencia.estado }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mensaje cuando no hay datos -->
      <div v-if="asistenciasFiltradas.length === 0" class="no-data">
        <p>No hay registros de asistencia para esta clase</p>
      </div>
    </div>

    <!-- Dialogo para registrar asistencia -->
    <div v-if="dialogRegistroVisible" class="dialog-overlay" @click="cerrarDialogRegistro">
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <div class="dialog-title">Registrar Asistencia</div>
        </div>
        
        <div class="dialog-content">
          <v-form>
            <div class="form-field">
              <label>Clase *</label>
              <select v-model="nuevoRegistro.clase" class="select-input" required>
                <option value="">Seleccione una clase</option>
                <option v-for="clase in clasesDisponibles" :key="clase.id" :value="clase.clave">
                  {{ clase.clave }} - {{ clase.nombre }}
                </option>
              </select>
            </div>
            
            <div class="form-field">
              <label>Fecha *</label>
              <input 
                type="date" 
                v-model="nuevoRegistro.fecha" 
                class="text-input"
                required
              >
            </div>

            <!-- Informacion de disponibilidad -->
            <div v-if="mostrarInfoDisponibilidad" class="availability-info">
              <div v-if="asistenciaDisponible" class="available">
                <span class="availability-icon"></span>
                <span>Asistencia disponible para registrar</span>
              </div>
              <div v-else class="not-available">
                <span class="availability-icon"></span>
                <span>No se puede registrar asistencia en esta fecha</span>
              </div>
            </div>
          </v-form>
          <small>* Campos obligatorios</small>
        </div>
        
        <div class="dialog-actions">
          <button class="secondary-btn" @click="cerrarDialogRegistro">Cancelar</button>
          <button 
            class="primary-btn" 
            @click="registrarAsistencia"
            :disabled="!asistenciaDisponible"
          >
            Registrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlumnosAsistencia',
  
  data() {
    return {
      dialogRegistroVisible: false,
      
      filtros: {
        clase: ''
      },
      
      nuevoRegistro: {
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
          clase: 'MAT101',
          fecha: '2024-01-15',
          hora: '08:05 AM',
          estado: 'presente'
        },
        {
          id: 2,
          clase: 'MAT101',
          fecha: '2024-01-17',
          hora: '08:02 AM',
          estado: 'presente'
        },
        {
          id: 3,
          clase: 'MAT101',
          fecha: '2024-01-19',
          hora: null,
          estado: 'ausente'
        },
        {
          id: 4,
          clase: 'FIS201',
          fecha: '2024-01-16',
          hora: '02:10 PM',
          estado: 'presente'
        },
        {
          id: 5,
          clase: 'FIS201',
          fecha: '2024-01-18',
          hora: null,
          estado: 'ausente'
        },
        {
          id: 6,
          clase: 'PROG301',
          fecha: '2024-01-17',
          hora: '09:05 AM',
          estado: 'presente'
        }
      ]
    }
  },

  computed: {
    asistenciasFiltradas() {
      if (!this.filtros.clase) {
        return []
      }
      return this.asistencias.filter(a => a.clase === this.filtros.clase)
    },

    clasesDisponibles() {
      return this.clases
    },

    mostrarInfoDisponibilidad() {
      return this.nuevoRegistro.clase && this.nuevoRegistro.fecha
    },

    asistenciaDisponible() {
      if (!this.mostrarInfoDisponibilidad) {
        return false
      }
      
      // simulacion de disponibilidad
      // En una app real, esto verificaría contra el horario de la clase
      const fechaSeleccionada = new Date(this.nuevoRegistro.fecha)
      const hoy = new Date()
      
      // Solo permitir registrar para fechas pasadas o hoy
      // y solo si no hay ya un registro para esa fecha y clase
      const yaRegistrado = this.asistencias.some(a => 
        a.clase === this.nuevoRegistro.clase && 
        a.fecha === this.nuevoRegistro.fecha
      )
      
      return fechaSeleccionada <= hoy && !yaRegistrado
    }
  },

  methods: {
    abrirDialogRegistro() {
      this.nuevoRegistro = {
        clase: '',
        fecha: ''
      }
      this.dialogRegistroVisible = true
    },

    registrarAsistencia() {
      if (!this.asistenciaDisponible) return
      
      const now = new Date()
      const nuevaAsistencia = {
        id: Date.now(),
        clase: this.nuevoRegistro.clase,
        fecha: this.nuevoRegistro.fecha,
        hora: now.toTimeString().split(' ')[0].substring(0, 5) + ' AM',
        estado: 'presente'
      }
      
      this.asistencias.push(nuevaAsistencia)
      console.log('Asistencia registrada:', nuevaAsistencia)
      
      // Si la clase filtrada es la misma que se registro, actualizar filtro
      if (this.filtros.clase === this.nuevoRegistro.clase) {
        this.filtros.clase = this.nuevoRegistro.clase
      }
      
      this.cerrarDialogRegistro()
    },

    cerrarDialogRegistro() {
      this.dialogRegistroVisible = false
      this.nuevoRegistro = {
        clase: '',
        fecha: ''
      }
    }
  },

  mounted() {
    // Establecer fecha actual por defecto en el dialogo
    const today = new Date().toISOString().split('T')[0]
    this.nuevoRegistro.fecha = today
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

.primary-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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
  width: 500px;
  border-radius: 8px;
  max-width: 90vw;
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

.availability-info {
  margin: 16px 0;
  padding: 12px;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.available {
  color: #2E7D32;
  display: flex;
  align-items: center;
  gap: 8px;
}

.not-available {
  color: #C62828;
  display: flex;
  align-items: center;
  gap: 8px;
}

.availability-icon {
  font-size: 1.2rem;
}

.dialog-actions {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>