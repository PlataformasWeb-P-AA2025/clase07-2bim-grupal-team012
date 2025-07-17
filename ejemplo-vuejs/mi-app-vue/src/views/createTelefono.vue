<template>
  <div class="estudiantes-list-container">
    <h2>Funcionalidad de creación de telefonos</h2>

    <div v-if="loading" class="loading-message">Cargando estudiantes...</div>

    <form v-else @submit.prevent="createTelefono">
      <div class="form-group">
        <label for="numero">Telefono:</label>
        <input type="text" id="numero" v-model="telefono" required />
      </div>

      <div class="form-group">
        <label for="tipo">Tipo:</label>
        <input type="text" id="tipo" v-model="tipo" required />
      </div>

      <div class="form-group">
        <label for="estudiante">Estudiante:</label>
        <select id="estudiante" v-model="estudianteSeleccionado" required>
          <option value="">Selecciona un estudiante</option>
          <option v-for="est in estudiantes" :key="est.url" :value="est.url">
            {{ est.nombre }} {{ est.apellido }}
          </option>
        </select>
      </div>

      <button type="submit">Crear Telefono</button>
    </form>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "createTelefono",
  data() {
    return {
      estudiantes: [],
      loading: false,
      telefono: "",
      tipo: "",
      estudiante: "",
      error: null,
    };
  },
  async created() {
    await this.getEstudiantes();
  },
  methods: {
    async getEstudiantes() {
      try {
        this.loading = true;
        this.error = null;
        this.estudiantes = [];

        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No hay token de autenticación");
        }

        api.defaults.headers.common["Authorization"] = `Token ${token}`;
        const response = await api.get("estudiantes/");

        if (response.data && Array.isArray(response.data)) {
          this.estudiantes = response.data;
          console.log("Estudiantes obtenidos:", response.data);
        } else if (response.data && response.data.results) {
          this.estudiantes = response.data.results;
        } else {
          throw new Error("Formato de respuesta inválido");
        }
      } catch (err) {
        console.error("Error al obtener estudiantes:", err);
        this.error =
          "No se pudieron cargar los estudiantes. Verifica tu conexión.";
        this.estudiantes = [];
      } finally {
        this.loading = false;
      }
    },
    async createTelefono() {
      try {
        console.log("Creando telefono...");
        console.log("Estudiante seleccionado:", this.estudianteSeleccionado);
        this.loading = true;
        this.error = null;

        const token = localStorage.getItem("authToken");
        api.defaults.headers.common["Authorization"] = `Token ${token}`;

        const response = await api.post("numerosts/", {
          telefono: this.telefono,
          tipo: this.tipo,
          estudiante: this.estudianteSeleccionado,
        });

        console.log("Telefono creado:", response.data);

        this.telefono = "";
        this.tipo = "";
        this.estudiante = "";

        alert("Teléfono creado exitosamente!");
      } catch (err) {
        console.error("Error al crear telefono:", err.response || err);
        this.error = "No se pudo crear el telefono. Verifica los datos.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
