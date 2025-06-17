
let world
let bfs
const WIDTH = 1440
const HEIGHT = 720
const GRID_SIZE = 40

function setup() {
  createCanvas(WIDTH, HEIGHT);
  world = new World(WIDTH,HEIGHT,GRID_SIZE)
  bfs = new BFS(world.tiles, world.agentPosition, world.foodPosition)
}

function draw() {
  background(255);
  world.draw() // drawing the grid

  // running bfs
  if(bfs.status == INPROGRESS){
    bfs.runStep()
    world.frontier = bfs.frontier
    world.explored = bfs.explored
  }
  else{
    console.log(bfs.getPath())
    world.resetAlgorithmArrays()
    bfs.reset()
  }
}
