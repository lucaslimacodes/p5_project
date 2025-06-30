class Greedy extends Algorithm {
    constructor(grid, startPosition, endPosition){
        super(grid,startPosition,endPosition)
        this.frontier = [startPosition] // queue that stores p5.vectors
    }


    runStep(){
        // check if algorithm has finished
        if(this.status == SUCCESS || this.status == FAILURE){
            return 
        }
        // if the frontier is empty, the search failed
        if(this.frontier.length == 0){
            this.status = FAILURE   
            return
        }
        
        let cheapestBlock = null
        let cheapestBlockIndex = null
        let cheapestBlockCost = Infinity

        for(let i = 0; i<this.frontier.length; i++) {
            if(cheapestBlockCost > this.grid[this.frontier[i].x][this.frontier[i].y]) {
                cheapestBlock = this.frontier[i]
                cheapestBlockIndex = i
                cheapestBlockCost = this.grid[this.frontier[i].x][this.frontier[i].y]
            }
        }

        let state = cheapestBlock

        this.frontier.splice(cheapestBlockIndex, 1)
        this.explored.push(state)

        if(state.equals(this.endPosition)){
            this.status = SUCCESS
            return
        }

        let neighbors = this.getNeighbors(state)

        for(let i=0;i<neighbors.length;i++){
            if(this.isPositionInFrontier(neighbors[i]) == false && this.wasPositionExplored(neighbors[i]) == false){
                this.frontier.push(neighbors[i])
                this.cameFrom[neighbors[i]] = state
            }
        }
    }


    isPositionInFrontier(position){
        for(let i=0;i<this.frontier.length;i++){
            if(this.frontier[i].equals(position)){
                return true
            }
        }
        return false
    }

    reset(startPosition, endPosition, grid){
        super.reset(startPosition, endPosition, grid)
        this.frontier = [this.startPosition] 
    }
    
    getFrontierArray(){
        return this.frontier
    }


}