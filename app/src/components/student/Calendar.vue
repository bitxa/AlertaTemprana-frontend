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
      <v-card v-for="day in days" :key="day.date" class="day">
        <div class="day-number">{{ day.date }}</div>
        <div class="events">
          <v-btn v-for="event in getEventsForDay(day.date)" :key="event.id" class="event">
            {{ event.title }}
            <v-tooltip activator="parent" location="end">{{ event.description }}</v-tooltip>
          </v-btn>
        </div>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import { AkCircleChevronLeftFill } from "@kalimahapps/vue-icons";
import { AkCircleChevronRightFill } from "@kalimahapps/vue-icons";

export default {
  components: {
    AkCircleChevronLeftFill,
    AkCircleChevronRightFill,
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
        { id: "2", title: "Evento 2", description: "consectetur adipiscing elit", year: 2023, month: 6, day: 18 },
        { id: "3", title: "Evento 3", description: "sed do eiusmod tempor", year: 2023, month: 3, day: 22 },
      ],
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
  },
};
</script>

<style scoped>
.month-calendar {
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
  margin-right: 2vh;
}

.header {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: Arial, Helvetica, sans-serif;
}

.header button {
  height: auto;
  color: #febe01;
  font-size: 2rem;
  margin: 2vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.month {
  text-transform: uppercase;
  letter-spacing: 1vh;
  font-weight: 800;
  font-size: 1.5rem;
  margin-right: 1rem;
}

.year {
  background-color: transparent;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 1vh;
}

.selected-year:hover {
  background-color: #f0f0f0;
}

.selected-year:selected {
  background-color: #7F51F5;
  color: #ffffff;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1vh;
  background-color: #f9f9f9;
  position: sticky;
  top: 0;
  z-index: 999;
  height: 5vh;
}

.weekday {
  text-align: center;
  font-weight: bold;
}

.days {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5vh;
  padding: 0.7rem;
  padding-top: 0;
  margin-top: 0;
  margin: 1vh;
}

.day {
  border: 1px solid #e1e1e1;
  height: auto;
  min-height: 10vh;
}

.day-number {
  margin: 1vh;
  text-align: center;
  width: 20%;
  font-weight: bold;
  color: #ffff;
  border-radius: 50%;
  margin-bottom: 1vh;
  background-color: #7f51f5;
}

.date {
  width: 60vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.events {
  padding: 1vh;
}

.event {
  width: 100%;
  font-size: small;
  color: #da0378;
  border: 0.5px solid #da0378;
  border-radius: 0.7vh;
}
</style>
