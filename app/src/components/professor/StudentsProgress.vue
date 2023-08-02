<template>
    <v-container fluid>
        <v-row>
            <v-col cols="15" md="8">
                <transition name="fade">
                    <v-autocomplete chips closable-chips item-text="name" item-title="name" :items="students"
                        no-data-text="Sin coincidencias" item-value="name" return-object label="Buscar estudiante..."
                        class="mb-4 rounded-input autocomplete" color="light-blue lighten-2" variant="solo"
                        append-icon="mdi-magnify">
                        <template v-slot:chip="{ props, item }">
                            <v-chip v-bind="props" :text="item.raw.name"></v-chip>
                        </template>

                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props" :title="item?.raw?.name"></v-list-item>
                        </template>
                    </v-autocomplete>
                </transition>
                <div class="tasks-container overflow-auto">
                    <div class="grid-container">
                        <v-card class="task-card" v-for="(task, index) in tasks" :key="index">
                            <v-card-title style="display: flex; flex-direction: row; align-items: center;">
                                <h3 class="subtitle">{{ task.title }}</h3>
                            </v-card-title>

                            <v-card-text class="pa-2" style="background-color: #F5F5F5; border-radius: 2vh;">
                                <v-btn color="#00416F" variant="tonal" rounded="xl" size="small">Pendiente</v-btn>
                                <div class=" card-body ma-2">
                                    <h4 class="subtitle"><b>Descripción</b> </h4>
                                    <div class="ml-1 mt-1 content-item">
                                        {{ task.description }}
                                    </div>
                                    <h4 class="subtitle mt-3"><b>Plantillas asignadas </b></h4>
                                    <div class="ml-1 mt-1 content-item" v-for="(document, index) in task.documents"
                                        :key="index">
                                        <v-icon size="x-large" class="mr-2">
                                            <VsFileTypePdf2 />
                                        </v-icon>
                                        {{ document.name }}
                                    </div>
                                </div>

                            </v-card-text>
                            <v-card-actions style="margin-top: auto; align-items: center; justify-content: center;">
                                <v-btn style="font-weight: 600;" class="mt-2" block density="comfortable" variant="flat"
                                    color="#FEBE01" rounded="lg" size="large">
                                    <p>revisar</p>
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </div>
                </div>
            </v-col>
            <v-col cols="12" md="4" class="fixed-sidebar">
                <div class="resume-card full-height">
                    <div class="header">
                        <span>
                            <h4>Estás viendo a:</h4>
                            <p style="font-weight: 100;">Jane Smith</p>
                        </span>
                        <v-menu rounded>
                            <template v-slot:activator="{ props }">
                                <v-btn class="user-icon" v-bind="props"></v-btn>
                            </template>
                            <v-card min-width="300px">
                                <v-card-item>
                                    <v-list>
                                        <v-list-item prepend-avatar="https://cdn.vuetifyjs.com/images/lists/5.jpg"
                                            title="Jane Smith" subtitle="Tecnología de la Información">
                                            <template v-slot:append>
                                                <v-btn variant="text" :class="fav ? 'text-red' : ''" icon="mdi-heart"
                                                    @click="fav = !fav"></v-btn>
                                            </template>
                                            <span class="mt-2" style="display: inline-flex;">
                                                <h4>Plaza: </h4>
                                                <p class="ml-2">Nodolab</p>
                                            </span>
                                        </v-list-item>
                                    </v-list>
                                </v-card-item>
                                <v-divider></v-divider>
                            </v-card>
                        </v-menu>
                    </div>
                    <v-divider></v-divider>
                    <div class="task-status">
                        <div>
                            <small>Asignadas</small>
                            <p class="assigned">1</p>
                        </div>
                        <div>
                            <small>Pendientes</small>
                            <p class="pending">1</p>
                        </div>
                        <div>
                            <small>En progreso</small>
                            <p class="in-progress">0</p>
                        </div>
                        <div>
                            <small>Terminadas</small>
                            <p class="done">0</p>
                        </div>
                    </div>

                    <div class="chat-container">
                        <div class="chat-messages">
                            <div v-for="(message, index) in  messages " :key="index" class="message"
                                :class="{ sent: message.sent, received: !message.sent }">
                                <p class="message-text">
                                    {{ message.text }}
                                </p>
                                <small class=" message-time" :class="{ sent: message.sent }">{{ message.time }}</small>
                            </div>
                        </div>
                        <div class="chat-input">
                            <v-text-field v-model="newMessage" outlined label="Escribe un mensaje" rows="1" variant="solo"
                                density="compact">
                                <template v-slot:append>
                                    <v-icon class="sent-icon">
                                        <McSendPlaneFill style="color: blue;" />
                                    </v-icon>
                                </template>
                            </v-text-field>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { McSendPlaneFill, VsFileTypePdf2, McTask2Fill } from "@kalimahapps/vue-icons";
export default defineComponent({
    name: 'StudentProgress',

    components: {
        McSendPlaneFill,
        VsFileTypePdf2,
        McTask2Fill
    },
    data() {
        return {
            fav: true,
            menu: false,
            message: false,
            hints: true,
            tasks: [
                {
                    title: 'Documento de asignación', description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ...  ',
                    documents: [
                        { name: 'Document1.pdf' },
                    ]
                },
            ],
            students: [
                { id: 1, name: 'Jane Smith' },
            ],
            showStudentDropdown: false,
            messages: [
                { text: 'Buenas tardes.', time: '10:00 AM', sent: true },
                { text: 'Buenas tardes Ing.', time: '10:01 AM', sent: false },
                { text: 'Necesitas corregir el documento de asignación, revísalo, por favor.', time: '10:10 AM', sent: true },
            ],
            newMessage: '',
        };
    },
    methods: {
        toggleStudentDropdown() {
            this.showStudentDropdown = !this.showStudentDropdown;
        },
        sendMessage() {
            if (this.newMessage) {
                const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                this.messages.push({ text: this.newMessage, time: currentTime, sent: true });
                this.newMessage = '';
            }
        },
    },
});
</script>

<style scoped>
.task-card {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    color: #f9f3f3;
    width: auto;
    height: auto;
    padding: 2vh;
    box-sizing: border-box;
    border-radius: 20px;
    box-shadow: 1px 0.7px 2px 0.3px #00416F;
}

.task-status {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2vh;
    padding: 20px;
}

.task-status>div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
}

.task-status>div>small {
    margin-bottom: 1vh;
    font-weight: 400;
}

.task-status>div>p {
    font-size: 1.3rem;
}

.assigned {
    border-left: 5px solid #F86F03;
    padding-left: 10px;
}

.pending {
    border-left: 5px solid #F31559;
    padding-left: 10px;
}

.in-progress {
    border-left: 5px solid #525FE1;
    padding-left: 10px;
}

.done {
    border-left: 5px solid #A2FF86;
    padding-left: 10px;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    justify-items: center;
    padding: 20px;
}

.resume-card {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    padding: 0;
    margin: 0;
    height: 100%;
    box-shadow: -10px 0px 10px -5px rgba(0, 0, 0, 0.1);
}

.resume-card .header {
    width: 100%;
    padding: 2vh;
    display: flex;
    flex-direction: row;
}

.resume-card .header span {
    display: inline-block;
    padding: 2vh;
    text-align: start;
}

.resume-card .header .user-icon {
    width: 100px;
    height: 100px;
    background-image: url('/src/assets/img/student_3d.png');
    background-position: center;
    background-size: cover;
    border-radius: 50%;
    cursor: pointer;
}

.fixed-sidebar {
    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    width: 25%;
}

.autocomplete {
    width: 60%;
    position: sticky;
    top: 0;
    z-index: 100;
}

.tasks-container {
    padding-top: 1vh;
    margin: 0;
    height: calc(100vh - 70px);
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 20px;
}

.chat-container {
    margin-top: auto;
    margin-left: 2vh;
    width: auto;
    min-width: 100%;
    max-width: 100%;
    border: 1px solid #ccc;
    align-self: center;
    border-radius: 8px;
    padding: 2vh;
    padding-bottom: 0;
}

.chat-messages {
    height: auto;
    width: 100%;
    overflow-y: scroll;
}

.message {
    margin-bottom: 8px;
}

.message-text {
    color: #f9f3f3;
    margin: 0;
    padding: 1.5vh 1vh 1.5vh 1vh;
    border-radius: 8px;
}

.message.sent small {
    color: #98A8F8;

}

.message.sent .message-text {
    background-color: #98A8F8;
}

.message.received .message-text {
    background-color: #D1D1D1;
    color: #414344;
}


.message-time {
    font-size: 0.7em;
    color: #777;
}

.chat-input {
    margin-top: 6vh;
    align-self: flex-end;
    display: flex;
    align-items: center;
}

.sent-icon {
    color: #4E709D;
    cursor: pointer;
}

.sent-icon:hover {
    transform: scale(1.1);
    transform: translateX(1px);
}

.subtitle {
    color: #41444B;
}

.content-item {
    color: #52575D;
}
</style>
