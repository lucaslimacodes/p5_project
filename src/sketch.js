
let world
let currAlgorithm
const WIDTH = 1440
const HEIGHT = 720
const GRID_SIZE = 40

// runs currAlgorithm based on world
// this function not only runs the algorithm exploration, but it is also responsible for managing the animation of the agent heading towards the food
function runAlgorithm(){
  if(currAlgorithm.status == INPROGRESS){ // algorithm is trying to find the food while updates the frontier and explored variables to world object 
   currAlgorithm.runStep()
    world.frontier = currAlgorithm.frontier // update frontier array
    world.explored = currAlgorithm.explored // update explored array
  }
  else if(currAlgorithm.status == FAILURE){ // algorithm could not find food, resets world and algorithm
    world = new World(WIDTH,HEIGHT,GRID_SIZE)
    currAlgorithm.reset(world.agentPosition, world.foodPosition, world.tiles)
  }
  else{ // algorithm found a valid path
    world.resetAlgorithmArrays() // stop drawing frontier and explored tiles
    world.path = currAlgorithm.getPath() // start drawing path and animation
    if(world.agentPosition.equals(world.foodPosition)){ // animation end
      world.resetWorldStateToNewFoodPosition() // finds a new food position
      currAlgorithm.reset(world.agentPosition, world.foodPosition, world.tiles) // reset algotithm to run again
    }
  }
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  world = new World(WIDTH,HEIGHT,GRID_SIZE)
  currAlgorithm = new BFS(world.tiles, world.agentPosition, world.foodPosition) // when creating a new algorithm, instantiate it here
}




function draw() {
  background(255);
  world.draw() 
  runAlgorithm() 

}
