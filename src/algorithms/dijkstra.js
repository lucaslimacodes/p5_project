class Dijkstra extends Algorithm{
    constructor(grid, startPosition, endPosition){
        super(grid,startPosition,endPosition)
        this.frontier = new PriorityQueue() // queue that stores p5.vectors
        this.frontier.enqueue(startPosition,this.grid[startPosition.x][startPosition.y])
    }
    
    runStep(){
        // check if algorithm has finished
        //console.log(this.frontier.heap.length)
        if(this.status == SUCCESS || this.status == FAILURE){
            return 
        }
        // if the frontier is empty, the search failed
        if(this.frontier.isEmpty()){
            this.status = FAILURE
            return
        }
        let state = this.frontier.dequeue()
        let exploredValue = state.value
        this.explored.push(exploredValue)

        if(exploredValue.equals(this.endPosition)){
            this.status = SUCCESS
            return
        }

        let neighbors = this.getNeighbors(exploredValue)
        
        for(let i=0;i<neighbors.length;i++){
            let newPriority = 0
            if(this.isPositionInFrontier(neighbors[i]) == false && this.wasPositionExplored(neighbors[i]) == false){
                newPriority = state.priority + this.grid[neighbors[i].x][neighbors[i].y]
                this.frontier.enqueue(neighbors[i],newPriority)
                this.cameFrom[neighbors[i]] = exploredValue
            }else if(this.isPositionInFrontier(neighbors[i]) == true && this.wasPositionExplored(neighbors[i]) == false){
                newPriority = state.priority + this.grid[neighbors[i].x][neighbors[i].y]
                if(newPriority < this.frontier.heap[this.findIndexInFrontier(neighbors[i])].priority){
                    this.frontier.enqueue(neighbors[i],newPriority)
                    this.cameFrom[neighbors[i]] = exploredValue
                }
            }
        }

    }

    findIndexInFrontier(position){
        return this.frontier.heap.findIndex(i => i.value.equals(position))
    }

    isPositionInFrontier(position){
        for(let i=0;i<this.frontier.heap.length;i++){
            if(this.frontier.heap[i].value.equals(position)){
                return true
            }
        }
        return false
    }

    reset(startPosition, endPosition, grid){
        super.reset(startPosition, endPosition, grid)
        this.frontier = new PriorityQueue() // queue that stores p5.vectors
        this.frontier.enqueue(startPosition,this.grid[startPosition.x][startPosition.y])
    }
    
    getFrontierArray(){
        let currFrontierArray = this.frontier.heap.map(i => i.value)
        return currFrontierArray
    }


}