<style src="@/assets/styles/dashboard/dashboard.css"></style>

<template>
  <div class="dashboard">
    <v-tabs class="tabs-menu" fixed-tabs align-tabs="center" v-model="tab">
      <v-tab class="tab" value="pending">Por hacer</v-tab>
      <v-tab class="tab" value="notifications">Notificaciones</v-tab>
    </v-tabs>

    <v-window class="windows-container" v-model="tab">
      <v-window-item class="window-item scrollable" value="pending">
        <Pending/>
      </v-window-item>

      <v-window-item class="window-item" value="notifications">
        <Notifications/>
      </v-window-item>

    </v-window>
  </div>
</template>
  
<script lang="ts">
import Pending from "./dashboard/Pending.vue";
import Notifications from "./dashboard/Notifications.vue";


export default {
  name: 'Dashboard',

  components:{
    Pending,
    Notifications
  },

  data: () => ({
    tab: 'notifications',
  }),
}
</script>
  
