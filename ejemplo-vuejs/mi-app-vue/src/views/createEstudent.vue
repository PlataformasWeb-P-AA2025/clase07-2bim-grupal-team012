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

<style scoped>
.estudiantes-list-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

.estudiante-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.estudiante-item:last-child {
  border-bottom: none;
}

.estudiante-item a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

.estudiante-item a:hover {
  text-decoration: underline;
}

.add-button {
  display: block;
  width: fit-content;
  margin: 20px auto 0;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #218838;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
