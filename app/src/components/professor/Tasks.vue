<template>
    <div class="tasksWindow">
        <Alert :title="alertInfo.title" :content="alertInfo.content" :color="alertInfo.color" v-model="alertInfo.visible" />
        <v-toolbar density="compact" class="section-header">
            <div class="info">
                <label for="courseSelect"><b>Sección: </b></label>
                <select id="courseSelect" v-model="selectedCourseId">
                    <option disabled value="">Seleccione un curso</option>
                    <option v-for="course in courses" :key="course.id || ''" :value="course.id">{{ course.text }}</option>
                </select>
            </div>
            <v-spacer></v-spacer>
            <v-btn class="new-btn" @click="handleNewTask">Asignación
                <AkCirclePlusFill class="icon" />
            </v-btn>

        </v-toolbar>


        <v-dialog v-model="showModal" width="80%" id="task-dialog">
            <task-form :title="modalTitle" :task-data="selectedTask" @create="createTask" @update="updateTask"
                @cancel="cancelAction"></task-form>
        </v-dialog>

        <div class="tasks">
            <v-card class="task" v-for="task in filteredTasks" :key="task.id">
                <v-card-title class="title">
                    <strong>{{ task.title }}</strong>
                </v-card-title>
                <v-expansion-panels variant="inset">
                    <v-expansion-panel class="task-section">
                        <v-expansion-panel-title color="#EEEEEE">
                            <b>Descripción</b>
                            <template v-slot:actions>
                                <v-icon color="#242529">
                                    <GlTextDescription />
                                </v-icon>
                            </template>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            {{ task.description }}
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel class="task-section">
                        <v-expansion-panel-title color="#EEEEEE">
                            <b>Detalles</b>
                            <template v-slot:actions>
                                <v-icon color="#242529">
                                    <FlFilledAppsListDetail />
                                </v-icon>
                            </template>
                        </v-expansion-panel-title>
                        <v-divider></v-divider>
                        <v-expansion-panel-text class="details-content">
                            {{ task.details }}
                            <v-card-subtitle> <b>Publicación: </b> {{ task.publicationDate }}</v-card-subtitle>
                            <v-card-subtitle> <b>Fecha límite: </b> {{ task.deadline }}</v-card-subtitle>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-card-actions class="card-actions">
                    <v-btn class="action-btn" color="error" @click="promptDelete(task.id || '')">Eliminar
                        <AnFilledDelete class="icon" />
                    </v-btn>

                    <v-btn class="action-btn" color="info" @click="promptEdit(task.id || '')">Editar
                        <AkEdit class="icon" />
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>

        <v-dialog v-model="confirmDialog" width="30%" class="confirm-dialog">
            <v-card class="confirm-card">
                <v-card-title class="dialog-title">
                    <span>{{ confirmTitle }}</span>
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
import type { Course, Task } from "@/types/types";
import { AkCirclePlusFill } from "@kalimahapps/vue-icons";
import { GlTextDescription } from "@kalimahapps/vue-icons";
import { AnFilledDelete } from "@kalimahapps/vue-icons";
import { FlFilledAppsListDetail } from "@kalimahapps/vue-icons";
import { AkEdit } from "@kalimahapps/vue-icons";
import TaskForm from "./tasks/TaskForm.vue";
import Alert from "@/components/fragments/Alert.vue";
import { v4 as uuidv4 } from 'uuid';


import { ref, computed, reactive } from 'vue';

export default {
    name: 'Tasks',

    components: {
        AkCirclePlusFill,
        GlTextDescription,
        FlFilledAppsListDetail,
        AnFilledDelete,
        AkEdit,
        TaskForm,
        Alert
    },

    setup() {
        const alertInfo = reactive({ title: '', content: '', color: '', visible: false });
        const confirmDialog = ref(false);
        const confirmTitle = ref('');
        const confirmText = ref('');
        const confirmAction = ref<() => void>(() => { });
        const courses = ref<Course[]>([
            { id: '1', value: 'a', text: 'A' },
            { id: '2', value: 'b', text: 'B' },
        ]);
        const tasks = reactive<Task[]>([
            { id: uuidv4(), course: '1', title: 'Task 1', publicationDate: new Date(), deadline: new Date(), description: 'This is task 1 lorem lorem lorem lorem lorem loremlorem lorem loremlorem lorem loremlorem lorem loremlorem lorem loremlorem lorem loremlorem lorem loremlorem lorem loremlorem lorem lorem.', details: 'Details of task 1 lorem lorem loremlorem lorem loremlorem lorem loremlorem lorem loremlorem lorem loremlorem lorem loremlorem lorem loremlorem lorem loremlorem lorem loremlorem lorem lorem' },
            { id: uuidv4(), course: '2', title: 'Task 2', publicationDate: new Date(), deadline: new Date(), description: 'This is task 2.', details: 'Details of task 2' },
            { id: uuidv4(), course: '1', title: 'Task 3', publicationDate: new Date(), deadline: new Date(), description: 'This is task 3.', details: 'Details of task 3' },
            { id: uuidv4(), course: '2', title: 'Task 4', publicationDate: new Date(), deadline: new Date(), description: 'This is task 4.', details: 'Details of task 4' },
            { id: uuidv4(), course: '1', title: 'Task 5', publicationDate: new Date(), deadline: new Date(), description: 'This is task 5.', details: 'Details of task 5' },
            { id: uuidv4(), course: '2', title: 'Task 6', publicationDate: new Date(), deadline: new Date(), description: 'This is task 6.', details: 'Details of task 6' },
            { id: uuidv4(), course: '1', title: 'Task 7', publicationDate: new Date(), deadline: new Date(), description: 'This is task 7.', details: 'Details of task 7' },
            { id: uuidv4(), course: '2', title: 'Task 6', publicationDate: new Date(), deadline: new Date(), description: 'This is task 6.', details: 'Details of task 6' },
            { id: uuidv4(), course: '1', title: 'Task 7', publicationDate: new Date(), deadline: new Date(), description: 'This is task 7.', details: 'Details of task 7' },
        ]);
        const selectedCourseId = ref<string>(courses.value[0].id || '');
        const showModal = ref(false);
        const selectedTask = ref<Task | null>(null);
        const modalTitle = computed(() => selectedTask.value ? 'Editar Tarea' : 'Crear Tarea');

        // * LOADING TASKS
        const filteredTasks = computed(() => {
            return tasks.filter((task) => task.course === selectedCourseId.value);
        });

        // *TASK ACTIONS
        const updateTask = (taskData: Task) => {
            const index = tasks.findIndex((task) => task.id === taskData.id);
            if (index !== -1) {
                tasks.splice(index, 1, taskData);
            }
            showModal.value = false;

            alertInfo.title = 'Task Updated';
            alertInfo.content = `Task ${taskData.title} has been updated.`;
            alertInfo.color = 'info';
            showAlertInfo();
        };

        const deleteTask = (taskId: string) => {
            const index = tasks.findIndex((task) => task.id === taskId);
            if (index !== -1) {
                const deletedTask = tasks[index];
                tasks.splice(index, 1);
                alertInfo.title = 'Task Deleted';
                alertInfo.content = `Task ${deletedTask.title} has been deleted.`;
                alertInfo.color = 'error';
                showAlertInfo();
            }
            confirmDialog.value = false;
        };

        const editTask = (taskId: string) => {
            const task = tasks.find((task) => task.id === taskId);
            if (task) {
                selectedTask.value = { ...task };
                showModal.value = true;
            }
            confirmDialog.value = false;
        };


        const createTask = (taskData: Task) => {
            const newTask = { ...taskData};
            tasks.push(newTask);
            filteredTasks.value.push(newTask);
            showModal.value = false;
            
            alertInfo.title = 'Task Created';
            alertInfo.content = `Task ${newTask.title} has been created.`;
            alertInfo.color = 'success';
            showAlertInfo();

        };

        // * HANDLERS 
        const cancelAction = () => {
            confirmDialog.value = false;
            showModal.value = false;
            confirmAction.value = () => { };
        };

        const handleNewTask = () => {
            selectedTask.value = null;
            showModal.value = true;
        };

        const cancelTask = () => {
            showModal.value = false;
        };

        const showAlertInfo = () => {
            alertInfo.visible = true;

            setTimeout(() => {
                alertInfo.visible = false;
            }, 4000);
        };
        // * PROMPTS
        const promptDelete = (taskId: string) => {
            confirmTitle.value = 'Eliminar Tarea';
            confirmText.value = '¿Estás seguro de que quieres eliminar esta tarea?';
            confirmDialog.value = true;
            confirmAction.value = () => deleteTask(taskId);
        };

        const promptEdit = (taskId: string) => {
            confirmTitle.value = 'Editar Tarea';
            confirmText.value = '¿Estás seguro de que quieres editar esta tarea?';
            confirmDialog.value = true;
            confirmAction.value = () => editTask(taskId);
        };


        return {
            courses,
            tasks,
            selectedCourseId,
            showModal,
            selectedTask,
            modalTitle,
            filteredTasks,
            confirmDialog,
            confirmTitle,
            confirmText,
            confirmAction,
            createTask,
            updateTask,
            promptDelete,
            promptEdit,
            cancelAction,
            handleNewTask,
            cancelTask,
            alertInfo
        };
    },
};
</script>
  
<style>
.tasksWindow {
    height: auto;
}

#new-taskForm {
    margin: 0 auto;
    padding: 0vh;
}

#new-taskForm.field {
    margin: 2vh;
}

.title {
    text-align: center;
    max-height: 10vh;
    padding: 2vh;
}

.section-header {
    background-color: #EEEEEE;
    border-radius: 10vh;
    padding: 1vh;
    padding-left: 1vh;
}

.section-header .info {
    padding: 2vh;
}

.section-header .new-btn {
    background-color: #FEBE01;
    color: #F6F6F6;
    font-weight: bolder;
    border-radius: 2vh;
}

.section-header .new-btn .icon {
    width: auto;
    padding: 0;
    font-size: 1rem;
}

.tasks {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 4vh 3vh;
    padding: 1em;
    max-height: 100vh;
    overflow-y: scroll;
}

.task {
    width: 100%;
    max-width: 100%;
    margin-bottom: 4vh;
    padding: 1.5vh;
    transition: width ease-in-out 2s;
}

.task .title {
    align-self: center;
    text-align: center;
}

.task .task-section {
    margin: 1vh;
}

.details-content {
    padding: 0;
}

.task .card-actions {
    display: flex;
    justify-content: space-evenly;
}

.task .card-actions .action-btn {
    background-color: rgba(238, 238, 238, 0.5);
}
</style>
  