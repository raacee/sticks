// import {writeFileSync} from 'fs'

export class Gametree {
    constructor(numberOfSticks = 20, playerTurn = 0, childStateNodes = []) {
        this.root = new StateNode(numberOfSticks, playerTurn, childStateNodes)
        this.generateAllGameStates(this.root)
        this.toJSON()
    }

    generateAllGameStates(stateNode) {
        stateNode.populateChildren()

        if (stateNode.isLeaf()) return;

        //needs to search through tree if children of stateNode already exist
        for (let i = 0; i < 3; i++) {
            const node = stateNode.childStateNodes[i]
            const treeNode = this.searchStateNode(node)
            if (treeNode) {
                const nodeIndex = stateNode.childStateNodes.indexOf(node)
                stateNode.childStateNodes.splice(nodeIndex, 1, treeNode)
            }
        }

        for (let i = 0; i < 3; i++) {
            const node = stateNode.childStateNodes[i]
            this.generateAllGameStates(node)
        }

    }

    searchStateNode(stateNode) { // Breadth first search
        const queue = new Queue() // Open list
        const explored = [] // Closed list
        queue.enqueue(this.root)
        while (queue.length() > 0) {
            const current = queue.dequeue()
            console.log(current)
            if (current.equals(stateNode)) {
                return current;
            }
            if (!current.isLeaf()) {
                for (let i = 0; i < current.childStateNodes.length; i++) {
                    const node = current.childStateNodes[i]
                    if (!explored.includes(node) && !queue.isQueued(node)) {
                        queue.enqueue(node)
                    }
                }
            }
            explored.push(current)
        }
    }

    toJSON() {
        const jsonStr = JSON.stringify(this)
        // writeFileSync("../data/gametree.json",jsonStr)
        // console.log(jsonStr)
    }

}

export class StateNode {
    constructor(numberOfSticks, playerTurn, childStateNodes = []) {
        this.numberOfSticks = numberOfSticks
        this.playerTurn = playerTurn
        this.childStateNodes = childStateNodes
    }

    addChild(stateNode) {
        this.childStateNodes.push(stateNode)
    }

    removeChild(childNode) {
        const index = this.childStateNodes.indexOf(childNode)
        if (index >= 0) {
            this.childStateNodes.splice(index, 1)
        }
    }

    populateChildren() {
        if (this.numberOfSticks <= 1) {
            this.childStateNodes = [];
            return;
        }
        for (let i = 0; i < 3; i++) {
            const newPlayerTurn = this.playerTurn === 0 ? 1 : 0
            this.childStateNodes.push(new StateNode(
                this.numberOfSticks - i - 1,
                newPlayerTurn,
                [])
            )
        }
    }

    equals(otherStateNode) {
        if (this.playerTurn !== otherStateNode.playerTurn
            || this.numberOfSticks !== otherStateNode.numberOfSticks
            || this.childStateNodes.length !== otherStateNode.childStateNodes.length) return false;

        const intersection = this.childStateNodes.filter(element => {
            otherStateNode.childStateNodes.includes(element)
        });

        return intersection.length === this.childStateNodes.length;
    }

    isLeaf() {
        return this.childStateNodes.length === 0 || this.numberOfSticks <= 1
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

    length() {
        return Object.keys(this.items).length
    }

    isQueued(item) {
        return this.items.includes(item)
    }

    peek() {
        return this.items[0]
    }

    get printQueue() {
        return this.items;
    }
}