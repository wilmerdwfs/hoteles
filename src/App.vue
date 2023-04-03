<template>
  <div id="container">
    <HotelesLista/>
 </div>
</template>

<script>
import HotelesLista from './pages/hoteles/HotelesLista.vue'

export default {
  name: 'App',
  components: {
    HotelesLista
  }
}
</script>

<style>

#container{
  margin:auto;
  width:80%;
}

.boton {
  border: 2px solid #0F3948;
  padding: 0.5rem 3rem;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  color:#1F45C5;
  font-weight:500;
}

.pie-form{
  margin-top:20px;
  padding-top:20px;
  padding-bottom:20px;
}

.boton:hover {
  background-color: #D4DDF9;
}

.scroll{
  padding-bottom:200px;
}
</style>
