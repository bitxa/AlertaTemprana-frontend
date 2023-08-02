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
                                    <button type="button" class="menu_button" @click="selectMenuItem('evidencesSolicitations')"
                                        :class="{ active: currentComponent === 'EvidencesSolicitations' }">
                                        <span>
                                            <MdAssignment class="menu_icon" />
                                        </span>
                                        <v-tooltip activator="parent" location="start">Asignaciones</v-tooltip>
                                    </button>

                                    <button type="button" class="menu_button" @click="selectMenuItem('studentsProgress')"
                                        :class="{ active: currentComponent === 'StudentsProgress' }">
                                        <span>
                                            <IoFootsteps class="menu_icon" />
                                        </span>
                                        <v-tooltip activator="parent" location="start">Progreso estudiantes</v-tooltip>
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
    </v-container>
</template>

<script lang="ts">
import { MdAssignment, JaFillFiles, FaRegCalendarDays, FaLayerGroup, ChMenuKebab, MdRoundArrowBackIosNew, IoFootsteps } from "@kalimahapps/vue-icons";
import ThemeToogle from "@/components/fragments/ThemeToogle.vue";
import UserInfo from "@/components/fragments/UserInfo.vue";
import EvidencesSolicitations from "@/components/professor/EvidencesSolicitations.vue";
import StudentsProgress from "@/components/professor/StudentsProgress.vue";

import Calendar from "@/components/professor/Calendar.vue";
import { useStore } from "@/stores/store";
import { ref, watchEffect, type Ref } from "vue";

export default {
    name: "ProfessorView",

    components: {
        MdAssignment,
        JaFillFiles,
        FaRegCalendarDays,
        FaLayerGroup,
        ChMenuKebab,
        IoFootsteps,
        MdRoundArrowBackIosNew,
        ThemeToogle,
        UserInfo,
        EvidencesSolicitations,
        StudentsProgress,
        Calendar,
    },

    setup() {

        const store = useStore();

        const currentComponent: Ref<string> = ref('EvidencesSolicitations');

        const user = store.getCurrentUser;

        const selectMenuItem = (menuItem: string) => {
            switch (menuItem) {
                case 'evidencesSolicitations':
                    currentComponent.value = 'EvidencesSolicitations';
                    break;
                case 'studentsProgress':
                    currentComponent.value = 'StudentsProgress';
                    break;
                case 'calendar':
                    currentComponent.value = 'Calendar';
                    break;
            }
        };

        const toggleMenu = () => {
            showMenu.value = !showMenu.value;
        };

        const hideMenuButton = () => {
            showMenu.value = false;
        };

        const showMenuButton = () => {
            showMenu.value = true;
        };

        const toggleDarkMode = () => {
            lightMode.value = !lightMode.value;
        };

        const showMenu = ref(true);
        const lightMode = ref(false);


        return {
            user,
            currentComponent,
            selectMenuItem,
            toggleMenu,
            hideMenuButton,
            showMenuButton,
            toggleDarkMode,
            showMenu,
            lightMode,
        };
    },
};
</script>


