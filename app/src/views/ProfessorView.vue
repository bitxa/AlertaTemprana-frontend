
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
                <button type="button" class="menu_button" @click="selectMenuItem('tasks')"
                    :class="{ active: currentComponent === 'Tasks' }">
                    <span>
                        <MdAssignment class=" menu_icon" />
                    </span>
                    <v-tooltip activator="parent" location="start">Tareas</v-tooltip>
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
import { MdAssignment } from "@kalimahapps/vue-icons";
import { JaFillFiles } from "@kalimahapps/vue-icons";
import { FaRegCalendarDays } from "@kalimahapps/vue-icons";
import { FaLayerGroup } from "@kalimahapps/vue-icons";
import { ChMenuKebab } from "@kalimahapps/vue-icons";
import { MdRoundArrowBackIosNew } from "@kalimahapps/vue-icons";
// FRAGMENTS
import ThemeToogle from "@/components/fragments/ThemeToogle.vue"
import UserInfo from "@/components/fragments/UserInfo.vue";
// COMPONENTS
import Tasks from "@/components/professor/Tasks.vue";



export default {
    name: 'ProfessorView',
    components: {
        //icons
        MdAssignment,
        JaFillFiles,
        FaRegCalendarDays,
        FaLayerGroup,
        ChMenuKebab,
        MdRoundArrowBackIosNew,
        //components
        Tasks,

        //fragments
        ThemeToogle,
        UserInfo
    },
    data() {
        return {
            currentComponent: localStorage.getItem('lastComponent') || 'Tasks',
            showMenu: true,
            timeout: null as any,
            lightMode: false,
        };
    },
    methods: {
        selectMenuItem(menuItem: string) {
            switch (menuItem) {
                case 'tasks':
                    this.currentComponent = 'Tasks';
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

