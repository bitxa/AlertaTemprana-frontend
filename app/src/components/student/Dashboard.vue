<style src="@/assets/styles/dashboard/dashboard.css"></style>

<template>
  <div class="dashboard">
    <div class="resume">
      <span>Hola nuevamente, <b id="username">{{ store.getCurrentUser?.username }}</b></span>
      <div class="resume-content">
        <div class="statistics">
          <div class="pending">
            <div class="circle circle_pending">
              <span id="pendingTasks">1</span>
              <small>tareas</small>
            </div>
            <p>Por hacer</p>
          </div>

          <div class="in-progress">
            <div class="circle circle_in-progress ">
              <span id="inProgressTasks">0</span>
              <small>tareas</small>

            </div>
            <p>En progreso</p>
          </div>

          <div class="done">
            <div class="circle circle_done">
              <span id="doneTasks">0</span>
              <small>tareas</small>

            </div>
            <p>Terminadas</p>

          </div>
        </div>
        <div class="user-3d-model">
          <img src="/src/assets/img/man_sit.jpg" alt="User 3D Model" class="user-3d-model-img">
        </div>
      </div>
    </div>
    <v-timeline class="timeline-info" side="end">
      <v-timeline-item v-for="item in items" :key="item.id" :dot-color="item.color" size="small">
        <v-alert :value="true" :color="item.color">
          <v-alert-icon class="ma-2">
            <v-icon>
              <TiNews />
            </v-icon>
          </v-alert-icon>
          {{ item.content }}
        </v-alert>
      </v-timeline-item>
    </v-timeline>

    <v-tabs class="tabs-menu" fixed-tabs align-tabs="center" v-model="tab">
      <v-tab class="tab" value="all_tasks">Tareas</v-tab>
      <v-tab class="tab" value="notifications">Anuncios</v-tab>
    </v-tabs>

    <v-window c lass="windows-container" v-model="tab">
      <v-window-item class="window-item" value="all_tasks">
        <AllTasks />
      </v-window-item>

      <v-window-item class="window-item" value="notifications">
        <Notifications />
      </v-window-item>

    </v-window>
  </div>
</template>
  
<script lang="ts">
import AllTasks from "./dashboard/AllTasks.vue";
import Notifications from "./dashboard/Notifications.vue";
import { TiNews } from "@kalimahapps/vue-icons";
import { useStore } from '@/stores/store';

export default {
  name: 'Dashboard',

  components: {
    TiNews,
    AllTasks,
    Notifications
  },

  data: () => ({
    tab: 'all_tasks',
    store: useStore(),
    items: [
      {
        id: 1,
        color: 'info',
        content: 'Recuerde que las prácticas deben desarrollarse dentro del calendario del periodo académico Abril-Agosto 2023. En lo posible considerar dentro de la planificación que las prácticas concluyan antes de la semana 16. ',
      },
      {
        id: 2,
        color: 'success',
        content: 'En la semana 16, el estudiante deberá concluir y presentar el informe final de las prácticas realizadas, y así mismo, el tutor externo calificará su desempeño como estudiante.'
      },
    ],
  }),


}
</script>
  
