<style src="@/assets/styles/dashboard/calendar/calendar.css"></style>

<template>
  <v-card class="month-calendar scrollable">
    <div class="header">
      <button @click="prevMonth">
        <AkCircleChevronLeftFill />
      </button>

      <div class="date">
        <div class="month">
          <h2>{{ currentMonth }}</h2>
        </div>

        <select v-model="selectedYear" class="year" @change="updateSelectedYear">
          <option v-for="year in years" :value="year" :key="year" class="selected-year">{{ year }}</option>
        </select>
      </div>
      <button @click="nextMonth">
        <AkCircleChevronRightFill />
      </button>
    </div>
    <div class="weekdays">
      <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
    </div>
    <div class="days">
      <v-card v-for="day in days" :key="day.date" class="day" :class="{ 'isToday': isToday(day.date)}" >
        <div class="day-number">{{ day.date }}</div>
        <div class="events">

          <v-dialog v-model="activeDialog" transition="dialog-top-transition" width="auto" class="event">
            <template v-slot:activator="{ props }">
              <button v-for="event in getEventsForDay(day.date)" :key="event.id" class="event-btn"
                @click="openDialog(event)">
                {{ event.title }}
                <FlFilledWindowNew class="task-icon" />

                <v-tooltip activator="parent" location="end">{{ event.title }}</v-tooltip>
              </button>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-toolbar density="compact" width="auto">
                  <v-toolbar-title>
                    {{ activeEvent.title }}
                  </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <div><b>Entrega: </b>{{ `${activeEvent.day}/${activeEvent.month}/${activeEvent.year}` }}</div>
                  <div><b>Detalles: </b>{{ activeEvent.description }}</div>
                  <v-btn density="comfortable" variant="tonal" color="#5865f2" class="mt-1">Ver tarea</v-btn>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn variant="text" @click="isActive.value = false">Volver</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </div>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import { AkCircleChevronLeftFill } from "@kalimahapps/vue-icons";
import { AkCircleChevronRightFill } from "@kalimahapps/vue-icons";
import { FlFilledWindowNew } from "@kalimahapps/vue-icons";
export default {
  components: {
    AkCircleChevronLeftFill,
    AkCircleChevronRightFill,
    FlFilledWindowNew
  },

  data() {
    return {
      currentMonth: "",
      days: [],
      weekdays: ["Lun.", "Mar.", "Mié.", "Jue.", "Vie.", "Sáb.", "Dom."],
      currentDate: new Date(),
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth(),
      years: [],
      monthNames: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      events: [
        { id: "1", title: "Evento 1", description: "lorem ipsum dolor sit amet", year: 2023, month: 6, day: 15 },
        { id: "2", title: "lorem jas", description: "consectetur adipiscing elit", year: 2023, month: 6, day: 18 },
        { id: "3", title: "Evento 3", description: "sed do eiusmod tempor", year: 2023, month: 3, day: 22 },
      ],
      activeDialog: false,
      activeEvent: null,
    };
  },
  mounted() {
    this.updateYears();
    this.updateMonth(this.currentDate);
  },
  watch: {
    selectedYear() {
      this.updateMonth(new Date(this.selectedYear, this.selectedMonth, 1));
    },
    selectedMonth() {
      this.updateMonth(new Date(this.selectedYear, this.selectedMonth, 1));
    },
  },
  methods: {
    getMonthInSpanish(date) {
      const currentMonthIndex = date.getMonth();
      return this.monthNames[currentMonthIndex];
    },
    updateYears() {
      const currentYear = new Date().getFullYear();
      const pastYear = currentYear - 1;
      const futureYear = currentYear + 1;
      this.years = [pastYear, currentYear, futureYear];
    },
    updateMonth(date) {
      this.currentDate = date;
      this.currentMonth = this.getMonthInSpanish(this.currentDate);
      this.generateCalendar(this.currentDate);
    },
    generateCalendar(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      this.days = [];

      for (let i = 1; i <= daysInMonth; i++) {
        const day = {
          date: i,
        };
        this.days.push(day);
      }
    },
    prevMonth() {
      this.selectedMonth--;
      if (this.selectedMonth < 0) {
        this.selectedMonth = 11;
        this.selectedYear--;
      }
    },

    nextMonth() {
      this.selectedMonth++;
      if (this.selectedMonth > 11) {
        this.selectedMonth = 0;
        this.selectedYear++;
      }
    },
    updateSelectedYear() {
      this.updateMonth(new Date(this.selectedYear, this.selectedMonth, 1));
    },
    updateSelectedMonth() {
      this.updateMonth(new Date(this.selectedYear, this.selectedMonth, 1));
    },
    getEventsForDay(day) {
      const filteredEvents = this.events.filter(event => {
        const eventDate = new Date(event.year, event.month - 1, event.day);
        return (
          eventDate.getFullYear() === this.selectedYear &&
          eventDate.getMonth() === this.selectedMonth &&
          eventDate.getDate() === day
        );
      });
      return filteredEvents;
    },
    openDialog(event) {
      this.activeEvent = event;
      this.activeDialog = true;
    },

    //Check if the day is today
    isToday(day) {
      const today = new Date();
      const d = new Date(this.selectedYear, this.selectedMonth, day);
      return today.toDateString() === d.toDateString();
    },
  },
};
</script>