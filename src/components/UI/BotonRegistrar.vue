<template>
  <button class="boton" @click="showModal">
    {{ etiqueta }}
  </button>
</template>

<script>
export default {
  data(){
     return{ etiqueta:'Registrar'}  
  },
  methods: {
    showModal() {
      this.$emit('showModal', true);
    }
  }
};
</script>
