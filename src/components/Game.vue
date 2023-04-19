<template>
    <div>
        <div style="width: 100%; height: 100%;">
            <div v-if="!gameOver">
                <div class="sticks">
                    <div v-for="i in numberOfSticks" class="stick">
                        <Stick/>
                        <img alt="cursor" src="../assets/triangle.png" width="60" height="48"
                             v-if="i <= selectedSticks">
                    </div>
                </div>
                <div class="cursors">
                </div>
                <div class="commands">
                    <div v-if="cpuPreviousTurn" style="display: flex; align-items: center">
                        <h3>
                            CPU has removed {{cpuPreviousTurn}} sticks.
                        </h3>
                    </div>
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
    </div>
</template>

<script>
import Stick from "./Stick.vue";
import {markRaw} from "vue";
import {createGameTree} from "../gametree.mjs";

export default {
    name: "App",
    components: {Stick},
    emits: ['end'],
    props: ['firstplayer'],
    data() {
        return {
            initialSticks : 20,
            gameTree: null,
            currentNode: null,
            cpuPreviousTurn : 0,
            players: markRaw(['CPU', 'You']),
            selectedSticks: 1,
            winner: ""
        }
    },
    computed:{
        gameOver(){
            return this.numberOfSticks === 0
        },
        numberOfSticks(){
            if(this.gameTree) {
                return this.currentNode.numberOfSticks
            }
            else{
                return this.initialSticks
            }
        },
        player(){
            if(this.gameTree){
                return this.currentNode.playerTurn
            }
            else{
                return this.firstplayer
            }
        }
    },
    methods: {
        selectSticks(event) {
            if (event.keyCode === 37 && this.selectedSticks > 1) { //left
                this.selectedSticks -= 1;
            } else if (event.keyCode === 39 && this.selectedSticks < 3) {
                this.selectedSticks += 1 //right
            } else if (event.keyCode === 13) {
                this.drawSticks()
            }
        },
        drawSticks() {
            //if there is no game tree, meaning if it's the first play
            const difference =  this.numberOfSticks - this.selectedSticks

            if(!this.gameTree) {
                this.gameTree = markRaw(createGameTree(difference,0,[],5))
                this.currentNode = this.gameTree.root;
            }
            // else if the current node should have children, but it doesn't
            else if(this.currentNode.isLeaf() && !this.currentNode.shouldBeLeaf()){
                this.gameTree.generateAllGameStates(this.currentNode, 5)
            }

            for (const childNode of this.currentNode.childStateNodes) {
                if (childNode.numberOfSticks === difference) {
                    this.currentNode = childNode
                }
            }

            if(this.gameOver){
                return
            }

            this.selectedSticks = 1

            this.cpuPlay()
        },
        cpuPlay(){
            if(this.player === 0){
                const lastNumberOfSticks = this.numberOfSticks.valueOf()
                this.currentNode = this.gameTree.findBestMove(this.currentNode)
                this.cpuPreviousTurn = lastNumberOfSticks - this.currentNode.numberOfSticks
            }
        }
    },
    // a watcher monitors the player value
    // each time player changes, this routine is triggered
    watch:{

    },
    mounted() {
        if(this.firstplayer === 0){
            this.gameTree = createGameTree(this.initialSticks,0,[],5)
            this.currentNode = this.gameTree.root
            this.cpuPlay()
        }
        document.addEventListener("keydown", this.selectSticks)
    },
    unmounted() {
        document.removeEventListener('keydown', this.selectSticks)
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