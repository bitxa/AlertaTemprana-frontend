
<style src="@/assets/styles/view.css"></style>

<template>
    <v-container fluid class="admin-panel">
        <button class="menu-toggle-button" @click="toggleMenu">
            <ChMenuKebab class="menu-icon" :class="{ 'menu-icon-active': !showMenu }" />
        </button>
        <aside :class="{ 'hide-menu': !showMenu }">
            <v-icon class="aside-close-icon" @click="hideMenuButton">
                <MdRoundArrowBackIosNew></MdRoundArrowBackIosNew>
            </v-icon>

            <img src="../assets/img/utpl_tec_logo.png" class="logo">

            <div class="user">
                                        <UserInfo v-if="user" :user="user" />
                                    </div>

                                    <div class="menu">
                                        <button type="button" class="menu_button" @click="selectMenuItem('dashboard')"
                                            :class="{ active: currentComponent === 'Dashboard' }">
                                            <span>
                                                <FlFilledPanelSeparateWindow class=" menu_icon" />
                                            </span>

                                            <v-tooltip activator="parent" location="start">Panel</v-tooltip>
                                        </button>

                                        <button type="button" class="menu_button" @click="selectMenuItem('practicumVacancy')"
                                            :class="{ active: currentComponent === 'PracticumVacancy' }">
                                            <span>
                                                <FaLayerGroup class="menu_icon" />
                                            </span>
                                            <v-tooltip activator="parent" location="start">Plaza</v-tooltip>
                                        </button>

                                        <button type="button" class="menu_button" @click="selectMenuItem('calendar')"
                                            :class="{ active: currentComponent === 'Calendar' }">
                                            <span>
                                                <FaRegCalendarDays class="menu_icon" />
                                            </span>
                                            <v-tooltip activator="parent" location="start">Calendario tareas</v-tooltip>
                                        </button>
                                    </div>
                                    <ThemeToogle />
                                </aside>

                                <main>
                                    <keep-alive>
                                        <component :is="currentComponent" :key="currentComponent"></component>
                                    </keep-alive>
                                </main>

                                <v-dialog v-model="info_dialog" persistent>
                                    <v-card class="place-info">
                                        <v-card-title class="headline">
                                            <AkInfoFill />
                                            <h6>Información</h6>
                                        </v-card-title>
                                        <v-card-text>
                                            <p>Has sido asigad@ a la siguiente plaza:</p>
                                            <br>
                                            <span class="initial-info">
                                                <p><b>Empresa:</b> Nodo Lab.Co </p>
                                                <p><b>Tipo: </b> Externa</p>
                                                <p><b>Tutor: </b> Jimmy Jose Jaramillo</p>
                                                <p><b>Correo: </b> nodolab2@electritele.com</p>
                                            </span>

                                            <small class="comunication">
                                                <br>
                                                <p><small>Ir al apartado <b><i> <a href="">plaza</a></i></b> para más información ...</small></p>
                                                Cualquier duda o inconveniente comunicarse directamente con el tutor de la plaza o con su docente
                                                tutor.
                                            </small>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="green darken-1" text @click="info_dialog = false">Okay</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
    </v-container>
</template>

<script lang="ts">
// ICONS

import { FlFilledPanelSeparateWindow, JaFillFiles, AkInfoFill, FaRegCalendarDays, FaLayerGroup, ChMenuKebab, MdRoundArrowBackIosNew } from "@kalimahapps/vue-icons";
// FRAGMENTS
import ThemeToogle from "@/components/fragments/ThemeToogle.vue"
import UserInfo from "@/components/fragments/UserInfo.vue";
// COMPONENTS
import Dashboard from "@/components/student/Dashboard.vue";

import PracticumVacancy from "@/components/student/PracticumVacancy.vue";
import Calendar from "@/components/student/Calendar.vue";
import { useStore } from '@/stores/store';
import { ref } from "vue";
import type { Ref } from "vue";

import Docxtemplater from "docxtemplater";
import JSZipUtils from "jszip-utils";
import JSZip from "jszip";

export default {
    name: 'StudentView',
    components: {
        //icons
        FlFilledPanelSeparateWindow,
        JaFillFiles,
        FaRegCalendarDays,
        FaLayerGroup,
        ChMenuKebab,
        MdRoundArrowBackIosNew,
        AkInfoFill,
        //components
        Dashboard,
        PracticumVacancy,
        Calendar,
        //fragments
        ThemeToogle,
        UserInfo
    },

    setup() {

        const store = useStore();
        const user = store.getCurrentUser;

        const info_dialog = ref(true);
        const currentComponent: Ref<string> = ref('Dashboard');

        return {
            user,
            info_dialog,
            currentComponent,
        }
    },
    data() {
        return {
            showMenu: true,
            lightMode: false,
        };
    },
    methods: {
        selectMenuItem(menuItem: string) {
            switch (menuItem) {
                case 'dashboard':
                    this.currentComponent = 'Dashboard';
                    break;
                case 'practicumVacancy':
                    this.currentComponent = 'PracticumVacancy';
                    break;
                case 'calendar':
                    this.currentComponent = 'Calendar';
                    break;
            }
        },

        toggleMenu() {
            this.showMenu = !this.showMenu;
        },

        hideMenuButton() {
            this.showMenu = false;
        },
        showMenuButton() {
            this.showMenu = true;
        },

        toggleDarkMode() {
            this.lightMode = !this.lightMode;
        },
    },


}
</script>

<style scoped>
.headline {
    display: flex;
    align-items: center;
    padding: 2vh;
}

.headline * {
    font-size: 1.6rem;
    margin-left: 1vh;
    color: #257FFF;
}

.place-info {
    color: #393E46;
    min-height: 50vh;

}

.comunication {
    width: 86%;
    margin-top: 1rem;
    font-weight: 400 !important;
    opacity: 0.5;
}

.initial-info {
    display: flex;
    flex-direction: column;
}
</style>

