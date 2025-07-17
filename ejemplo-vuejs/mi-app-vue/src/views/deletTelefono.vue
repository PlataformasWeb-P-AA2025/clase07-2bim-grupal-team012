<template>
  <div class="estudiantes-list-container">
    <h2>Listado Telefonos</h2>
    <p v-if="loading">Cargando Telefonos...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <ul v-else-if="telefonos.length">
      <li
        v-for="telefono in telefonos"
        :key="telefono.url"
        class="estudiante-item"
      >
        {{ telefono.telefono }} {{ telefono.tipo }}
        (Estudiante:
        <span v-if="estudiantesDetalle[telefono.estudiante]">
          {{ estudiantesDetalle[telefono.estudiante].nombre }}
          {{ estudiantesDetalle[telefono.estudiante].apellido }}
        </span>
        <span v-else>Desconocido</span>
        )
        <button @click="deleteTelefono(telefono.url)">Eliminar</button>
      </li>
    </ul>
    <p v-else>No hay telefonos registrados.</p>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "telefonosList",
  data() {
    return {
      telefonos: [],
      estudiantesDetalle: {},
      loading: true,
      error: null,
    };
  },
  async created() {
    await this.fetchTelefonos();
  },
  methods: {
    async fetchTelefonos() {
      try {
        this.loading = true;
        this.error = null;

        const token = localStorage.getItem("authToken");
        api.defaults.headers.common["Authorization"] = `Token ${token}`;
        const response = await api.get("numerosts/");
        this.telefonos = response.data.results || response.data;

        for (const telefono of this.telefonos) {
          const url = telefono.estudiante;
          if (!this.estudiantesDetalle[url]) {
            this.fetchEstudianteDetail(url);
          }
        }
      } catch (err) {
        console.error("Error al cargar telefonos:", err.response || err);
        this.error =
          "No se pudieron cargar los telefonos. Asegúrate de estar logueado.";
      } finally {
        this.loading = false;
      }
    },
    async fetchEstudianteDetail(url) {
      try {
        const response = await api.get(url);
        this.estudiantesDetalle[url] = {
          nombre: response.data.nombre,
          apellido: response.data.apellido,
        };
      } catch (err) {
        console.error(
          `Error al cargar estudiante en ${url}:`,
          err.response || err
        );
        this.estudiantesDetalle[url] = {
          nombre: "Desconocido",
          apellido: "",
        };
      }
    },
    async deleteTelefono(url) {
      try {
        this.loading = true;
        this.error = null;
        const token = localStorage.getItem("authToken");
        api.defaults.headers.common["Authorization"] = `Token ${token}`;
        await api.delete(url);
        this.telefonos = this.telefonos.filter(
          (telefono) => telefono.url !== url
        );
      } catch (err) {
        console.error("Error al eliminar telefono:", err.response || err);
        this.error =
          "No se pudo eliminar el telefono. Asegúrate de estar logueado.";
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
