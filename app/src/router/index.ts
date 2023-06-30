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
      path: "/student/panel",
      name: "student_panel",
      component: () => import("../views/StudentView.vue"),
    },
  ],
});

export default router;
