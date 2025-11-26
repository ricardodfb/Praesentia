<template>
  <div>
    <!-- Barra superior -->
    <div class="app-bar">
      <div class="toolbar-title">Sistema de Administración de Cursos</div>
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
          v-model="busqueda"
          class="search-input"
        >
        <div class="spacer"></div>
        <button class="primary-btn" @click="abrirDialogNuevo">
          Nuevo Curso
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
          <tr v-for="curso in cursosFiltrados" :key="curso.id">
            <td>{{ curso.code }}</td>
            <td>{{ curso.name }}</td>
            <td>{{ curso.profesor_nombre }}</td>
            <td>{{ curso.horario || "No asignado" }}</td>
            <td class="actions">
              <button class="icon-btn-small" @click="editarCurso(curso)">✏️</button>
              <button class="icon-btn-small" @click="eliminarCurso(curso)">🗑️</button>
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
            <label>Clave *</label>
            <input type="text" v-model="cursoEditado.code" class="text-input">
          </div>

          <div class="form-field">
            <label>Nombre de la Clase *</label>
            <input type="text" v-model="cursoEditado.name" class="text-input">
          </div>

          <div class="form-field">
            <label>ID del Docente *</label>
            <input type="text" v-model="cursoEditado.profesor_id" class="text-input">
          </div>

          <div class="form-field">
            <label>Horario (solo visual)</label>
            <input type="text" v-model="cursoEditado.horario" class="text-input">
          </div>
        </div>

        <div class="dialog-actions">
          <button class="secondary-btn" @click="cerrarDialog">Cancelar</button>
          <button class="primary-btn" @click="guardarCurso">
            Guardar
          </button>
        </div>
      </div>
    </div>

    <!-- Dialog Eliminar -->
    <div v-if="dialogEliminarVisible" class="dialog-overlay" @click="cerrarDialogEliminar">
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <div class="dialog-title">Eliminar Curso</div>
        </div>

        <div class="dialog-content">
          <p>¿Eliminar "{{ cursoAEliminar.name }}"?</p>
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
import api from "@/api";

export default {
  name: "AdminClases",

  data() {
    return {
      dialogVisible: false,
      dialogEliminarVisible: false,
      editando: false,
      busqueda: "",

      cursos: [],

      cursoEditado: {
        id: null,
        code: "",
        name: "",
        profesor_id: "",
        horario: ""
      },

      cursoAEliminar: {}
    };
  },

  computed: {
    dialogTitle() {
      return this.editando ? "Editar Curso" : "Nuevo Curso";
    },

    cursosFiltrados() {
      return this.cursos.filter(
        c =>
          c.code.toLowerCase().includes(this.busqueda.toLowerCase()) ||
          c.name.toLowerCase().includes(this.busqueda.toLowerCase()) ||
          c.profesor_nombre?.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }
  },

  mounted() {
    this.cargarCursos();
  },

  methods: {
    async cargarCursos() {
      try {
        const res = await api.get("/query/courses");
        this.cursos = res.data;
      } catch (err) {
        console.error("Error cargando cursos:", err);
      }
    },

    abrirDialogNuevo() {
      this.editando = false;
      this.cursoEditado = {
        id: null,
        code: "",
        name: "",
        profesor_id: "",
        horario: ""
      };
      this.dialogVisible = true;
    },

    editarCurso(curso) {
      this.editando = true;
      this.cursoEditado = { ...curso };
      this.dialogVisible = true;
    },

    eliminarCurso(curso) {
      this.cursoAEliminar = curso;
      this.dialogEliminarVisible = true;
    },

    async guardarCurso() {
      try {
        if (this.editando) {
          await api.put(`/courses/${this.cursoEditado.id}`, this.cursoEditado);
        } else {
          await api.post("/courses/create", this.cursoEditado);
        }

        this.dialogVisible = false;
        this.cargarCursos();
      } catch (err) {
        console.error("Error guardando curso:", err);
      }
    },

    async confirmarEliminar() {
      try {
        await api.delete(`/courses/${this.cursoAEliminar.id}`);
        this.dialogEliminarVisible = false;
        this.cargarCursos();
      } catch (err) {
        console.error("Error eliminando curso:", err);
      }
    },

    cerrarDialog() {
      this.dialogVisible = false;
    },

    cerrarDialogEliminar() {
      this.dialogEliminarVisible = false;
    }
  }
};
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
