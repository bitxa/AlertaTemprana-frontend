
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
                <UserInfo />
            </div>

            <div class="menu">
                <button type="button" class="menu_button" @click="selectMenuItem('dashboard')"
                    :class="{ active: currentComponent === 'Dashboard' }">
                    <span>
                        <FlFilledPanelSeparateWindow class=" menu_icon" />
                    </span>
                        <v-tooltip activator="parent" location="start">Panel</v-tooltip>
                </button>

                <button type="button" class="menu_button" @click="selectMenuItem('evidences')"
                    :class="{ active: currentComponent === 'Evidences' }">
                    <span>
                        <JaFillFiles class="menu_icon" />
                    </span>
                    <v-tooltip activator="parent" location="start">Evidencias</v-tooltip>

                </button>


                <button type="button" class="menu_button" @click="selectMenuItem('workplacement')"
                    :class="{ active: currentComponent === 'WorkPlacement' }">
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

    </v-container>
</template>

<script lang="ts">
// ICONS
import { FlFilledPanelSeparateWindow } from "@kalimahapps/vue-icons";
import { JaFillFiles } from "@kalimahapps/vue-icons";
import { FaRegCalendarDays } from "@kalimahapps/vue-icons";
import { FaLayerGroup } from "@kalimahapps/vue-icons";
import { ChMenuKebab } from "@kalimahapps/vue-icons";
import { MdRoundArrowBackIosNew } from "@kalimahapps/vue-icons";
// FRAGMENTS
import ThemeToogle from "@/components/fragments/ThemeToogle.vue"
import UserInfo from "@/components/fragments/UserInfo.vue";
// COMPONENTS
import Dashboard from "@/components/student/Dashboard.vue";
import Evidences from "@/components/student/Evidences.vue";
import WorkPlacement from "@/components/student/WorkPlacement.vue";
import Calendar from "@/components/student/Calendar.vue";


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
        //components
        Dashboard,
        Evidences,
        WorkPlacement,
        Calendar,
        //fragments
        ThemeToogle,
        UserInfo
    },
    data() {
        return {
            currentComponent: localStorage.getItem('lastComponent') || 'Dashboard',
            showMenu: true,
            timeout: null as any,
            lightMode: false,
        };
    },
    methods: {
        selectMenuItem(menuItem: string) {
            switch (menuItem) {
                case 'dashboard':
                    this.currentComponent = 'Dashboard';
                    break;
                case 'evidences':
                    this.currentComponent = 'Evidences';
                    break;
                case 'workplacement':
                    this.currentComponent = 'WorkPlacement';
                    break;
                case 'calendar':
                    this.currentComponent = 'Calendar';
                    break;
            }
            localStorage.setItem('lastComponent', this.currentComponent);
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

