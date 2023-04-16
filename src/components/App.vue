<template>
  <div v-if="menu">
      <Menu @start="startListener" />
  </div>
  <div v-else>
      <Game @end="this.menu = true" :firstplayer="this.firstplayer"/>
  </div>
</template>

<script>
import Menu from "./Menu.vue";
import Game from "./Game.vue";

export default {
    name: "App",
    components: {Menu, Game},
    data(){
        return {
            menu : true,
            firstplayer:0
        }
    },
    methods:{
        startListener:function(firstplayer){
            this.firstplayer = firstplayer
            this.menu = false;
        }
    }
}
</script>

<style>
html, body {
    height: 100%;
    margin: 0;
}

</style>