
export class GameTree {
    constructor(numberOfSticks = 20, playerTurn = 0, childStateNodes = []) {
        this.root = new StateNode(numberOfSticks, playerTurn, childStateNodes)
        this.generateAllGameStates(this.root)
        this.relink()
    }

    generateAllGameStates(stateNode) {
        // checks whether a node has the same state
        stateNode.populateChildren()

        if(!stateNode.isLeaf()) {
            for (const node of stateNode.childStateNodes) {
                this.generateAllGameStates(node)
            }
        }
    }

    relink(currentNode = this.root) {
        if (currentNode.isLeaf()) return;

        for (const childNode of currentNode.childStateNodes) {
            const sameStateNode = this.depthSearchStateNode(childNode);
            if (sameStateNode && childNode !== sameStateNode) {
                const parentNode = currentNode;
                parentNode.removeChild(childNode);
                parentNode.addChild(sameStateNode);
            }
            this.relink(childNode);
        }
    }

    // TODO : Needs work because for now it only returns the first parent it finds (implement backtracking, use stacks ?)
    findParents(nodeToSearch, currentNode = this.root){
        if(currentNode.childStateNodes.includes(nodeToSearch)) return currentNode
        if(currentNode.isLeaf()) return
        for(const childNode of currentNode.childStateNodes) {
            this.findParents(nodeToSearch, childNode)
        }
    }

    breadthSearchStateNode(stateNode) { // Breadth first search
        const queue = new Queue() // Open list
        const explored = [] // Closed list
        queue.enqueue(this.root)
        while (queue.length() > 0) {
            const current = queue.dequeue()
            if (current.isSameStateAs(stateNode) && current !== stateNode) { //adding this condition so that the function doesn't return the same node
                return current;
            }
            if (!current.isLeaf()) {
                for (const node of current.childStateNodes) {
                    if (!explored.includes(node) || !queue.isQueued(node)) {
                        queue.enqueue(node)
                    }
                }
            }
            explored.push(current)
        }
    }

    // depth first search takes three times less time to execute because of the architecture of the tree
    depthSearchStateNode(stateNode){ //Depth first search
        const stack = new Stack()
        const explored = []
        stack.push(this.root)
        while(stack.length() > 0){
            const current = stack.pop()
            if(current.isSameStateAs(stateNode) && stateNode !== current){ //adding this condition so that the function doesn't return the same node
                return current
            }
            if(!current.isLeaf()){
                for(const node of current.childStateNodes){
                    if (!explored.includes(node) || !stack.contains(node)) {
                        stack.push(node)
                    }
                }
            }
            explored.push(current)
        }
    }

    heuristicNodeEvaluation(node){ // CPU has to leave a multiple of 4 sticks + 1 stick (final stick) ; value must be minimized
        return (node.numberOfSticks-1)%4
    }

    nodeCount(currentNode = this.root){
        if(currentNode.isLeaf()) return 1;
        let counter = 0
        for(const node of currentNode.childStateNodes) {
            counter += this.nodeCount(node)
        }
        return 1 + counter
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
        else throw new Error("Node is not child of this node")
    }

    populateChildren() {
        if (this.numberOfSticks <= 1) {
            this.childStateNodes = [];
            return;
        }
        for (let i = 0; i < 3; i++) {
            const newPlayerTurn = this.playerTurn === 0 ? 1 : 0
            const newChild = new StateNode(
                this.numberOfSticks - i - 1,
                newPlayerTurn,
                [])
            this.addChild(newChild)
        }
    }

    equalsNode(otherStateNode) {
        if (this.playerTurn !== otherStateNode.playerTurn
            || this.numberOfSticks !== otherStateNode.numberOfSticks
            || (this.isLeaf() ^ otherStateNode.isLeaf()) // if one is leaf and the other is not
        ) return false;

        if(this.isLeaf() && otherStateNode.isLeaf()) return true;

        const intersection = this.childStateNodes.filter(element => {
            otherStateNode.childStateNodes.includes(element)
        });

        return intersection.length === this.childStateNodes.length;
    }

    isSameStateAs(otherStateNode){
        return this.playerTurn === otherStateNode.playerTurn && this.numberOfSticks === otherStateNode.numberOfSticks
    }

    isLeaf() {
        return this.numberOfSticks <= 1
            || this.childStateNodes === null
            || this.childStateNodes.length === 0
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
}

class Stack{
    constructor() {
        this.items = []
    }

    push(item) {
        this.items.push(item)
    }

    pop() {
        return this.items.pop()
    }

    length() {
        return Object.keys(this.items).length
    }

    contains(item) {
        return this.items.includes(item)
    }

    peek() {
        return this.items[0]
    }
}