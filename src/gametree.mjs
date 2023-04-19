class GameTree {
    constructor(numberOfSticks = 20,
                playerTurn = 0,
                childStateNodes = [],
                maxDepth = -1) {
        this.root = new StateNode(numberOfSticks, playerTurn, childStateNodes)
        this.isComplete = maxDepth <= 0
        if (numberOfSticks >= 18 && maxDepth === -1) maxDepth = 5;
        this.generateAllGameStates(this.root, maxDepth)
        // this.relink()
    }

    minimax(currentStateNode = this.root, useHeuristic = !this.isComplete) {
        // defining whether to use the heuristic evaluation function

        //equivalent to "if useHeuristic parameter is true then use heuristic evaluation function ;
        // else just evaluate the numberOfSticks of a child node
        const evaluationFunction = useHeuristic ?
            this.heuristicNodeEvaluation : (stateNode) => stateNode.playerTurn === 0 ? -1 : 1;


        // Base case: If the game is over (no sticks left)
        // or if the bottom node is reached in case of partially available tree
        if (currentStateNode.isLeaf()) {
            return evaluationFunction(currentStateNode)
        }

        // Maximizing player
        if (currentStateNode.playerTurn === 0) {
            let maxEval = -Infinity;
            for (const childNode of currentStateNode.childStateNodes) {
                if (!childNode.evaluation) {
                    childNode.evaluation = this.minimax(childNode, useHeuristic)
                }
                maxEval = Math.max(maxEval, childNode.evaluation);
            }
            currentStateNode.evaluation = maxEval
            return maxEval;
        } else { // Minimizing player
            let minEval = Infinity;
            for (const childNode of currentStateNode.childStateNodes) {
                if (!childNode.evaluation) {
                    childNode.evaluation = this.minimax(childNode, useHeuristic)
                }
                minEval = Math.min(minEval, childNode.evaluation);
            }
            currentStateNode.evaluation = minEval
            return minEval;
        }
    }

    findWinningPaths(previousNode= this.root){
        if(previousNode.shouldBeLeaf()){
            for (const childNode of previousNode.childStateNodes) {
                if(!previousNode.evaluation) throw new Error("This node has not been evaluated")
                if (childNode.evaluation === 1) {
                    previousNode.winningChildNodes.push(childNode)
                    this.findWinningPaths(childNode)
                }
            }
        }
    }

    // find best move for computer for a given node
    findBestMove(node, useHeuristic = !this.isComplete) {
        let bestMove = null;
        const isMaximizer = node.playerTurn === 0

        if (isMaximizer) { // Maximizing player
            let bestValue = -Infinity;
            for (const childNode of node.childStateNodes) {
                if(!childNode.evaluation){
                    childNode.evaluation = this.minimax(childNode, useHeuristic);
                }
                const evaluation = childNode.evaluation
                if (evaluation > bestValue) {
                    bestValue = evaluation;
                    bestMove = childNode;
                }
            }
            return bestMove;
        }
    }

    // generate every game state recursively
    generateAllGameStates(stateNode, maxDepth = -1, depth = 0) {
        // checks whether a node has the same state
        if (depth === maxDepth || stateNode.shouldBeLeaf()) {
            return
        }

        stateNode.populateChildren()

        if (!stateNode.isLeaf()) {
            for (const node of stateNode.childStateNodes) {
                this.generateAllGameStates(node, maxDepth, depth + 1)
            }
        }
    }

    // performs removing of duplicates child nodes
    // takes time but decrease significantly the number of nodes
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
    findParents(nodeToSearch, currentNode = this.root, resArray = [], explored = []) {
        if (currentNode.childStateNodes.includes(nodeToSearch)) return currentNode
        if (currentNode.isLeaf()) return
        for (const childNode of currentNode.childStateNodes) {
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
    depthSearchStateNode(stateNode) { //Depth first search
        const stack = new Stack()
        const explored = []
        stack.push(this.root)
        while (stack.length() > 0) {
            const current = stack.pop()
            if (current.isSameStateAs(stateNode) && stateNode !== current) { //adding this condition so that the function doesn't return the same node
                return current
            }
            if (!current.isLeaf()) {
                for (const node of current.childStateNodes) {
                    if (!explored.includes(node) || !stack.contains(node)) {
                        stack.push(node)
                    }
                }
            }
            explored.push(current)
        }
    }

    //Kind of work, returns minimum found depth
    //For example, node {numberOfSticks:3,playerTurn:0} is found at depth 2, but we may take 4 turns to get to it.
    getDepth(stateNode, currentNode = this.root, resDepth = 0) {
        const this_ = this
        if (stateNode === currentNode) {
            return resDepth
        } else {
            return Math.min(...currentNode.childStateNodes.map(function (childNode) {
                return this_.getDepth(stateNode, childNode, resDepth + 1)
            }))
        }
    }

    heuristicNodeEvaluation(node) { // CPU has to leave a multiple of 4 sticks + 1 stick (final stick)
        if(node.shouldBeLeaf()){ //if node is leaf node
            if(node.playerTurn === 0) return 1
            else return -1
        }
        if(node.playerTurn === 1 && (node.numberOfSticks - 1) % 4 === 0) return 1
        else if(node.playerTurn === 0 && (node.numberOfSticks -1) % 4 === 0) return -1
        else return 0
    }

    nodeCount() {
        const stack = new Stack()
        const explored = []
        let counter = 0
        stack.push(this.root)

        while (stack.length() > 0) {
            let current = stack.pop()
            if (!explored.includes(current)) {
                counter++
                explored.push(current)
            }
            for (const child of current.childStateNodes) {
                stack.push(child)
            }
        }

        return counter;
    }

}

class StateNode {
    constructor(numberOfSticks, playerTurn, childStateNodes = []) {
        this.numberOfSticks = numberOfSticks
        this.playerTurn = playerTurn
        this.childStateNodes = childStateNodes
        this.winningChildNodes = []
        this.evaluation = null
    }

    addChild(stateNode) {
        this.childStateNodes.push(stateNode)
    }

    removeChild(childNode) {
        const index = this.childStateNodes.indexOf(childNode)
        if (index >= 0) {
            this.childStateNodes.splice(index, 1)
        } else throw new Error("Node is not child of this node")
    }

    populateChildren() {
        if (this.numberOfSticks <= 0) {
            this.childStateNodes = [];
            return;
        }
        for (let i = 0; i < 3; i++) {
            const newPlayerTurn = this.playerTurn === 0 ? 1 : 0
            if(this.numberOfSticks - i - 1 > 0) {
                const newChild = new StateNode(
                    this.numberOfSticks - i - 1,
                    newPlayerTurn,
                    [])
                this.addChild(newChild)
            }
        }
    }

    equalsNode(otherStateNode) {
        if (this.playerTurn !== otherStateNode.playerTurn
            || this.numberOfSticks !== otherStateNode.numberOfSticks
            || (this.isLeaf() ^ otherStateNode.isLeaf()) // if one is leaf and the other is not
        ) return false;

        if (this.isLeaf() && otherStateNode.isLeaf()) return true;

        const intersection = this.childStateNodes.filter(element => {
            otherStateNode.childStateNodes.includes(element)
        });

        return intersection.length === this.childStateNodes.length;
    }

    isSameStateAs(otherStateNode) {
        return this.playerTurn === otherStateNode.playerTurn && this.numberOfSticks === otherStateNode.numberOfSticks
    }

    //I make a distinction between isLeaf and shouldBeLeaf
    //Because the tree is only partially generated, the bottom nodes are going to be leaf nodes with no children
    //However they should have child nodes if their number of sticks allows them
    isLeaf() {
        return this.numberOfSticks <= 0
            || this.childStateNodes === null
            || this.childStateNodes.length === 0
    }

    shouldBeLeaf() {
        return this.numberOfSticks <= 0
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

class Stack {
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

export const createGameTree = function (numberOfSticks = 20,
                                        playerTurn = 0,
                                        childStateNodes = [],
                                        maxDepth = -1) {
    return new GameTree(numberOfSticks, playerTurn, childStateNodes, maxDepth)
}