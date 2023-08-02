<template>
    <v-container fluid>
        <v-card class="mb-4" subtitle="¿Qué es esto?"
            text="La información solicitada a continuación será de vital importancia para agilizar el llenado de tus evidencias. Asegúrate de proporcionar información precisa y real."></v-card>
        <v-form ref="form">
            <v-textarea v-model="form.priorExperience" label="Experiencia Previa"
                hint="Cualquier experiencia laboral, prácticas anteriores, proyectos relevantes, voluntariado o actividades extracurriculares"
                required></v-textarea>

            <v-textarea v-model="form.skillsKnowledge" label="Habilidades y Conocimientos"
                hint="Lista de habilidades técnicas y habilidades blandas relevantes para tu campo de estudio o área de interés"
                required></v-textarea>

            <v-textarea v-model="form.professionalInterestsGoals" label="Intereses y Objetivos Profesionales"
                hint="Tus intereses específicos en términos de tu área de estudio, la industria o campo en el que te gustaría trabajar, y tus metas profesionales a corto y largo plazo"
                required></v-textarea>

            <v-text-field v-model="form.languages" label="Idiomas"
                hint="Conocimiento de idiomas adicionales, si es relevante para la posición o industria"></v-text-field>

            <v-btn class="action" :disabled="!valid" @click="submit">
                Enviar
            </v-btn>

            <v-btn class="action" @click="reset">
                Reiniciar
            </v-btn>
        </v-form>
    </v-container>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
    setup() {
        const valid = ref(true);
        const form = ref({
            priorExperience: '',
            skillsKnowledge: '',
            professionalInterestsGoals: '',
            languages: '',
        });

        const router = useRouter();

        const submit = () => {
            if (valid.value) {
                router.push('/student/panel');
            }
        };

        const reset = () => {
            form.value = {
                priorExperience: '',
                skillsKnowledge: '',
                professionalInterestsGoals: '',
                languages: '',
            };
        };

        return {
            form,
            valid,
            submit,
            reset
        };
    }
};
</script>


<style scoped>
.action {
    margin: 3vh;
    background-color: #ffffff;
    color: #ffffffbf;
}
</style>