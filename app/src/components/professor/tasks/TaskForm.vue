<template>
  <v-card class="task-form">
    <v-card-title class="title">
      <h3><b>{{ title }}</b></h3>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="handleSubmit" id="taskForm">
        <div class="field">
          <v-text-field v-model="title" label="Título" required></v-text-field>
        </div>

        <div class="row">
          <div class="field" style="flex-basis: 90%;">
            <label for="deadline"><small>Fecha límite:</small></label>
            <Datepicker class="date-picker" v-model="deadline" :clearable="true" required elevation="15" id="deadline"
              :locale="es" :typeable="true"></Datepicker>
          </div>
          <div class="field pl-4" style="align-items: center; flex-basis: 10%;">
            <input type="time" id="appt" name="appt" min="07:00" max="12:00pm" v-model="deadlineTime" required>
          </div>
        </div>
        <v-divider :thickness="3"></v-divider>

        <div class="field">
          <v-textarea v-model="description" label="Descripción" required></v-textarea>
        </div>
        <v-divider :thickness="3"></v-divider>

        <div class="field">
          <v-textarea v-model="details" label="Detalles" required></v-textarea>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="handleCancel"><b>Cancelar</b></v-btn>
          <v-btn color="success" text @click="handleSubmit"><b>{{ submitButtonText }}</b></v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import Datepicker from 'vue3-datepicker';
import { es } from 'date-fns/locale';
import type { Task } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'TaskForm',
  data() {
    return {
      es,
    };
  },
  components: {
    Datepicker,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    taskData: {
      type: Object as () => Task | null,
      required: false,
      default: null,
    },
  },

  setup(props, { emit }) {
    let validDate = props.taskData && props.taskData.deadline && !isNaN(Date.parse(props.taskData.deadline.toISOString()));
    const id = ref(props.taskData ? props.taskData.id : uuidv4());
    const course = ref(props.taskData ? props.taskData.course : '');
    const title = ref(props.taskData ? props.taskData.title : '');
    const deadline = ref(validDate ? new Date(props.taskData?.deadline || '') : new Date());
    const deadlineTime = ref(validDate ? new Date(props.taskData?.deadline || '').toISOString().split('T')[1].substring(0, 5) : '');
    const description = ref(props.taskData ? props.taskData.description : '');
    const details = ref(props.taskData ? props.taskData.details : '');

    const submitButtonText = ref(props.taskData ? 'Crear' : 'Guardar cambios');

    const handleSubmit = () => {
      const dateTimeString = `${deadline.value.toISOString().split('T')[0]}T${deadlineTime.value}:00.000Z`;
      const newTaskData = {
        course: course.value,
        title: title.value,
        deadline: dateTimeString,
        description: description.value,
        details: details.value,
      };

      if (props.taskData) {
        emit('update', { ...props.taskData, ...newTaskData });
      } else {
        emit('create', newTaskData);
      }

      resetForm();
    };

    const handleCancel = () => {
      emit('cancel');
      resetForm();
    };

    const resetForm = () => {
      title.value = '';
      deadline.value = new Date();
      description.value = '';
      details.value = '';
      deadlineTime.value = '';
    };

    return {
      course,
      title,
      deadline,
      deadlineTime,
      description,
      details,
      submitButtonText,
      handleSubmit,
      handleCancel,
    };
  },
};
</script>

<style>
.date-picker {
  width: 100%;
  flex-basis: 70%;
  background-color: #F6F6F6;
  padding: 2vh;
  border-radius: 1vh;
  -webkit-border-radius: 1vh;
  -moz-border-radius: 1vh;
  -ms-border-radius: 1vh;
  -o-border-radius: 1vh;
  margin-bottom: 3vh;
}

.row {
  width: 45%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

input[type="time"] {
  background-color: #F6F6F6;
  padding: 1vh;
  padding-right: 0;
  border-radius: 1vh;
  -webkit-border-radius: 1vh;
  -moz-border-radius: 1vh;
  -ms-border-radius: 1vh;
  -o-border-radius: 1vh;
  font: 900;
  font-size: 1.5rem;
  letter-spacing: 1vh;
}
</style>
