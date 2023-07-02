<template>
    <v-menu rounded>
        <template v-slot:activator="{ props }">
            <v-img class="user-icon " src="/src/assets/img/user_icon.webp" v-bind="props"></v-img>
            <h4>{{ user.fullName }}</h4>
            <p class="user-role">{{ user.role }}</p>
        </template>
        <v-card>
            <v-card-text>
                <div class="mx-auto text-center">
                    <v-avatar color="brown">
                        <span class="text-h5">{{ user.initials }}</span>
                    </v-avatar>
                    <h3>{{ user.fullName }}</h3>
                    <p class="text-caption mt-1">
                        @{{ user.username }}
                    </p>
                    <v-divider class="my-3"></v-divider>
                    <v-btn rounded variant="text" @click="disconnect()">
                        Desconectar
                    </v-btn>        
                </div>
            </v-card-text>
        </v-card>
    </v-menu>
</template>

<script lang="ts">
export default {
    data: () => ({
        user: {
            initials: 'JR',
            username: 'jsromero13',
            fullName: 'Joel Romero',
            role: 'Estudiante',
            email: 'jsromero13@utpl.edu.ec',
        },
    }),

    methods: {
        disconnect() {
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
.user-icon{
    aspect-ratio: 2/1;
}

.user-role{
    font-size: 0.7rem;
    text-transform: uppercase;
    font-weight: 600;
}

@media (max-width: 768px) {
    .user-icon{
    aspect-ratio: 3/1;
}
}
</style>