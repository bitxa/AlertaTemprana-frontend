<style scoped>
.task-header {
    padding: 2vh;
    border-radius: 0.5vh;
}

.student-task-view {
    padding: 2vh;
    margin: 2vh;
    margin-top: 0%;
    padding-top: 0%;
    border-radius: 1vh;
    background-color: transparent;
}

h4 {
    color: #2B2730;
    font-weight: 900;
}

p {
    margin: 1vh;
    color: #3C4048;
}

.task-heading,
.document-heading {
    margin-bottom: 10px;
}

.task-info {
    background-color: #EEEDED;
    padding: 1vh;
    border-radius: 0.6vh;
}

.task-details {
    margin-bottom: 20px;
    padding: 2vh;
}

.task-info {
    margin-bottom: 5px;
}

.document-info a {
    color: #007bff;
    text-decoration: none;
}

.document-info a:hover {
    text-decoration: underline;
}

.back-button {
    background-color: #41444B;
    color: #F9F9F9;
    top: 2vh;
    left: 2vh;
    margin-bottom: 3vh;
}

.task-info .data {
    width: 100%;
    height: auto;
    min-height: 30vh;
}
</style>

<template>
    <v-row no-gutters style="width: 100%;">
        <v-col cols="4" class="me-auto">
            <v-btn @click="goBack" icon class="back-button">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
        </v-col>
        <v-col class="ma-3" cols="2" style="display: flex; align-items:center; justify-content: center;">
            <v-select label="Intento #1" variant="solo-filled" :items="intentos" item-value single-line persistent-hint>
            </v-select>
        </v-col>
    </v-row>

    <div clas="student-task-view">
        <v-system-bar window color="primary">
            <span><v-icon icon="mdi-message" class="me-2"></v-icon>Aún no has subido esta tarea</span>
            <v-spacer></v-spacer>
        </v-system-bar>


        <v-toolbar density="comfortable" class="task-header" color="#D1D1D1">
            <v-toolbar-title>
                <h3 class="task-heading mt-2"><b>{{ task?.title }}</b></h3>
                <small class="ma-3"><b>Disponible hasta</b> {{ task?.deadline }}</small>
            </v-toolbar-title>

            <v-btn variant="tonal" color="#F11A7B">
                Pendiente <v-icon icon="mdi-battery"></v-icon>
            </v-btn>
        </v-toolbar>

        <div class="task-details">
            <div class="task-info">
                <span class="data">
                    <h4><b>Descripción</b></h4>
                    <p>{{ task?.description }}</p>
                </span>
            </div>

            <div class="task-info">
                <span class="data">
                    <h4><b>Detalles</b></h4>
                    <p>{{ task?.details }}</p>
                </span>

                <span style="display: flex; flex-direction: row;">


                </span>
            </div>

            <div class="task-info">
                <span class="document-heading">
                    <h4>Documento asignado</h4>
                </span>
                <div class="document-details">
                    <div class="document-info">
                        <v-container justify="center" align="center">
                            <span class="ma-4 pa-4"><v-icon color="blue ">mdi-file-word</v-icon>ANEXO 3_Documento de
                                asignación del estudiante.docx</span>
                            <v-row justify="center" align="center" class="ma-2">
                                <v-col cols="auto">
                                    <router-link to="/editor">
                                        <v-btn color="blue"><v-icon color="white">mdi-pencil</v-icon>Editar</v-btn>
                                    </router-link>
                                </v-col>

                                <v-col cols="auto">

                                    <v-btn color="green" @click="processFile(task?.id || '')"><v-icon
                                            color="white">mdi-download-circle</v-icon>Descargar</v-btn>

                                </v-col>

                            </v-row>
                        </v-container>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <v-bottom-navigation color="#FEBE01" grow style="background-color: #00416F;">
        <v-btn>
            <label for="fileInput" style="color: #FEBE01; cursor: pointer;" @click="showFileInput = true">
                <v-icon>mdi-upload</v-icon>
                Subir tarea
            </label>
        </v-btn>

    </v-bottom-navigation>


    <input type="file" id="fileInput" v-if="showFileInput" @change="onFileSelected" ref="fileInputRef"
        style="display: none" />

    <v-card max-width="600" max-height="170" class="mx-auto" variant="tonal" color="#FEBE01" v-if="uploadedFile">
        <div class="pa-5 pt-4 ma-2">
            <h3><b>Archivo Subido</b></h3>
            <p>{{ uploadedFile.name }}</p>

            <v-btn style="right: 1; bottom: 0; right: 0; margin: 1vh;" variant="outlined">Presentar tarea</v-btn>
        </div>

    </v-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useStore } from "@/stores/store";
import type { Task } from "@/types/types";
import JSZip from "jszip";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import fs from "fs";
import htmlToDocx from "html-docx-js";
import { JSDOM } from 'jsdom';

export default defineComponent({
    name: "StudentTaskView",

    props: {
        id: {
            type: String,
            required: true,
        },
    },

    methods: {
        goBack() {
            this.$router.go(-1);
        },
    },

    async created() {
        const store = useStore();
        try {
            this.task = await store.fetchTaskById(this.id);
        } catch (error) {
            console.error("Error fetching task or document details: ", error);
        }
    },

    setup(props) {
        const store = useStore();

        const task = ref<Task | null>(null);

        const intentos = ["Intento #1", "Intento #2", "Intento #3"];
        const showFileInput = ref(false);
        const uploadedFile = ref<File | null>(null);
        const fileInputRef = ref<HTMLInputElement | null>(null);

        const openFileInput = () => {
            if (fileInputRef.value) {
                fileInputRef.value.click();
            }
        };

        const onFileSelected = (event: any) => {
            console.log(event.target.files);
            uploadedFile.value = event.target.files[0];
        };

        const formatFileSize = (size: number): string => {
            const KB = 1024;
            const MB = KB * 1024;
            if (size >= MB) {
                return `${(size / MB).toFixed(2)} MB`;
            } else if (size >= KB) {
                return `${(size / KB).toFixed(2)} KB`;
            } else {
                return `${size} bytes`;
            }
        };

        const processFile = async (taskId: string) => {
            try {
                // Fetch the file from Firebase Storage
                const [arrayBuffer, fileName] = await store.fetchFileFromStorage(taskId);

                if (arrayBuffer) {
                    // Convert the ArrayBuffer to Uint8Array
                    const uint8Array = new Uint8Array(arrayBuffer);

                    // Load the Uint8Array data into the zip instance
                    const doc = new Docxtemplater().loadZip(new PizZip(uint8Array));

                    // Your HTML String
                    const yourHtml = `<img src="https://www.utpl.edu.ec/sites/default/files/archivos/marca%20UTPL%202018-03.png" height="70" /><h4 style="text-align: center;">Documento de aceptaci&oacute;n del estudiante</h4><br /><br /><p>Loja, 28 de Julio 2023<br />&nbsp;</p><p>FERNANDA MARICELA SOTO GUERRERO</p><p><strong>DIRECTOR DE COMPUTACION<br /><br /></strong></p><p>JANE SMITH JARAMILLO MARTINEZ portador de la c&eacute;dula de identidad <strong>1105637076</strong>, estudiante de COMPUTACION de la Universidad T&eacute;cnica Particular de Loja, ACEPTO, realizar mis horas de pr&aacute;cticas preprofesionales en NODO CIA. LTDA. durante el periodo acad&eacute;mico ABR/2023 - AGO/2023 , y cumplir las siguientes responsabilidades:<br /><br /></p><ol style="list-style-type: lower-alpha;"><li style="padding-left: 30px;">Realizar las actividades acad&eacute;micas y formativas en la organizaci&oacute;n receptora.</li><li style="padding-left: 30px;">Cumplir con los horarios establecidos y el n&uacute;mero de horas para las pr&aacute;cticas preprofesionales, as&iacute; como con las actividades asignadas.<br /><br /></li><li style="padding-left: 30px;">Mantener reserva y confidencialidad de la informaci&oacute;n que reciba, conozca o maneje dentro de la instituci&oacute;n/empresa/dependencia a la que ha sido asignado.<br /><br /></li><li style="padding-left: 30px;">Cuidar los equipos e instrumentos que le sean entregados en los tiempos y plazos que permanezcan bajo su responsabilidad.<br /><br /></li><li style="padding-left: 30px;">Actuar respetando las disposiciones del Reglamento de &Eacute;tica y R&eacute;gimen Disciplinario y dem&aacute;s normativa de la UTPL, as&iacute; como las normativas y disposiciones de la organizaci&oacute;n receptora durante el periodo de las pr&aacute;cticas preprofesionales.<br /><br /></li><li style="padding-left: 30px;">Presentar a la Universidad el &ldquo;Informe Final de pr&aacute;cticas preprofesionales&rdquo; sobre las actividades realizadas, dentro de los plazos establecidos por la UTPL.<br /><br /></li><li style="padding-left: 30px;">Presentar documentos que respalden el cumplimiento de la pr&aacute;ctica.<br /><br /></li><li style="padding-left: 30px;">Dar a conocer al tutor acad&eacute;mico las incidencias que puedan afectar al normal desarrollo de las pr&aacute;cticas.</li></ol><p>&nbsp;</p><p>&nbsp;<br /><br /></p><p><strong>Firma del estudiante</strong></p><p>JANE SMITH JARAMILLO MARTINEZ</p><h3 style="text-align: center;">&nbsp;</h3>`;

                    // Set the data to the Docxtemplater instance (use your data here)
                    const data = {
                        yourHtml // Use your HTML as a part of the data
                    };
                    doc.setData(data);


                    doc.render();

                    // Get the processed content as a binary buffer
                    const updatedContent = doc.getZip().generate({
                        type: "blob",
                    });

                    // Create a blob with the updated content
                    const blob = new Blob(
                        [updatedContent],
                        {
                            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        }
                    );

                    // Create a download link and trigger the download
                    const downloadLink = document.createElement("a");
                    downloadLink.href = URL.createObjectURL(blob);
                    downloadLink.download = fileName;
                    downloadLink.click();
                }
            } catch (error) {
                console.error("Error processing file: ", error);
            }
        };


        return {
            task,
            document,
            intentos,
            showFileInput,
            uploadedFile,
            openFileInput,
            onFileSelected,
            formatFileSize,
            processFile,
        };
    },
});
</script>