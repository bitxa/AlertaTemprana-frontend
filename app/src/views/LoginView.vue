
<template>
  <div class="login-container">
    <div class="progress-container" v-if="isLoggingIn">

      <v-progress-circular color="blue-lighten-3" indeterminate :size="99" :width="12"></v-progress-circular>

    </div>
    <div class="info-container">
      <v-carousel class="carousel" height="900" show-arrows="hover" cycle hide-delimiter-background>
        <template v-slot:prev="{ props }">
          <v-btn rounded color="#E5EC00" @click="props.onClick">
            <AnFilledCaretLeft />
          </v-btn>
        </template>
        <template v-slot:next="{ props }">
          <v-btn rounded color="#E5EC00" @click="props.onClick">
            <AnFilledCaretRight />
          </v-btn>
        </template>
        <v-carousel-item v-for="(item, i) in carrouselImgs" :key="i" :src="item.src" cover></v-carousel-item>
      </v-carousel>
    </div>

    <div class="form-container">
      <form @submit.prevent="login">
        <span class="header">
          <img src="../assets/img/utpl_tec_logo_login.png" alt="">
          <h2>Bienvenido!</h2>
          <p>Ingresa al sistema con tus credenciales institucionales.</p>
        </span>

        <input v-model="email" type="email" name="email" id="email" placeholder="Correo institucional">
        <input v-model="password" type="password" name="password" id="password" placeholder="Contraseña">
        <v-btn type="submit" @click="login">
          INGRESAR
        </v-btn>
      </form>
    </div>

  </div>
</template>
  
<script lang="ts">
import { AnFilledCaretLeft } from "@kalimahapps/vue-icons";
import { AnFilledCaretRight } from "@kalimahapps/vue-icons";
import { useStore } from '@/stores/store';
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { User } from "@/types/types";

export default {
  name: 'LoginView',
  components: {
    AnFilledCaretLeft,
    AnFilledCaretRight,
  },

  setup() {
    const router = useRouter();
    const store = useStore();
    const email = ref('');
    const password = ref('');

    const isLoggingIn = ref(false);

    const redirectToRespectivePanel = (route: string, user: User | null) => {
      router.push(route);
    };

    const login = async () => {
      isLoggingIn.value = true;
      await store.login(email.value, password.value)
        .then((user) => {
          if (user) {
            switch (user.role.toLocaleLowerCase()) {
              case 'estudiante':
                redirectToRespectivePanel('student/panel', user);
                return;
              case 'profesor':
                redirectToRespectivePanel("professor/panel", user);
                return;
            }
          } else {
            alert('Credenciales incorrectas. Por favor, intente nuevamente.');
          }
        })
        .catch((error) => {
          console.error('Error in login:', error);
        }).finally(() => {
          isLoggingIn.value = false;
        });
    };

    return {
      email,
      password,
      login,
      isLoggingIn
    }
  },

  data() {
    return {
      carrouselImgs: [
        {
          src: '/src/assets/img/login/tec1.png',
        },
        {
          src: '/src/assets/img/login/tec2.jpg',
        },
        {
          src: '/src/assets/img/login/tec3.jpg',
        },
        {
          src: '/src/assets/img/login/tec4.jpg',
        },
        {
          src: '/src/assets/img/login/tec5.png',
        },
        {
          src: '/src/assets/img/login/tec6.jpg',
        }

      ],
    }
  },
}

</script>


<style scoped src="@/assets/styles/login/login.css"></style>
