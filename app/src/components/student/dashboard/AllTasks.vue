
<style scoped src="@/assets/styles/dashboard/all_tasks/all_tasks.css"></style>

<template>
    <div>
        <div class="d-flex align-center flex-column pa-6">
            <v-btn-toggle v-model="window" divided mandatory rounded="xl">
                <v-btn value="pending" color="red darken-4">Pendientes</v-btn>
                <v-btn value="in-progress" color="yellow darken-4">En Proceso</v-btn>
                <v-btn value="completed" color="green darken-4">Terminadas</v-btn>
            </v-btn-toggle>
        </div>
        <v-window v-model="window">
            <v-window-item value="pending" class="pending-window">
                <v-expansion-panels variant="popout" class="tasks_containerByDate scrollable">
                    <v-expansion-panel class="hidden-tasks" :expanded="true">
                        <v-expansion-panel-title expand-icon="mdi-menu-down" class="toolbar-header">
                            <h3>Semana 1</h3>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text v-for="task in pendingTasks" :key="task?.id">
                            <v-card class="task">
                                <div class="task-info">
                                    <h3 class="info-title"><b>{{ task?.title }}</b></h3>
                                    <div class="info-description ma-2">
                                        <p>{{ task?.description }}</p>
                                    </div>
                                    <div class="info-details">
                                        <small class="ma-2" style="align-self: flex-end;">Disponible hasta: <small
                                                style="font-weight: 100;">{{ task?.deadline }}</small></small>

                                    </div>

                                </div>
                                <div class="task-actions">

                                    <v-btn :to="{ name: 'student_task', params: { id: task?.id } }" stacked variant="plain"
                                        class="action-button">
                                            <p>Ver</p>
                                            <CgEyeAlt class="icon" />
                                    </v-btn>


                                </div>
                            </v-card>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-divider />
            </v-window-item>

            <v-window-item value="in-progress" class="in-progress-window">
                <v-expansion-panels class="tasks_containerByDate scrollable">
                    <v-expansion-panel class="hidden-tasks" default-open>
                        <v-expansion-panel-title expand-icon="mdi-menu-down" class="toolbar-header">
                            <h3>Semana #1</h3>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-card class="task">
                                <div class="task-info">
                                    <h4 class="info-title">Documento Asignación Firmado</h4>
                                    <div class="info-description">
                                        <span>
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi repellendus
                                            excepturi,
                                            aliquid
                                            error
                                            omnis
                                            mollitia! Maiores pariatur illo esse autem, sapiente atque dolorem officia fugit
                                            ipsum
                                            ratione,
                                            at
                                            dicta
                                            optio?
                                        </span>
                                    </div>
                                    <small class="ma-2" style="align-self: flex-end;">Disponible hasta 20 Julio,
                                        2023</small>

                                </div>

                                <div class="task-actions">
                                    <v-btn stacked variant="plain" class="action-button">
                                        <span>
                                            <p>Ver</p>
                                            <CgEyeAlt class="icon" />
                                        </span>
                                    </v-btn>
                                </div>
                            </v-card>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-divider />
            </v-window-item>

            <v-window-item value="completed" class="in-progress-window">
                <v-expansion-panels class="tasks_containerByDate scrollable">
                    <v-expansion-panel class="hidden-tasks" default-open>
                        <v-expansion-panel-title expand-icon="mdi-menu-down" class="toolbar-header">
                            <h3>Semana #1</h3>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-card class="task">
                                <div class="task-info">
                                    <h4 class="info-title">Documento Asignación Firmado</h4>
                                    <div class="info-description">
                                        <span>
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi repellendus
                                            excepturi,
                                            aliquid
                                            error
                                            omnis
                                            mollitia! Maiores pariatur illo esse autem, sapiente atque dolorem officia fugit
                                            ipsum
                                            ratione,
                                            at
                                            dicta
                                            optio?
                                        </span>
                                    </div>
                                    <small class="ma-2" style="align-self: flex-end;">Disponible hasta 20 Julio,
                                        2023</small>

                                </div>

                                <div class="task-actions">
                                    <v-btn stacked variant="plain" class="action-button">
                                        <span>
                                            <p>Ver</p>
                                            <CgEyeAlt class="icon" />
                                        </span>
                                    </v-btn>
                                </div>
                            </v-card>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-divider />
            </v-window-item>
        </v-window>
    </div>
</template>

<script lang="ts">
import { CgEyeAlt } from "@kalimahapps/vue-icons"
import { ClUnfoldMore } from "@kalimahapps/vue-icons";
import { useStore } from "@/stores/store";
import { type Task } from "@/types/types";
import { json } from "stream/consumers";


export default {
    name: 'AllTasks',
    components: {
        CgEyeAlt,
        ClUnfoldMore
    },

    data: () => ({
        window: 'pending',
        pendingTasks: [] as Task[],
        inProgressTasks: [] as Task[],
        completedTasks: [] as Task[]
    }),

    async created() {
        const currentUser = useStore().getCurrentUser;

        if (currentUser) {
            this.pendingTasks = await useStore().fetchStudentTasks(
                currentUser.id,
                "pending"
            );

        }
    },
}
</script>
