
<style scoped src="@/assets/styles/login/login.css"></style>

<template>
  <div class="login-container">
    <div class="info-container">
      <v-carousel class="carousel" height="900" show-arrows="hover" cycle hide-delimiter-background>
        <template v-slot:prev="{ props }">
          <v-btn rounded color="#E5EC00" @click="props.onClick"><AnFilledCaretLeft/></v-btn>
        </template>
        <template v-slot:next="{ props }">
          <v-btn rounded color="#E5EC00" @click="props.onClick"><AnFilledCaretRight/></v-btn>
        </template>
        <v-carousel-item v-for="(item, i) in carrouselImgs" :key="i" :src="item.src" cover></v-carousel-item>
      </v-carousel>
    </div>

    <div class="form-container">
      <form>
        <span class="header">
          <img src="../assets/img/utpl_tec_logo_login.png" alt="">
          <h2>Bienvenido!</h2>
          <p>Ingresa al sistema con tus credenciales institucionales.</p>
        </span>

        <input type="email" name="email" id="email" placeholder="Correo institucional">
        <input type="password" name="password" id="password" placeholder="Contraseña">

        <button type="button" @click="redirectToRespectivePanel">INGRESAR</button>

      </form>
    </div>
  </div>
</template>
  
<script lang="ts">
import { AnFilledCaretLeft } from "@kalimahapps/vue-icons";
import { AnFilledCaretRight } from "@kalimahapps/vue-icons";


export default {
  name: 'LoginView',
  components: {
    AnFilledCaretLeft,
    AnFilledCaretRight
  },

  data() {
    return {
      carrouselImgs: [
        {
          src: 'https://scontent.fuio5-1.fna.fbcdn.net/v/t39.30808-6/265101500_118831963953697_866472938105252692_n.png?_nc_cat=108&ccb=1-7&_nc_sid=9267fe&_nc_eui2=AeEgCGSY3Kd73H3OkIsEo-AkakGZGc0oaIJqQZkZzShogne2WTl37lUqu9AAhHaszawaeoqh6VrUEasSqJaA-Bve&_nc_ohc=GzH17RICDNMAX9WW_Yh&_nc_ht=scontent.fuio5-1.fna&oh=00_AfAOAhPCftBaSbBRDGsKfVL2xq58F8mZD2yGb9hm8cyzqw&oe=64A20D86',
        },
        {
          src: 'https://scontent.fuio5-1.fna.fbcdn.net/v/t39.30808-6/258754480_114172914419602_203648656501878620_n.png?_nc_cat=107&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeEpTZ9oqcwoIytcIs9Y1LkfWGn0bJQpAz5YafRslCkDPqyMZcMk0vZHxod4hIGWuwSaRA1rKeO7u9xMDyyxeti6&_nc_ohc=SnHa_lij-hsAX8wA9jB&_nc_ht=scontent.fuio5-1.fna&oh=00_AfD67Wefo0YtHHnUovm5Ty_BoQUr5YaL9sCz0v75PFjPww&oe=64A1D871',
        },
        {
          src: 'https://scontent.fuio5-1.fna.fbcdn.net/v/t39.30808-6/342410694_233788225895895_2525217209677562251_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeEH6KL0yIRj0dLmBiC8W2h9wfaYzj0qOCLB9pjOPSo4Iif51XTdra8FX8-Qgjkb_QL0Tbr2Z4BM5Ey7NDzxONrL&_nc_ohc=Hbu0oDKGsToAX9nRtj2&_nc_ht=scontent.fuio5-1.fna&oh=00_AfBMvXbFU_MZSrcsK6YSbppFbP493kO796BNtRzwwlTYHA&oe=64A13D77',
        },
      ],
    }
  },

  methods: {
    redirectToRespectivePanel() {
      window.location.href = '/student/panel';
    },
  },
}
</script>
  