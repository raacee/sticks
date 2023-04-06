<template>
    <div style="width: 100%; height: 100%">
        <div style="display: flex; align-content: center; justify-content: center">
            <h1 style="color:rgb(50, 25, 0)">
                Welcome to Sticks
            </h1>
        </div>
        <div style="text-align:center; margin-bottom:10px;">
            <h2>Select first player</h2>
            <form>
                <input type="radio" id="player" name="firstplayer" value="Player" @click="this.firstplayer = 1">
                <label for="player"> Player</label>
                <input type="radio" id="cpu" name="firstplayer" value="CPU" @click="this.firstplayer = 0" checked="checked">
                <label for="cpu"> CPU</label>
            </form>
        </div>
        <div style="display: flex; align-content: center; justify-content: center">
            <button @click="this.$emit('start',this.firstplayer)">
                Start the game
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "Menu",
    emits: ['start'],
    data(){
        return{
            firstplayer:0
        }
    }
}
</script>

<style scoped>
button{
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
</style>