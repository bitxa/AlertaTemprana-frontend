<style scoped src="@/assets/styles/dashboard/notifications/notifications.css"></style>

<template>
    <div class="d-flex flex-row notifications-window">
        <v-tabs class="notifications-menu" v-model="notification_tab" direction="vertical">
            <v-tab value="recents">Recientes</v-tab>
            <v-tab value="all">Todas</v-tab>
        </v-tabs>

        <v-window class="notifications-container scrollable" v-model="notification_tab">
            <v-window-item class="window-item" value="recents">
                <Recents/>
            </v-window-item>

            <v-window-item class="window-item" value="importants">
                <Recents/>
            </v-window-item>

            <v-window-item class="window-item" value="all">
                <Recents />
            </v-window-item>
        </v-window>
    </div>
</template>

<script lang="ts">

import Recents from "./notifications/Recents.vue"

export default {
    name: "Notifications",
    components: {
        Recents
    },
    data: () => ({
        notification_tab: 'recents',
    })
}
</script>
  
