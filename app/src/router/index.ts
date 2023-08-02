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
      component: () =>
        import("../components/fragments/HourCalendarSelection.vue"),
    },
    {
      path: "/student/personal-data",
      name: "personal_data",
      component: () => import("../components/fragments/PersonalInfo.vue"),
    },
    {
      path: "/student/panel",
      name: "student_panel",
      component: () => import("../views/StudentView.vue"),
      props: (route) => ({
        user: route.query.user,
      }),
    },

    {
      path: "/professor/panel",
      name: "professor_panel",
      component: () => import("../views/ProfessorView.vue"),
      props: (route) => ({
        user: route.query.user,
      }),
    },

    {
      path: "/tasks/:id",
      name: "student_task",
      component: () => import("../views/StudentTaskView.vue"),
      props: true,
    },

    {
      path: "/editor",
      name: "doc_editor",
      component: () => import("../views/DocumentEditorView.vue"),
      props: true,
    },
  ],
});

export default router;
