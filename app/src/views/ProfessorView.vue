
<style src="@/assets/styles/view.css"></style>

<template>
    <v-container fluid class="admin-panel">

        <aside :class="{ 'hide-menu': !showMenu }" @mouseleave="hideMenuButton" @mouseover="showMenuButton">
            <img src="../assets/img/utpl_tec_logo.png" class="logo">
            <div class="user">
                <img src="../assets/img/user_icon.webp" class="user_icon">
                <h3 class="name">Joel Romero</h3>
                <h3 class="username">
                    <b>@jsromero13</b>
                </h3>
                <h6 class="role">estudiante</h6>

            </div>

            <div class="menu">
                <button type="button" class="menu_button" @click="selectMenuItem('dashboard')"
                    :class="{ active: currentComponent === 'Dashboard' }">
                    <span>
                        <FlFilledPanelSeparateWindow class=" menu_icon" />
                    </span>
                </button>

                <button type="button" class="menu_button" @click="selectMenuItem('evidences')"
                    :class="{ active: currentComponent === 'Evidences' }">
                    <v-tooltip left>

                        <span>
                            <JaFillFiles class="menu_icon" />
                        </span>
                    </v-tooltip>
                </button>


                <button type="button" class="menu_button" @click="selectMenuItem('work_placements')"
                    :class="{ active: currentComponent === 'WorkPlacements' }">
                    <span>
                        <FaLayerGroup class="menu_icon" />
                    </span>
                </button>

                <button type="button" class="menu_button" @click="selectMenuItem('calendar')"
                    :class="{ active: currentComponent === 'Calendar' }">
                    <span>
                        <FaRegCalendarDays class="menu_icon" />
                    </span>
                </button>

                <ThemeToogle style="align-self: bottom;" />
            </div>
        </aside>

        <main>
            <button class="menu-toggle-button" @click="toggleMenu">
                <ChMenuHamburger class="menu-icon" :class="{ 'menu-icon-active': !showMenu }" />
            </button>
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
import { ChMenuHamburger } from "@kalimahapps/vue-icons";
// FRAGMENTS
import ThemeToogle from "@/components/fragments/ThemeToogle.vue"
// COMPONENTS
import Dashboard from "@/components/student/Dashboard.vue";
import Evidences from "@/components/student/Evidences.vue";
import WorkPlacements from "@/components/student/WorkPlacements.vue";


//Vuex Storage
export default {
    name: 'StudentView',
    components: {
        //icons
        FlFilledPanelSeparateWindow,
        JaFillFiles,
        FaRegCalendarDays,
        FaLayerGroup,
        ChMenuHamburger,
        //components
        Dashboard,
        Evidences,
        WorkPlacements,

        //fragments
        ThemeToogle,
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
                case 'work_placements':
                    this.currentComponent = 'TeamsComponent';
                    break;
            }
            localStorage.setItem('lastComponent', this.currentComponent);
        },

        toggleMenu() {
            this.showMenu = !this.showMenu;
        },

        hideMenuButton() {
            this.timeout = setTimeout(() => {
                this.showMenu = false;
            }, 2000);
        },

        showMenuButton() {
            clearTimeout(this.timeout);
            this.showMenu = true;
        },

        toggleDarkMode() {
            this.lightMode = !this.lightMode;
        },
    },


}
</script>

