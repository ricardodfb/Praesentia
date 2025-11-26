import { createRouter, createWebHistory } from "vue-router";

import AdminClases from "../views/AdminClases.vue";
import AlumnoClases from "../views/AlumnoClases.vue";
import ProfesorClases from "../views/ProfesorClases.vue";
import LocationPage from "../views/LocationPage.vue";

const routes = [
  { path: "/", component: AlumnoClases },
  { path: "/admin/clases", component: AdminClases },
  { path: "/profesor/clases", component: ProfesorClases },
  { path: "/location", component: LocationPage },
  { path: "/check-attendance", name: "CheckAttendance", component: () => import("@/views/CheckAttendancePage.vue") }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
