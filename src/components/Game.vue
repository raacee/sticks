<template>
    <div style="width: 100%; height: 100%;">
        <div v-if="!gameOver">
            <div class="sticks" >
                <div v-for="i in numberOfSticks" class="stick">
                    <Stick />
                    <img alt="cursor" src="../assets/triangle.png" width="60" height="48" v-if="i <= selectedSticks">
                </div>
            </div>
            <div class="cursors">
            </div>
            <div class="commands">
                <button @click="drawSticks">Draw</button>
            </div>
        </div>
        <div v-else style="">
            <div style="display: inline">
                <h1 style="color:rgb(102, 34, 0); text-align:center;">
                    Game is over ! {{ players[player] }} won !
                </h1>
            </div>
            <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
                <button style="font-size:25px" @click="this.$emit('end')"> Go back to main menu</button>
            </div>
        </div>
    </div>
</template>

<script>
import Stick from "./Stick.vue";
import {markRaw} from "vue";

export default {
    name: "App",
    components: {Stick},
    emits: ['end'],
    props: ['mode' , 'firstplayer'],
    data() {
        return {
            players:markRaw(['CPU','You']),
            player:0,
            incrementer:1,
            gameOver:false,
            selectedSticks: 1,
            numberOfSticks: 20,
            winner:""
        }
    },
    computed: {},
    methods: {
        selectSticks(event) {
            if (event.keyCode === 37 && this.selectedSticks > 1) { //left
                this.selectedSticks -= 1;
            } else if (event.keyCode === 39 && this.selectedSticks < 3) {
                this.selectedSticks += 1 //right
            }
        },
        drawSticks() {
            this.numberOfSticks -= this.selectedSticks
            this.selectedSticks = 1
            if (this.numberOfSticks === 1) {
                this.gameOver = true
                return;
            }
            this.player += this.incrementer;
            this.incrementer *= -1
        }
    },
    mounted() {
        document.addEventListener("keydown", this.selectSticks)
        if(this.firstplayer === 1){
            this.player = 1
        }
        else if(this.firstplayer === 0){
            this.player = 0
        }
    }
}

</script>

<style>
img {
    width: 32px;
    height: 32px;
    margin-top: 15px
}

button {
    margin: 20px;
    padding: 40px;
    font-size: 40px;
    color: rgb(200, 100, 0);
    background: rgb(150, 70, 0);
    border: solid 5px;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 9px 9px rgb(102, 34, 0);
}

button:hover {
    margin: 20px;
    padding: 40px;
    font-size: 40px;
    color: rgb(200, 100, 0);
    background: rgb(150, 70, 0);
    border: solid 5px rgb(102, 34, 0);
    border-radius: 50px;
    cursor: pointer
}

button:active {
    transform: translateY(4px);
    box-shadow: 5px 7px rgb(60, 20, 0)
}

.commands {
    display: flex;
    justify-content: center;
}

.sticks {
    display: flex;
    justify-content: center;
}

.stick {
    display: inline-block;
    margin: 20px

}
</style>