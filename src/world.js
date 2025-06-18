// ------------- world constants ----------


// tile weights/enumerators
const OBSTACLE = Infinity
const SAND = 1
const MUD = 5
const WATER = 10

// tiles probability to exist
const OBST_PROB = 0.25
const SAND_PROB = 0.25
const MUD_PROB = 0.25
const WATER_PROB = 0.25

// agent and food enumerators
const AGENT = -1
const FOOD = -2

// ------------- world constants ----------


// frame delay when going through all types of terrain
const SAND_TIME_FRAMES = 10
const MUD_TIME_FRAMES = 20
const WATER_TIME_FRAMES = 30

class World{
    constructor(width,height,gridSize){
        this.width = width
        this.height = height
        this.gridSize = gridSize
        if(gridSize <= 0){
            gridSize = 1 // avoid division by zero
        }
        this.nX = this.width/this.gridSize // number of tiles on X axis
        this.nY = this.height/this.gridSize // number of tiles on Y axis

        this.agentPosition = createVector(floor(random(0,this.nX)), floor(random(0,this.nY))) // random agent position
        this.foodPosition = createVector(floor(random(0,this.nX)), floor(random(0,this.nY))) // random food position


        this.tiles = this.getRandomTilesConfiguration() // generate tiles

        while(true){
            if(this.tiles[this.agentPosition.x][this.agentPosition.y] != OBSTACLE){
                break
            }
            this.agentPosition = createVector(floor(random(0,this.nX)), floor(random(0,this.nY))) // agent can't be inside obstacle
        }
        while(true){
            if(this.tiles[this.foodPosition.x][this.foodPosition.y] != OBSTACLE && !this.foodPosition.equals(this.agentPosition)){
                break
            }
            this.foodPosition = createVector(floor(random(0,this.nX)), floor(random(0,this.nY))) // food can't be neither in obstacle tile nor in agent tile
        }

        // loading image of both agent and food
        this.foodImage = loadImage("./assets/trigo.png")
        this.agentImage = loadImage("./assets/cow.png")
        this.sandImage = loadImage("./assets/sandImage.jpg")
        this.waterImage = loadImage("./assets/waterImage.jpg")
        this.stoneImage = loadImage("./assets/stoneImage.png")
        this.dirtImage = loadImage("./assets/dirtImage.webp")

        // arrays to draw the frontier and the explored tiles
        this.frontier = []
        this.explored = []

        // path from agent position to food position sent by algorithm
        this.path = []

        // variable used to animate agent
        this.frameCounter = 0;
        // variable to control which tile the animation is currently in
        this.pathIndex = 0

    }

    getRandomTilesConfiguration(){
        let tiles = new Array(this.nX).fill(null).map(() => new Array(this.nY).fill(null)); // start an empty nY x nX matrix
        // create intervals between (0,1) based on the probability of each tile
        let obstRange = [0,OBST_PROB]
        let sandRange = [obstRange[1],obstRange[1]+SAND_PROB]
        let mudRange = [sandRange[1], sandRange[1]+MUD_PROB]
        let waterRange = [mudRange[1],1]

        for(let x=0;x<this.nX;x++){
            for(let y=0;y<this.nY;y++){
                let v = random(0,1)
                if(v>=obstRange[0] && v<obstRange[1]){
                    tiles[x][y] = OBSTACLE
                }
                if(v>=sandRange[0] && v<sandRange[1]){
                    tiles[x][y] = SAND
                }
                if(v>=mudRange[0] && v<mudRange[1]){
                    tiles[x][y] = MUD
                }
                if(v>=waterRange[0] && v<waterRange[1]){
                    tiles[x][y] = WATER
                }
            }
        }
        return tiles
    }

    draw(){
        this.drawGrid() // draws vertical an horizontal lines
        this.drawTiles() // draw tiles
        this.drawFoodAndAgent() // draw food and agent
        this.drawFrontierAndExplored() // draws frontier and explored tiles only when algorithm is running
        this.drawPath() // draws path from agentPosition to foodPosition only when the algorithm found a successful route
        if(this.path.length > 0){
            this.runPathAnimation()
        }
    }

    drawGrid(){
        // drawing vertical lines
        for(let i=0;i<this.nX+1;i++){
            line(i*this.gridSize,0,i*this.gridSize,this.height)
        }

        // drawing horizontal lines
        for(let i=0;i<this.nY+1;i++){
            line(0,i*this.gridSize,this.width,i*this.gridSize)
        }
    }

    drawTiles(){
        for(let x=0;x<this.nX;x++){
            for(let y=0;y<this.nY;y++){
                // drawing the edges
                noFill()
                stroke(0)
                strokeWeight(2)
                square(x*this.gridSize, y*this.gridSize, this.gridSize)

                if(this.tiles[x][y] == SAND){
                    image(this.sandImage, x*this.gridSize, y*this.gridSize, this.gridSize,this.gridSize)
                }
                else if(this.tiles[x][y] == WATER){
                    image(this.waterImage, x*this.gridSize, y*this.gridSize, this.gridSize,this.gridSize)
                }
                else if(this.tiles[x][y] == OBSTACLE){
                    image(this.stoneImage, x*this.gridSize, y*this.gridSize, this.gridSize,this.gridSize)
                }
                else if(this.tiles[x][y] == MUD){
                    image(this.dirtImage, x*this.gridSize, y*this.gridSize, this.gridSize,this.gridSize)
                }
            }
        }
    }

    drawFoodAndAgent(){
        image(this.agentImage, this.agentPosition.x*this.gridSize, this.agentPosition.y*this.gridSize, this.gridSize,this.gridSize)
        image(this.foodImage, this.foodPosition.x*this.gridSize, this.foodPosition.y*this.gridSize, this.gridSize,this.gridSize)
    }

    drawFrontierAndExplored(){
        for(let i=0;i<this.explored.length;i++){
            fill(255,0,0,200)
            noStroke()
            square(this.explored[i].x*GRID_SIZE, this.explored[i].y*GRID_SIZE, GRID_SIZE)
        }
        for(let i=0;i<this.frontier.length;i++){
            fill(0,255,0,200)
            noStroke()
            square(this.frontier[i].x*GRID_SIZE, this.frontier[i].y*GRID_SIZE, GRID_SIZE)
        }
    }

    resetAlgorithmArrays(){
        this.frontier = []
        this.explored = []
    }

    // draws the path based on path array
    drawPath(){
        for(let i=0;i<this.path.length-1;i++){
            strokeWeight(5)
            stroke(0,200,0)
            line(this.path[i].x*this.gridSize+this.gridSize/2, this.path[i].y*this.gridSize+this.gridSize/2,this.path[i+1].x*this.gridSize+this.gridSize/2, this.path[i+1].y*this.gridSize+this.gridSize/2)
        }
    }

    // animates the agent path
    runPathAnimation(){
        if(this.agentPosition.equals(this.foodPosition)){
            return
        }

        let currTileDelay = 0
        if(this.tiles[this.agentPosition.x][this.agentPosition.y] == SAND){
            currTileDelay = SAND_TIME_FRAMES
        }
        if(this.tiles[this.agentPosition.x][this.agentPosition.y] == MUD){
            currTileDelay = MUD_TIME_FRAMES
        }
        if(this.tiles[this.agentPosition.x][this.agentPosition.y] == WATER){
            currTileDelay = WATER_TIME_FRAMES
        }
        if(this.frameCounter >= currTileDelay){
            this.pathIndex++;
            this.agentPosition = createVector(this.path[this.pathIndex].x, this.path[this.pathIndex].y)
            this.frameCounter = 0
        }
        this.frameCounter++
    }

    // whenever the agent finishes its animation, this function is called to create a new random food position and reset a few variables
    resetWorldStateToNewFoodPosition(){
        this.resetAlgorithmArrays()
        this.path = []
        this.pathIndex = 0
        this.frameCounter = 0
        while(true){
            this.foodPosition = createVector(floor(random(0,this.nX)), floor(random(0,this.nY)))
            if(this.tiles[this.foodPosition.x][this.foodPosition.y] != OBSTACLE && !this.foodPosition.equals(this.agentPosition)){
                break
            }
        }
    }


}