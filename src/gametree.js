export class GameTree{
    constructor(numberOfSticks = 20, playerTurn = 0, childNodes = []) {
        this.root = new StateNode(numberOfSticks, playerTurn, childNodes)
        this.generateAllGameStates(this.root)
    }

    generateAllGameStates(stateNode){
        stateNode.populateChildren()

        //needs to search through tree if children of stateNode already exist
        for(const node in stateNode.childNodes){
            const treeNode = this.searchStateNode(node)
            if(treeNode){
                const nodeIndex = stateNode.indexOf(node)
                stateNode.childNodes.splice(nodeIndex,1,treeNode)
            }
        }

        if (stateNode.isLeaf()) return;

        for (const node in stateNode.childNodes){
            this.generateAllGameStates(node)
        }
    }

    searchStateNode(stateNode){ // Breadth first search
        const queue = new Queue() // Open list
        const explored = []
        queue.enqueue(this.root)
        while(queue.length() > 0){
            const current = queue.dequeue()
            if(current.equals(stateNode)){
                return current;
            }
            for(const node in current.childNodes){
                if(!explored.includes(node) && !queue.isQueued(node)){
                    queue.enqueue(node)
                }
            }
            explored.push(current)
        }
    }

}

export class StateNode{
    constructor(numberOfSticks, playerTurn, childNodes = []) {
        this.numberOfSticks = numberOfSticks
        this.playerTurn = playerTurn
        this.childNodes = childNodes
    }

    addChild(stateNode){
        this.childNodes.push(stateNode)
    }

    removeChild(childNode){
        const index = this.childNodes.indexOf(childNode)
        if(index >= 0){
            this.childNodes.splice(index,1)
        }
    }

    populateChildren(){
        if(this.numberOfSticks <= 1){
            this.childNodes = [];
            return;
        }
        for(let i = 0; i < 3; i++){
            const newPlayerTurn = this.playerTurn ? 1 : 0
            this.childNodes.push(new StateNode(
                this.numberOfSticks - i - 1,
                newPlayerTurn,
                [])
            )
        }
    }

    equals(otherStateNode){
        if (this.playerTurn !== otherStateNode.playerTurn
            || this.numberOfSticks !== otherStateNode.numberOfSticks
            || this.childNodes.length !== otherStateNode.childNodes.length) return false;

        const intersection = this.childNodes.filter(element => otherStateNode.childNodes.includes(element));

        return intersection.length === this.childNodes.length;
    }

    isLeaf(){
        return this.childNodes.length === 0
    }

}

class Queue {
    constructor() {
        this.items = []
    }
    enqueue(item) {
        this.items.push(item)
    }
    dequeue() {
        return this.items.shift()
    }
    length(){
        return Object.keys(this.items).length
    }
    isQueued(item){
        return this.items.includes(item)
    }
    peek() {
        return this.items[0]
    }
    get printQueue() {
        return this.items;
    }
}