
<style scoped>
.selection-calendar {
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
}

.selection-calendar .header {
  background-color: #9B6FF5;
  color: #ffffff;
}

.week-days {
  width: 100%;
}
</style>

<template>
  <v-card fluid class="selection-calendar">
    <v-toolbar class="header">
      <v-toolbar-title>Seleccionar disponibilidad para recibir notificaciones</v-toolbar-title>
      <v-btn @click="validateHours()">Guardar</v-btn>
    </v-toolbar>

    <v-container fluid class="weekdays">
      <v-row class="text-center">
        <v-col v-for="(day, i) in daysOfWeek" :key="i">
          <strong>{{ day }}</strong>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid>
      <v-row v-for="(hour, i) in hours" :key="i">
        <v-col v-for="(day, j) in daysOfWeek" :key="j">
          <v-btn :color="selectedHours[j][i] ? 'primary' : ''" @click="selectedHours[j][i] = !selectedHours[j][i]"
            block>{{ hour }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import { format, eachHourOfInterval, startOfDay, endOfDay, setHours } from 'date-fns'

export default {
  name: 'HourCalendarSelection',

  setup() {
    const daysOfWeek = ["Lun.", "Mar.", "Mié.", "Jue.", "Vie.", "Sáb.", "Dom."]
    const selectedHours = reactive(Array(7).fill(0).map(() => Array(24).fill(false)))

    const startHour = setHours(startOfDay(new Date()), 7);
    const endHour = setHours(endOfDay(new Date()), 20);

    const hours = eachHourOfInterval({
      start: startHour,
      end: endHour
    }).map(date => format(date, 'HH:mm'))



    return {
      daysOfWeek,
      selectedHours,
      hours,
    }
  },

  methods: {
    saveHours() {
      this.$router.push('/student/personal-data');
    },

    validateHours() {
      let totalHours = this.selectedHours.reduce((sum, day) => sum + day.filter(Boolean).length, 0)

      if (totalHours < 5) {
        alert('Selecciona por lo menos cinco horas a la semana') // Replace alert with console.warn or any other method you prefer
      } else {
        this.saveHours();
      }
    }
  }

}
</script>
