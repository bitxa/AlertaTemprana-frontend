<template>
    <v-alert class="alert" border="start" closable close-label="Close Alert" elevation="2" :type="color" :title="title"
        :content="content">
        {{ content }}
    </v-alert>
</template>


<script lang="ts">

export default {
    name: "Alert",
    props: {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        }
    },
    setup(props) {
        return {
            ...props
        }
    }
}
</script>
  
<style scoped>
.alert {
    position: fixed;
    z-index: 9999;
    top: 2;

}
</style>
  