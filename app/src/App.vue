<style>
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400&display=swap');
</style>

<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'App',
  

  data() {
    return {

    }
  },

  setup() {

  },
})
</script>
