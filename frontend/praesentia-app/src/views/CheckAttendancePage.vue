<template>
  <div class="page">
    <h1>Registro de Asistencia</h1>

    <div class="card">
      <p>Presiona el siguiente botón para registrar tu asistencia usando tu ubicación actual.</p>

      <button class="btn" @click="registrarAsistencia" :disabled="cargando">
        {{ cargando ? "Validando ubicación..." : "Registrar Asistencia" }}
      </button>

      <p v-if="mensaje" :class="estadoOk ? 'success' : 'error'">
        {{ mensaje }}
      </p>
    </div>
  </div>
</template>

<script>
import api from "@/api/index.js";

export default {
  name: "CheckAttendancePage",

  data() {
    return {
      cargando: false,
      mensaje: "",
      estadoOk: false
    };
  },

  methods: {
    obtenerUbicacion() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject("Geolocalización no soportada");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              lat: pos.coords.latitude,
              lon: pos.coords.longitude
            });
          },
          (err) => reject("No se pudo obtener la ubicación: " + err.message),
          { enableHighAccuracy: true }
        );
      });
    },

    async registrarAsistencia() {
      this.cargando = true;
      this.mensaje = "";

      try {
        const { lat, lon } = await this.obtenerUbicacion();

        console.log(lat);
        console.log(lon);

        const payload = {
          student_id: 2,
          session_id: 10,
          lat,
          lon
        };

        console.log("Antes de post");
        const res = await api.post("/attendance/register", payload);
        console.log("Despues de post");

        console.log("Respuesta:", res.data);
        const { status, distance_meters, allowed_radius } = res.data;

        if(status == "present"){
            this.estadoOk = true;
            this.mensaje = "Asistencia registrada correctamente ✔️";
        }else {
            this.estadoOk = false;
            this.mensaje = "Asistencia no registrada ✖️";
        }
      } catch (err) {
        this.estadoOk = false;

        if (err.response?.data?.error) {
          this.mensaje = "Error: " + err.response.data.error;
        } else {
          this.mensaje = err.message || "Error inesperado";
        }
      }

      this.cargando = false;
    }
  }
};
</script>

<style scoped>
.page {
  padding: 20px;
  max-width: 600px;
  margin: auto;
}

.card {
  padding: 20px;
  border-radius: 8px;
  background: #fafafa;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.btn {
  padding: 12px 20px;
  background: #1976D2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  font-size: 1.1rem;
}

.btn:disabled {
  background: #8ab5df;
  cursor: not-allowed;
}

.success {
  color: #2e7d32;
  font-weight: bold;
  margin-top: 15px;
}

.error {
  color: #d32f2f;
  font-weight: bold;
  margin-top: 15px;
}
</style>
