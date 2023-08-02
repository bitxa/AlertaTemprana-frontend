<template>
    <v-menu rounded>
        <template v-slot:activator="{ props }">
                <v-img class="user-icon" src="/src/assets/img/user_icon.webp" v-bind="props"></v-img>
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
                        <p class="text-caption mt-1">@{{ user.username }}</p>
                        <v-divider class="my-3"></v-divider>
                        <v-btn rounded variant="text" @click="logout">
                            Desconectar
                        </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { User } from '@/types/types';
import router from '@/router';
import { useStore } from '@/stores/store';

export default defineComponent({
    props: {
        user: {
            type: Object as () => User,
            required: true,
        },
    },

    setup(props) {
        const store = useStore();
        const currentUser = props.user;

        const logout = async () => {
            await store.logout();
            router.push('/login');
        };

        return {
            user: props.user,
            currentUser,
            logout,
        };
    },
});
</script>

<style scoped>
.user-icon {
    aspect-ratio: 2/1;
    transition: transform 0.5s;
}

.user-icon:hover {
    transform: scale(1.3);
}

.user-role {
    font-size: 0.7rem;
    text-transform: uppercase;
    font-weight: 600;
}

@media (max-width: 768px) {
    .user-icon {
        aspect-ratio: 3/1;
    }
}
</style>
