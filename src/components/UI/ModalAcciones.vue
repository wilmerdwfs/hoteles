<template>
  <div class="modal-manual" v-if="show">
    <div class="modal-manual-content">
      <slot></slot>
      <button class="close" @click="close">x</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style>
.modal-manual {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-manual-content {
  background-color: white;
  padding: 20px;
  width:50%;
  margin:auto;  
  position:relative;
}

.close {
  border-radius:50px; 
  border:none; 
  background-color:none; 
  font-size:30px;
  position:absolute;
  top:0px;
  right:20px;
  background-color:transparent;
}
</style>