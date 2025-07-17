<template>
  <div class="estudiantes-list-container">
    <h2>Funcionalidad de creación de estudiantes</h2>
    <form @submit.prevent="createEstudiante">
      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" v-model="nombre" required />
      </div>
      <div class="form-group">
        <label for="apellido">Apellido:</label>
        <input type="text" id="apellido" v-model="apellido" required />
      </div>
      <div class="form-group">
        <label for="cedula">Cédula:</label>
        <input type="text" id="cedula" v-model="cedula" required />
      </div>
      <div class="form-group">
        <label for="correo">Correo:</label>
        <input type="email" id="correo" v-model="correo" required />
      </div>
      <button type="submit">Crear Estudiante</button>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "createEstudent",
  data() {
    return {
      estudiantes: [],
      loading: true,
      error: null,
    };
  },
  async created() {
    await this.createEstudiante();
  },
  methods: {
    async createEstudiante() {
      try {
        console.log("Creando estudiante...");
        this.loading = true;
        this.error = null;
        const token = localStorage.getItem("authToken");
        api.defaults.headers.common["Authorization"] = `Token ${token}`;
        const response = await api.post("estudiantes/", {
          nombre: this.nombre,
          apellido: this.apellido,
          cedula: this.cedula,
          correo: this.correo,
        });
        console.log("Response:", response);
        this.estudiantes.push(response.data);
        console.log("Estudiante creado:", response.data);
      } catch (err) {
        console.error("Error al crear estudiante:", err.response || err);
        this.error =
          "No se pudo crear el estudiante. Asegúrate de estar logueado.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
