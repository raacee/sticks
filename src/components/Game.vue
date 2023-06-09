<template>
    <div>
        <div style="width: 100%; height: 100%;">
            <div v-if="!gameOver"> <!-- v-if directive allows to render an element only if the expression returns true -->
                <div class="sticks">
                    <div v-for="i in numberOfSticks" class="stick"> <!-- v-for allows to repeat the rendering of an element -->
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
    //computed properties are special types of properties
    //A computed property depends on other normal properties and is updated every time its depedencies change
    computed:{
        gameOver(){ //for exemple, gameOver will be updated every time numberOfSticks change
            return this.numberOfSticks === 0
        },
        numberOfSticks(){ // and numberOfSticks will update every time gameTree, or currentNode or initialSticks change
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
        selectSticks(event) { //listens to keystrokes to add or remove a selected stick
            if (event.keyCode === 37 && this.selectedSticks > 1) { //left
                this.selectedSticks -= 1;
            } else if (event.keyCode === 39 && this.selectedSticks < 3) {
                this.selectedSticks += 1 //right
            } else if (event.keyCode === 13) {
                this.drawSticks()
            }
        },
        drawSticks() { // main event of the game ; alows player to remove a stick and the computer to play right after
            const difference =  this.numberOfSticks - this.selectedSticks

            //if there is no game tree, meaning if it's the first play
            if(!this.gameTree) {
                this.gameTree = markRaw(createGameTree(difference,0,[],5))
                this.currentNode = this.gameTree.root;
                this.gameTree.minimax(this.currentNode)
            }
            //if the current node should have children, but it doesn't
            //(meaning if we got to a bottom node of the partially generated tree)
            if(this.currentNode.isLeaf() && !this.currentNode.shouldBeLeaf()){
                this.gameTree.generateAllGameStates(this.currentNode, 5)
                this.gameTree.minimax(this.currentNode, true)
            }


            for (const childNode of this.currentNode.childStateNodes) {
                if (childNode.numberOfSticks === difference) {
                    this.currentNode = childNode
                }
            }

            //if the game is over after the player has played
            if(this.gameOver){
                return
            }

            this.selectedSticks = 1

            this.cpuPlay()

            console.log(this.currentNode.numberOfSticks, this.currentNode.evaluation, this.currentNode.childStateNodes)

            //because gameOver is a computed property it runs every time currentNode changes
            //This means that when cpuPlays returns, currentNode will have changed and the game will be over
        },
        cpuPlay(){
            if(this.player === 0){
                const lastNumberOfSticks = this.numberOfSticks.valueOf()
                this.currentNode = this.gameTree.findBestMove(this.currentNode)
                this.cpuPreviousTurn = lastNumberOfSticks - this.currentNode.numberOfSticks
            }
        }
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