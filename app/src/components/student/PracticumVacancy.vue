<template>
  <v-card class="vacancy-section">
    <v-card-title><b>Practicum 2.2</b></v-card-title>
    <v-card-subtitle class="vacancy-section-subtitle"><b>Información de la plaza</b>
      <MdRoundAssignmentInd class="vacancy-info-icon" />
    </v-card-subtitle>

    <v-card-text>
      <v-card class="vacancy-info">

        <v-row>
          <v-col cols="12" md="6" class="info-col">
            <v-subheader><b>Convenio</b></v-subheader>
            <p>1572 - 2022</p>
          </v-col>

          <v-col cols="12" md="6" class="info-col">
            <v-subheader><b>Paralelo</b></v-subheader>
            <p>B</p>
          </v-col>


          <v-col cols="12" md="6" class="info-col">
            <v-subheader><b>Tutor académico</b></v-subheader>
            <p>Jinmy Jose Jaramillo</p>
          </v-col>
          <v-col cols="12" md="6" class="info-col">
            <v-subheader><b>Cargo tutor externo</b></v-subheader>
            <p>Director de proyectos</p>
          </v-col>

          <v-col cols="12" md="6" class="info-col">
            <v-subheader><b>Número tutor externo</b></v-subheader>
            <p>0978948579</p>
          </v-col>

          <v-col cols="12" md="6" class="info-col">
            <v-subheader><b>Correo tutor externo</b></v-subheader>
            <p>nodolab2@electritelecom.com</p>
          </v-col>

          <v-col cols="12" md="6" class="info-col">
            <v-subheader><b>Participantes</b></v-subheader>
            <dl>
              <dt>• Jane Smith (tú)</dt>
              <dt>• Joel Romero</dt>
              <dt>• José Cordova</dt>
            </dl>
          </v-col>

          <v-col cols="12" md="6" class="info-col">
            <v-subheader><b>Hoja de Vida</b></v-subheader>
            <v-file-input prepend-icon="" clearable label="Cargar hoja de vida (CV)" variant="solo-inverted"
              class="CV-input" center-affix="clearIcon" hint="Subir archivo" width="1">
            </v-file-input>
          </v-col>

        </v-row>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import { MdRoundAssignmentInd, McSaveFill } from "@kalimahapps/vue-icons";

export default {
  name: "PracticumInfo",
  components: {
    MdRoundAssignmentInd,
    McSaveFill,
  }
};
</script>

<style scoped>
.vacancy-section {
  background-size: 30% !important;
  background: url('https://formacionpermanente.utpl.edu.ec/sites/default/files/logo%20TEC-01%20%282%29.png');
  background-repeat: no-repeat;
  background-position: right 110%;
  margin: 0 auto;
  min-height: 98vh;
  max-height: 98vh;
  min-width: 100%;
  padding: 20px;
  overflow-y: auto;
}

.vacancy-info {
  padding: 2rem;
  padding-left: 10vh;
  margin: 0 auto;
  background-color: #F4F4F4;
}

.vacancy-section-subtitle {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.vacancy-info-icon {
  margin: 1vh;
  font-size: 1.5rem;
}

.CV-input {
  width: 90%;
}

.CV-input:hover {
  transform: scaleY(1.1);
}

.v-input {
  padding: 0;
  margin: 0;
  margin-top: 1vh;
}

.info-col {
  margin-bottom: 1rem;
}
</style>
