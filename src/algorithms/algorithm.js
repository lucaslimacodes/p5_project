// Algorithm status enumerators
const SUCCESS = 1
const FAILURE = -1
const INPROGRESS = 0


// base class from which all algorithms will inherit
class Algorithm {
    /*
        grid is a nX x nY integer matrix
        startPosition and endPosition are a vectors(created with createVector() function)
    */
    constructor(grid, startPosition, endPosition){
        this.grid = grid // matrix of tiles
        this.startPosition = startPosition 
        this.endPosition = endPosition
        this.cameFrom = new Map() // map to rebuild the path from startPosition to endPosition
        this.explored = [] // array of p5.vectors representing the nodes explored
        // make sure the inherited classes implement the correct data structute for the frontier nodes
        this.status= INPROGRESS // tells when to stop running runStep() function to the user
    }

    // has to be overriden by inherited classes
    runStep(){
        return
    }

    // returns a list of p5.Vector containing all neighbors of a given p5.Vector position
    getNeighbors(position){
        let posX = position.x
        let posY = position.y
        let output = []
        if(posX > 0 && this.grid[posX-1][posY] != OBSTACLE){
            // tile on the left is available
            let vector = createVector(posX-1,posY)
            output.push(vector)
        }
        if(posX < this.grid.length - 1 && this.grid[posX+1][posY] != OBSTACLE){
            // tile to the right is available
            let vector = createVector(posX+1,posY)
            output.push(vector)
        }
        if(posY > 0 && this.grid[posX][posY-1] != OBSTACLE){
            // tile above is available
            let vector = createVector(posX,posY-1)
            output.push(vector)
        }
        if(posY < this.grid[0].length - 1 && this.grid[posX][posY+1] != OBSTACLE){
            // tile below is available
            let vector = createVector(posX,posY+1)
            output.push(vector)
        }

        return output
    }

    // returns a list of p5.vector showing the path built from the start position to end position
    getPath(){
        // if the algorithm hasn't finished or failed, returns a empty list
        if(this.status == FAILURE || this.status == INPROGRESS){
            return []
        }
        let output = [this.endPosition]
        let currPosition = this.cameFrom[this.endPosition]
        while(!currPosition.equals(this.startPosition)){
            output.unshift(currPosition)
            currPosition = this.cameFrom[currPosition]
        }
        output.unshift(this.startPosition)
        return output
    }

    // checks if a p5.vector was explored
    wasPositionExplored(position){
        for(let i=0;i<this.explored.length;i++){
            if(this.explored[i].equals(position)){
                return true
            }
        }
        return false
    }

    // has to be overriden by inherited classes
    isPositionInFrontier(position){
        return
    }

    // has to be called by inherited classes' reset method
    reset(startPosition, endPosition, grid){
        this.startPosition = startPosition
        this.endPosition = endPosition
        this.grid = grid
        this.explored = []
        this.status = INPROGRESS
        this.cameFrom.clear()
    }








}