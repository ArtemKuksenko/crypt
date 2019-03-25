<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/pump.gif">
    <Main />
    <!-- <Mobile /> -->
  </div>
</template>

<script>
import Main from './components/Main.vue'
import Mobile from './components/Mobile.vue'

export default {
  name: 'app',
  components: {
    Main,
    Mobile
  }
}
</script>

<style>
  
  body{
    margin: 0 !important; 
  }
  
  #app {
       
   /* display: -webkit-flex; 
    display: inline-flex; 
    flex-direction: column; */
    padding: 0px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
  }

</style>
