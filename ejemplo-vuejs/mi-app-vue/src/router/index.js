import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue"; // Tu nuevo componente de login
import EstudiantesList from "../views/EstudiantesList.vue"; // Tu nuevo componente de lista de estudiantes
import EstudianteDetail from "../views/EstudianteDetail.vue"; // ¡Importa el nuevo componente!
import createEstudent from "../views/createEstudent.vue";
import createTelefono from "../views/createTelefono.vue";
import listarTelefonos from "../views/listarTelefonos.vue";
import deleteStudent from "../views/deletStudent.vue";
import deleteTelefono from "../views/deletTelefono.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/estudiantes",
    name: "EstudiantesList",
    component: EstudiantesList,
    meta: { requiresAuth: true }, // Marca esta ruta como protegida
  },
  {
    path: "/estudiantes/detail/:estudianteUrl*", // <-- ¡Cambio clave aquí!
    name: "EstudianteDetail",
    component: EstudianteDetail,
    props: true, // Esto pasa el ':id' como una prop al componente EstudianteDetail
    meta: { requiresAuth: true },
  },
  {
    path: "/createEstudent",
    name: "createEstudent",
    component: createEstudent,
    meta: { requiresAuth: true },
  },
  {
    path: "/createTelefono",
    name: "createTelefono",
    component: createTelefono,
    meta: { requiresAuth: true },
  },
  {
    path: "/listarTelefonos",
    name: "listarTelefonos",
    component: listarTelefonos,
    meta: { requiresAuth: true },
  },
  {
    path: "/deleteStudent",
    name: "deleteStudent",
    component: deleteStudent,
    meta: { requiresAuth: true },
  },
  {
    path: "/deleteTelefono",
    name: "deleteTelefono",
    component: deleteTelefono,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Guarda de navegación para rutas protegidas
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem("authToken")) {
    next("/login"); // Redirige al login si no está autenticado
  } else {
    next();
  }
});

export default router;
