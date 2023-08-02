<style src="@/assets/styles/tasks/tasks.css"></style>

<template>
  <div class="progress-container" v-if="isLoading">
    <v-progress-circular color="blue-lighten-3" indeterminate :size="99" :width="12"></v-progress-circular>
  </div>

  <div class="tasksWindow">
    <Alert :title="alertInfo.title" :content="alertInfo.content" :color="alertInfo.color" v-model="alertInfo.visible" />
    <span style="display: flex; flex-direction: row; align-items: center;">
      <h2 class="ma-3 mb-1">ASIGNACIONES CREADAS</h2>
      <UnCreateDashboard style="font-size: 2rem;" />
    </span>

    <v-toolbar class="section-header" :elevation="8" density="compact" dense floating>
      <v-toolbar-title>
        <div class="info">
          <label for="sectionSelect"><b>Sección: </b></label>
          <select id="sectionSelect" v-model="selectedSectionId">
            <option disabled value="">Seleccione una sección</option>
            <option v-for="section in sections" :key="section.id" :value="section.id">
              {{ section.name }}
            </option>
          </select>
        </div>
      </v-toolbar-title>
      <v-text-field density="compact" hide-details single-line class="ma-6" color="light-blue lighten-2" variant="solo"
        v-model="searchTerm" prepend-icon="mdi-magnify" placeholder="Buscar asignaciones..." clearable
        :loading="loading"></v-text-field>

      <v-btn class="new-btn" @click="handleNewTask">
        Asignación
        <AkCirclePlusFill class="icon" />
      </v-btn>
    </v-toolbar>

    <div v-if="filteredTasks.length === 0" class="no-tasks-message">
      <h3>No has creado ninguna asignación aún.</h3>
      <p>Empieza creando una asignación nueva dando click en el botón superior "<b>Asignación +</b>".</p>
    </div>


    <v-dialog v-model="showModal" class="task-formOverlay" persistent width="auto">
      <EvidenceSolicitationForm class="task-formDialog" :title="modalTitle || ''" :task-data="selectedTask"
        @create="createTask" @update="updateTask" @cancel="cancelAction"></EvidenceSolicitationForm>
    </v-dialog>


    <div class="tasks">

      <v-card class="task" v-for="task in filteredTasks" :key="task.id">
        <FlFilledTaskListSquarePerson class="task-icon" />

        <v-card-title class="title">
          <h3><b>{{ task.title }}</b></h3>
        </v-card-title>
        <v-expansion-panels variant="inset">
          <v-expansion-panel class="task-section">
            <v-expansion-panel-title color="#EEEEEE">
              <h3>Descripción</h3>
              <template v-slot:actions>
                <v-icon color="#242529">
                  <GlTextDescription />
                </v-icon>
              </template>
            </v-expansion-panel-title>
            <v-expansion-panel-content>
              <v-expansion-panel-text>
                {{ task.description }}
              </v-expansion-panel-text>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel class="task-section">
            <v-expansion-panel-title color="#EEEEEE">
              <h3>Detalles</h3>
              <template v-slot:actions>
                <v-icon color="#242529">
                  <FlFilledAppsListDetail />
                </v-icon>
              </template>
            </v-expansion-panel-title>
            <v-expansion-panel-content>
              <v-expansion-panel-text class="details-content">
                {{ task.details }}
                <v-card-subtitle class="details-info">
                  <b>Publicación: </b>{{ formatDate(task.publicationDate.toString()) }}
                </v-card-subtitle>
                <v-card-subtitle class="details-info">
                  <b>Fecha límite: </b>{{ formatDate(task.deadline.toString()) }}
                </v-card-subtitle>
              </v-expansion-panel-text>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-card-actions class="card-actions">
          <v-btn class="action-btn" color="error" @click="promptDelete(task.id || '')">
            Eliminar
            <AnFilledDelete class="icon" />
          </v-btn>

          <v-btn class="action-btn" color="primary" @click="promptEdit(task.id || '')">
            Editar
            <AkEdit class="icon" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <v-dialog v-model="confirmDialog" width="100%" class="confirm-dialog">
      <v-card class="confirm-card">
        <v-card-title class="dialog-title">
          <span><b>{{ confirmTitle }}</b></span>
        </v-card-title>
        <v-card-text class="dialog-text">{{ confirmText }}</v-card-text>
        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelAction">No</v-btn>
          <v-btn color="success" text @click="confirmAction">Sí</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { ref, computed, onMounted, watch, watchEffect } from 'vue';
import { useStore } from '@/stores/store';
import type { Task, Section } from '@/types/types';
import { AkEdit, AkCirclePlusFill, AnFilledDelete, FlFilledAppsListDetail, GlTextDescription, FlFilledTaskListSquarePerson, UnCreateDashboard } from '@kalimahapps/vue-icons';
import EvidenceSolicitationForm from '@/components/professor/tasks/EvidenceSolicitationForm.vue';
import Alert from '@/components/fragments/Alert.vue';
import { v4 as uuidv4 } from 'uuid';
import formatDate from '@/utils/DateFormat';
import { sendWhatsAppMessageToServer } from '@/helpers/TwilioService';



export default {
  name: 'TasksWindow',

  components: {
    AkEdit,
    AkCirclePlusFill,
    AnFilledDelete,
    FlFilledAppsListDetail,
    GlTextDescription,
    EvidenceSolicitationForm,
    FlFilledTaskListSquarePerson,
    UnCreateDashboard,
    Alert,
  },

  setup() {
    const isLoading = ref(true);

    onMounted(() => {
      fetchSections();
      fetchTasks();
    });

    const searchTerm = ref('');

    const store = useStore();

    const sections = ref<Section[]>([]);
    const selectedSectionId = ref<string>('');

    const tasks = ref<Task[]>([]);


    const filteredTasks = computed<Task[]>(() => {
      loading.value = true;
      return tasks.value
        .filter((task: Task) => task.section === selectedSectionId.value)
        .filter((task: Task) =>
          task.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
    });

    const alertInfo = ref({
      title: '',
      content: '',
      color: '',
      visible: false,
    });

    const confirmDialog = ref(false);
    const confirmTitle = ref('');
    const confirmText = ref('');
    const confirmAction = ref<() => void>(() => { });

    const showModal = ref(false);
    const selectedTask = ref<Task | null>(null);
    const modalTitle = computed(() => selectedTask.value?.title);

    const fetchSections = async () => {
      try {
        await store.fetchSections();
        sections.value = store.sections;
        if (sections.value.length > 0) {
          selectedSectionId.value = sections.value[0]?.id || '';
        }
      } catch (error) {
        console.error("Error fetching sections: ", error);
      }
    };

    const fetchTasks = async () => {
      try {
        await store.fetchTasks('v61mcsttqfXPze2B7FZlpfplRZG3');
        tasks.value = store.tasks;
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      } finally {
        isLoading.value = false;
      }
    };

    const loading = ref(false);

    const handleNewTask = () => {
      selectedTask.value = null;
      showModal.value = true;
    };

    const createTask = async (taskData: Task) => {
      taskData.section = selectedSectionId.value;
      taskData.professor = store.getCurrentUser?.id || '';


      const newTask = await store.createTask(taskData);

      if (newTask) {
        try {
          await sendWhatsAppMessageToServer("+593964154209", newTask);
        } catch (error) {
          console.error("Error sending WhatsApp message: ", error);
        }
      }


      showModal.value = false;

      alertInfo.value.title = 'Creación exitosa';
      alertInfo.value.content = 'La asignación ha sido creada.';
      alertInfo.value.color = 'success';
      showAlertInfo();
    };

    const updateTask = async (taskData: Task) => {
      const taskIndex = tasks.value.findIndex((task: Task) => task.id === taskData.id);
      if (taskIndex !== -1) {
        await store.updateTask(taskData); // Call the updateTask function in the store
        tasks.value[taskIndex] = { ...tasks.value[taskIndex], ...taskData }; // Merge existing task with updated data
        alertInfo.value.title = 'Actualización exitosa';
        alertInfo.value.content = 'La asignación ha sido actualizada.';
        alertInfo.value.color = 'info';
        showAlertInfo();
        showModal.value = false;
      }
    };


    const promptDelete = (taskId: string) => {
      const taskIndex = tasks.value.findIndex((task: Task) => task.id === taskId);
      if (taskIndex !== -1) {
        confirmDialog.value = true;
        confirmTitle.value = 'Eliminar tarea';
        confirmText.value = '¿Estás seguro de que quieres eliminar esta tarea?';
        confirmAction.value = async () => {
          await store.deleteTask(taskId); // Call the deleteTask function in the store
          tasks.value.splice(taskIndex, 1);

          alertInfo.value.title = 'Eliminación exitosa';
          alertInfo.value.content = 'La asignación ha sido eliminada.';
          alertInfo.value.color = 'error';
          showAlertInfo();

          confirmDialog.value = false;
        };
      }
    };

    const promptEdit = (taskId: string) => {
      const task = tasks.value.find((task: Task) => task.id === taskId);
      if (task) {
        selectedTask.value = { ...task };
        showModal.value = true;
      }
    };

    const cancelAction = () => {
      confirmDialog.value = false;
      showModal.value = false;
      confirmAction.value = () => { };
    };

    const showAlertInfo = () => {
      alertInfo.value.visible = true;

      setTimeout(() => {
        alertInfo.value.visible = false;
      }, 4000);
    };

    watch(selectedSectionId, fetchTasks);

    return {
      sections,
      selectedSectionId,
      tasks,
      filteredTasks,
      alertInfo,
      confirmDialog,
      confirmTitle,
      confirmText,
      showModal,
      selectedTask,
      modalTitle,
      handleNewTask,
      createTask,
      updateTask,
      promptDelete,
      promptEdit,
      cancelAction,
      showAlertInfo,
      formatDate,
      confirmAction,
      store,
      isLoading,
      searchTerm,
      loading
    }
  },
};
</script>


