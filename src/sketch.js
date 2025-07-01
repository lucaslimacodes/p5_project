
let world
let currAlgorithm
let WIDTH
let HEIGHT
const GRID_SIZE = 40

// runs currAlgorithm based on world
// this function not only runs the algorithm exploration, but it is also responsible for managing the animation of the agent heading towards the food
function runAlgorithm(){
  if(currAlgorithm.status == INPROGRESS){ // algorithm is trying to find the food while updates the frontier and explored variables to world object 
   currAlgorithm.runStep()
    world.frontier = currAlgorithm.getFrontierArray()// update frontier array
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
  const nx = document.getElementById("x")
  WIDTH = nx.value*GRID_SIZE
  const ny = document.getElementById("y")
  HEIGHT = ny.value*GRID_SIZE
  let canva = createCanvas(WIDTH, HEIGHT);
  world = new World(WIDTH,HEIGHT,GRID_SIZE)
  const combo = document.getElementById("combo");

  if(combo.value == "BFS") currAlgorithm = new BFS(world.tiles, world.agentPosition, world.foodPosition)
  if(combo.value == "DFS") currAlgorithm = new DFS(world.tiles, world.agentPosition, world.foodPosition)
  if(combo.value == "Dijkstra") currAlgorithm = new Dijkstra(world.tiles, world.agentPosition, world.foodPosition)
  if(combo.value == "A*")currAlgorithm = new Astar(world.tiles, world.agentPosition, world.foodPosition)
  if(combo.value == "Greedy")currAlgorithm = new Greedy(world.tiles, world.agentPosition, world.foodPosition)

  combo.addEventListener("change", () => {
    world = new World(WIDTH,HEIGHT,GRID_SIZE)
    let selected = combo.value;
    if (selected === "BFS") currAlgorithm = new BFS(world.tiles, world.agentPosition, world.foodPosition)
    if(combo.value == "DFS") currAlgorithm = new DFS(world.tiles, world.agentPosition, world.foodPosition)
    if (selected === "Dijkstra") currAlgorithm = new Dijkstra(world.tiles, world.agentPosition, world.foodPosition)
    if (selected === "A*") currAlgorithm = new Astar(world.tiles, world.agentPosition, world.foodPosition) 
    if (selected === "Greedy") currAlgorithm = new Astar(world.tiles, world.agentPosition, world.foodPosition) 
    
    
    // add your algorithms here as well
  });

  nx.addEventListener("change", () => {
    WIDTH = nx.value*GRID_SIZE
    canva.remove()
    canva = createCanvas(WIDTH, HEIGHT);
    world = new World(WIDTH,HEIGHT,GRID_SIZE)
    currAlgorithm.reset(world.agentPosition, world.foodPosition, world.tiles)
  })

  ny.addEventListener("change", () => {
    HEIGHT = ny.value*GRID_SIZE
    canva.remove()
    canva = createCanvas(WIDTH, HEIGHT);
    world = new World(WIDTH,HEIGHT,GRID_SIZE)
    currAlgorithm.reset(world.agentPosition, world.foodPosition, world.tiles)
  })



}




function draw() {
  background(255);
  world.draw() 
  runAlgorithm() 

}
