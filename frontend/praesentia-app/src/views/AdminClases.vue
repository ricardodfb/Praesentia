<template>
  <div>
    <!-- Barra superior -->
    <div class="app-bar">
      <div class="toolbar-title">Sistema de Administración de Clases</div>
      <div class="spacer"></div>
      <button class="icon-btn">
        <span>👤</span>
      </button>
    </div>

    <!-- Contenido principal -->
    <div class="card">
      <div class="toolbar">
        <input 
          type="text" 
          placeholder="Buscar registro..." 
          class="search-input"
        >
        <div class="spacer"></div>
        <button class="primary-btn" @click="abrirDialogNuevo">
          <span class="btn-icon"></span>
          Nuevo Registro
        </button>
      </div>

      <!-- Tabla -->
      <table class="data-table">
        <thead>
          <tr>
            <th>Clave</th>
            <th>Nombre de la Clase</th>
            <th>Docente</th>
            <th>Horario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="clase in clases" :key="clase.id">
            <td>{{ clase.clave }}</td>
            <td>{{ clase.nombre }}</td>
            <td>{{ clase.docente }}</td>
            <td>{{ clase.horario }}</td>
            <td class="actions">
              <button class="icon-btn-small" @click="editarClase(clase)">
                <span></span>
              </button>
              <button class="icon-btn-small" @click="eliminarClase(clase)">
                <span>🗑️</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Dialog Nuevo/Editar -->
    <div v-if="dialogVisible" class="dialog-overlay" @click="cerrarDialog">
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <div class="dialog-title">{{ dialogTitle }}</div>
        </div>
        
        <div class="dialog-content">
          <div class="form-field">
            <label>Clave de la Clase *</label>
            <input type="text" v-model="claseEditada.clave" class="text-input">
          </div>
          
          <div class="form-field">
            <label>Nombre de la Clase *</label>
            <input type="text" v-model="claseEditada.nombre" class="text-input">
          </div>
          
          <div class="form-field">
            <label>Nombre del Docente *</label>
            <input type="text" v-model="claseEditada.docente" class="text-input">
          </div>
          
          <div class="form-field">
            <label>Horario *</label>
            <input 
              type="text" 
              v-model="claseEditada.horario" 
              placeholder="Ej: Lunes y Miércoles 10:00-12:00" 
              class="text-input"
            >
          </div>
          
          <small class="required-text">* Campos obligatorios</small>
        </div>
        
        <div class="dialog-actions">
          <button class="secondary-btn" @click="cerrarDialog">Cancelar</button>
          <button class="primary-btn" @click="guardarClase">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Dialog Eliminar -->
    <div v-if="dialogEliminarVisible" class="dialog-overlay" @click="cerrarDialogEliminar">
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <div class="dialog-title">Confirmar Eliminación</div>
        </div>
        
        <div class="dialog-content">
          <p>¿Está seguro de que desea eliminar la clase "{{ claseAEliminar.nombre }}"?</p>
        </div>
        
        <div class="dialog-actions">
          <button class="secondary-btn" @click="cerrarDialogEliminar">Cancelar</button>
          <button class="danger-btn" @click="confirmarEliminar">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminClases',
  
  data() {
    return {
      dialogVisible: false,
      dialogEliminarVisible: false,
      editando: false,
      
      clases: [
        {
          id: 1,
          clave: 'MAT101',
          nombre: 'Matemáticas Básicas',
          docente: 'Dr. Juan Pérez',
          horario: 'Lunes y Miércoles 08:00-10:00'
        },
        {
          id: 2,
          clave: 'FIS201',
          nombre: 'Física General',
          docente: 'Dra. María García',
          horario: 'Martes y Jueves 14:00-16:00'
        },
        {
          id: 3,
          clave: 'PROG301',
          nombre: 'Programación Avanzada',
          docente: 'Ing. Carlos López',
          horario: 'Viernes 09:00-13:00'
        }
      ],
      
      claseEditada: {
        id: null,
        clave: '',
        nombre: '',
        docente: '',
        horario: ''
      },
      
      claseAEliminar: {}
    }
  },

  computed: {
    dialogTitle() {
      return this.editando ? 'Editar Clase' : 'Nueva Clase'
    }
  },

  methods: {
    abrirDialogNuevo() {
      this.editando = false
      this.claseEditada = {
        id: null,
        clave: '',
        nombre: '',
        docente: '',
        horario: ''
      }
      this.dialogVisible = true
    },

    editarClase(clase) {
      this.editando = true
      this.claseEditada = { ...clase }
      this.dialogVisible = true
    },

    eliminarClase(clase) {
      this.claseAEliminar = clase
      this.dialogEliminarVisible = true
    },

    guardarClase() {
      console.log('Guardando clase:', this.claseEditada)
      this.dialogVisible = false
    },

    confirmarEliminar() {
      console.log('Eliminando clase:', this.claseAEliminar)
      this.dialogEliminarVisible = false
    },

    cerrarDialog() {
      this.dialogVisible = false
    },

    cerrarDialogEliminar() {
      this.dialogEliminarVisible = false
    }
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

.search-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 16px;
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

.danger-btn {
  background-color: #D32F2F;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
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

.actions {
  display: flex;
  gap: 8px;
}

.icon-btn-small {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
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

.form-field {
  margin-bottom: 16px;
}

.form-field label {
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
}

.text-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.required-text {
  color: #666;
}

.dialog-actions {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>