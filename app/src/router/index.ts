import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },

    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },

    {
      path: "/student/select-hours",
      name: "select_hours",
      component: () => import("../components/fragments/HourCalendarSelection.vue"),
    },

    {
      path: "/student/panel",
      name: "student_panel",
      component: () => import("../views/StudentView.vue"),
    },

    {
      path: "/professor/panel",
      name: "professor_panel",
      component: () => import("../views/ProfessorView.vue"),
    },
  ],
});

export default router;
