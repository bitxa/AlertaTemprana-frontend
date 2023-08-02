<template>
  <v-card class="task-form">
    <v-card-title class="title">
      <h3><b>{{ title }}</b></h3>
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="handleSubmit" id="taskForm">
        <v-menu v-model="templateMenu" offset-y>
          <template v-slot:activator="{ props }">
            <v-row class="ma-3" justify="start">
              <v-btn prepend-icon="mdi-text-box-multiple-outline" variant="tonal" color="#20262E" v-bind="props"
                width="auto">
                Utilizar plantilla
              </v-btn>
            </v-row>
          </template>

          <v-list>
            <v-list-item v-for="(template, index) in templates" :key="index" :value="index"
              @click="useTemplate(template)">
              <v-list-item-title>{{ template.title }}</v-list-item-title>
            </v-list-item>
          </v-list>

        </v-menu>
        <div class="field">
          <v-text-field variant="solo-filled" v-model="title" label="Título" required></v-text-field>
        </div>
        <v-divider :thickness="3"></v-divider>
        <div class="row mt-0">
          <div class="field" style="flex-basis: 90%;">
            <label for="deadline"><small>Fecha límite:</small></label>
            <Datepicker class="date-picker" v-model="deadline" required elevation="15" id="deadline" :typeable="true">
            </Datepicker>
          </div>

          <div class="field" style="flex-basis: 10%;">
            <label for="deadline"><small>Hora:</small></label>
            <input type="time" id="appt" name="appt" min="07:00" max="12:00" v-model="deadlineTime" required>
          </div>
        </div>
        <v-divider :thickness="3"></v-divider>

        <div class="field">
          <v-textarea variant="solo-filled" v-model="description" label="Descripción" required></v-textarea>
        </div>
        <v-divider :thickness="3"></v-divider>

        <div class="field">
          <v-textarea variant="solo-filled" v-model="details" label="Detalles" required></v-textarea>
        </div>

        <v-divider :thickness="3"></v-divider>

        <div class="field">
          <v-file-input chips small-chips ref="fileInput" clearable variant="solo-filled" @change="loadFile"
            prepend-icon="mdi-paperclip">
            <template #label v-if="!selectedFileName">
              <span>Seleccione el documento para el estudiante.</span>
            </template>
            <template #prepend-inner>
              <v-chip v-if="selectedFileName" @click="removeFile">{{ selectedFileName }}</v-chip>
            </template>
          </v-file-input>

        </div>

        <v-snackbar v-model="snackbar" :timeout="snackbarTimeout">
          La plantilla cargada se utilizará para generar un documento pre llenado para cada estudiante, con su
          información.
          <template v-slot:actions>
            <v-btn color="error" variant="elevated" size="x-small" @click="snackbar = false" icon="mdi-close"></v-btn>
          </template>
        </v-snackbar>

        <v-card-actions class="form-actions">
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="handleCancel"><b>Cancelar</b></v-btn>
          <v-btn color="success" text @click="showConfirmDialog"><b>Guardar</b></v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>

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
  </v-card>
</template>

<script lang="ts">
import { ref, defineComponent, reactive, watch } from 'vue';
import Datepicker from 'vue3-datepicker';
import type { Task } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '@/stores/store';

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export default defineComponent({
  name: 'EvidencesSolicitationForm',
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
    const store = useStore();
    const id = ref(props.taskData ? props.taskData.id : uuidv4());
    const title = ref(props.taskData ? props.taskData.title : '');
    const description = ref(props.taskData ? props.taskData.description : '');
    const details = ref(props.taskData ? props.taskData.details : '');
    const deadline = ref(props.taskData && props.taskData.deadline ? new Date(props.taskData.deadline) : new Date());
    const confirmDialog = ref(false);
    const confirmTitle = ref('Guardar datos');
    const confirmText = ref('¿Estás seguro de que quieres guardar estos datos?');
    const snackbar = ref(true);
    const snackbarTimeout = ref(1000);
    const confirmAction = ref(() => { });
    const selectedTemplate = ref('');
    const templateMenu = ref(false);
    const selectedFile = ref(null as File | null);
    const selectedFileName = ref('');

    const onFileSelected = () => {
      if (selectedFile.value) {
        selectedFileName.value = selectedFile.value.name;
      } else {
        selectedFileName.value = ''; // Clear the selectedFileName when the file is removed
      }
    };

    const removeFile = () => {
      selectedFile.value = null;
      selectedFileName.value = ''; // Clear the selectedFileName when the file is removed
    };

    const cancelAction = () => {
      confirmDialog.value = false;
    };

    const showConfirmDialog = () => {
      confirmDialog.value = true;
      confirmAction.value = handleSubmit;
    };

    const deadlineTime = ref(
      props.taskData && props.taskData.deadline
        ? new Date(props.taskData.deadline).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : '12:00'
    );


    const state = reactive({
      file: null as File | null,
    });

    const templates = [
      {
        title: "Documento de asignación al estudiante",
        deadline: "2023-07-31T17:00:00Z",
        description: "¡Muy buenas, queridos estudiantes! Hoy me encuentro aquí para hablarles sobre un documento muy importante para aquellos de ustedes que tienen la maravillosa oportunidad de realizar prácticas pre profesionales en nuestra amada Universidad Técnica Particular de Loja.Estoy hablando del 'documento de asignación para prácticas pre profesionales en la UTPL'. El documento de asignación es un paso crucial en este proceso, ya que establece las bases para una experiencia exitosa y armoniosa durante sus prácticas.Queremos asegurarnos de que todo esté claro y bien definido para que puedan sacar el máximo provecho de esta oportunidad.  En el documento, encontrarán detalles personales, información sobre la universidad y la facultad a la que pertenecen.También se incluirán datos de la empresa o entidad donde llevarán a cabo sus prácticas, así como los nombres de sus tutores o supervisores.Además, se detallará la duración de las prácticas y los horarios acordados",
        details: 'Por favor, subir el documento firmado y debidamente escaneado por el estudiante. El archivo debe estar en formato PDF.',
        document: '/documents/Anexo3.docx',
        documentName: 'ANEXO 3_Documento de asignación del estudiante.docx',
      },
      {
        title: "Documento de aceptación del estudiante",
        deadline: "2023-07-31T17:00:00Z",
        description: "En el documento, encontrarán información básica sobre ustedes y los detalles específicos de la empresa o entidad que les ofreció esta oportunidad. Una vez que hayan revisado y estén seguros de la información, es hora de que lo firmen. No olviden leer cuidadosamente los términos y condiciones establecidos en el documento, ya que esto asegurará que todos estemos en la misma página y se cumplan las expectativas.",
        details: 'Por favor, subir el documento firmado y debidamente escaneado por el estudiante. El archivo debe estar en formato PDF.',
        document: '/documents/Anexo4.docx',
        documentName: 'ANEXO 4_Documento de aceptación del estudiante.docx',
      },
      {
        title: "Rubrica de evaluación de desempeño",
        deadline: "2023-07-31T17:00:00Z",
        description: "¡Muy buenas, queridos estudiantes! Hoy me encuentro aquí para hablarles sobre un documento muy importante para aquellos de ustedes que tienen la maravillosa oportunidad de realizar prácticas pre profesionales en nuestra amada Universidad Técnica Particular de Loja.Estoy hablando del 'documento de asignación para prácticas pre profesionales en la UTPL'. El documento de asignación es un paso crucial en este proceso, ya que establece las bases para una experiencia exitosa y armoniosa durante sus prácticas.Queremos asegurarnos de que todo esté claro y bien definido para que puedan sacar el máximo provecho de esta oportunidad.  En el documento, encontrarán detalles personales, información sobre la universidad y la facultad a la que pertenecen.También se incluirán datos de la empresa o entidad donde llevarán a cabo sus prácticas, así como los nombres de sus tutores o supervisores.Además, se detallará la duración de las prácticas y los horarios acordados",
        details: 'Por favor, subir el documento firmado y debidamente escaneado por el estudiante. El archivo debe estar en formato PDF',
        document: '/documents/Anexo3.docx',
      },
      {
        title: "Informe final de prácticas pre profesionales",
        deadline: "2023-07-31T17:00:00Z",
        description: "¡Muy buenas, queridos estudiantes! Hoy me encuentro aquí para hablarles sobre un documento muy importante para aquellos de ustedes que tienen la maravillosa oportunidad de realizar prácticas pre profesionales en nuestra amada Universidad Técnica Particular de Loja.Estoy hablando del 'documento de asignación para prácticas pre profesionales en la UTPL'. El documento de asignación es un paso crucial en este proceso, ya que establece las bases para una experiencia exitosa y armoniosa durante sus prácticas.Queremos asegurarnos de que todo esté claro y bien definido para que puedan sacar el máximo provecho de esta oportunidad.  En el documento, encontrarán detalles personales, información sobre la universidad y la facultad a la que pertenecen.También se incluirán datos de la empresa o entidad donde llevarán a cabo sus prácticas, así como los nombres de sus tutores o supervisores.Además, se detallará la duración de las prácticas y los horarios acordados",
        details: 'Por favor, subir el documento firmado y debidamente escaneado por el estudiante. El archivo debe estar en formato PDF',
        document: '/documents/Anexo3.docx',
      },
      {
        title: "Certificación de la empresa receptora",
        deadline: "2023-07-31T17:00:00Z",
        description: "¡Muy buenas, queridos estudiantes! Hoy me encuentro aquí para hablarles sobre un documento muy importante para aquellos de ustedes que tienen la maravillosa oportunidad de realizar prácticas pre profesionales en nuestra amada Universidad Técnica Particular de Loja.Estoy hablando del 'documento de asignación para prácticas pre profesionales en la UTPL'. El documento de asignación es un paso crucial en este proceso, ya que establece las bases para una experiencia exitosa y armoniosa durante sus prácticas.Queremos asegurarnos de que todo esté claro y bien definido para que puedan sacar el máximo provecho de esta oportunidad.  En el documento, encontrarán detalles personales, información sobre la universidad y la facultad a la que pertenecen.También se incluirán datos de la empresa o entidad donde llevarán a cabo sus prácticas, así como los nombres de sus tutores o supervisores.Además, se detallará la duración de las prácticas y los horarios acordados",
        details: 'Por favor, subir el documento firmado y debidamente escaneado por el estudiante. El archivo debe estar en formato PDF',
        document: '/documents/Anexo3.docx',
      }
    ];


    const loadFile = (e: any) => {
      if (e.target.files && e.target.files[0]) {
        selectedFile.value = e.target.files[0];
        selectedFileName.value = e.target.files[0].name;
      }
    };


    const useTemplate = async (template: any) => {
      title.value = template.title;
      selectedTemplate.value = template.title;
      description.value = template.description;
      details.value = template.details;

      const response = await fetch(template.document);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);  // readAsArrayBuffer instead of readAsBinaryString

      reader.onload = async () => {
        if (reader.result instanceof ArrayBuffer) { // check if result is ArrayBuffer
          const zip = new PizZip(reader.result);
          const doc = new Docxtemplater();
          doc.loadZip(zip);
          doc.setData({
            title: title.value,
            deadline: deadline.value.toISOString().split('T')[0],
            deadlineTime: deadlineTime.value,
            description: description.value,
            details: details.value,
          });
          try {
            doc.render();
          } catch (error) {
            console.error('Error rendering document: ', error);
            return;
          }
          const output = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          });
          const file = new File([output], template.documentName, {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          });
          selectedFile.value = file;
          selectedFileName.value = file.name;

        } else {
          console.error('Failed to read file as ArrayBuffer');
        }
      };
    };
    const getSelectedFile = () => {
      return selectedFile.value;
    };

    const handleSubmit = async () => {
      const dateOnlyString = deadline.value.toISOString().split('T')[0];
      const newTaskData = {
        id: id.value,
        title: title.value,
        deadline: dateOnlyString,
        deadlineTime: deadlineTime.value,
        publicationDate: new Date().toISOString(),
        description: description.value,
        details: details.value,
        fileUrl: '',
      };

      if (selectedFile.value) {
        console.log(newTaskData.id);
        const fileUrl = await store.uploadFileAndGetURL(selectedFile.value, newTaskData.id);
        newTaskData.fileUrl = fileUrl || '';
      }

      emit(props.taskData ? 'update' : 'create', newTaskData);
      resetForm();
    };

    const handleCancel = () => {
      emit('cancel');
      resetForm();
    };

    const resetForm = () => {
      title.value = '';
      deadline.value = new Date();
      deadlineTime.value = '12:00';
      description.value = '';
      details.value = '';
    };

    return {
      snackbar,
      snackbarTimeout,
      title,
      deadline,
      deadlineTime,
      description,
      details,
      handleSubmit,
      handleCancel,
      confirmDialog,
      confirmTitle,
      confirmText,
      confirmAction,
      cancelAction,
      showConfirmDialog,
      templates,
      selectedTemplate,
      useTemplate,
      state,
      templateMenu,
      loadFile,
      getSelectedFile,
      selectedFile,
      removeFile,
      onFileSelected,
      selectedFileName
    };
  },
});
</script>


<style  src="@/assets/styles/tasks/taskForm.css"></style>
