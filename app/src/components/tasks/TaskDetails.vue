<template>
    <v-container fluid>
        <v-row>
            <v-col cols="8">
                <v-card v-if="task">
                    <v-card-title>{{ task.title }}</v-card-title>
                    <v-card-subtitle>Published: {{ formatDate(task.publicationDate) }}</v-card-subtitle>
                    <v-card-subtitle>Deadline: {{ formatDate(task.deadline) }}</v-card-subtitle>
                    <v-card-text>{{ task.description }}</v-card-text>
                </v-card>
            </v-col>
            <v-col cols="4">
                <!-- This is just a placeholder for the chat, replace it with a proper chat component -->
                <v-card>
                    <v-card-title>Chat</v-card-title>
                    <v-card-text>Chat with your professor here</v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useStore } from '@/stores/store';
import { type Task } from '@/types/types';

export default defineComponent({
    name: 'TaskDetails',
    props: {
        taskId: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const store = useStore();
        const task = ref<Task | null>(null);

        const formatDate = (date: Date): string => {
            return new Intl.DateTimeFormat('en-US').format(date);
        };

        const getTaskById = (id: string) => {
            for (const practicum of store.practicums) {
                for (const section of practicum.sections) {
                    const foundTask = section.tasks.find((task) => task.id === id);
                    if (foundTask) {
                        return foundTask;
                    }
                }
            }
            return null;
        }

        watch(() => props.taskId, (newVal) => {
            task.value = getTaskById(newVal);
        }, { immediate: true });

        return {
            task,
            formatDate
        };
    },
});
</script>
  