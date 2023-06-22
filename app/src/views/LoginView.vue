
<style scoped src="@/assets/styles/login_styles/login.css"></style>

<template>
    <div class="main">
        <form name="loginForm">
            <span>
                <img src="../assets/img/utpl_tec_logo.png" alt="">
            </span>

            <h3><strong>DATOS DE INGRESO</strong></h3>

            <input type="email" name="username" id="username" placeholder="Usuario">
            <input type="password" name="password" id="password" placeholder="Contraseña">

            <button>INGRESAR</button>

            <a>Ingresa con tus datos institucionales</a>
        </form>
    </div>
</template>

<script lang="ts">
export default {
    name: 'LoginView',
}
</script>