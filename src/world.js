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
        this.drawGrid()
        this.drawTiles()
        this.drawFoodAndAgent()
        this.drawFrontierAndExplored()
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


}