
let world
const WIDTH = 1440
const HEIGHT = 720
const GRID_SIZE = 40

function setup() {
  createCanvas(WIDTH, HEIGHT);
  world = new World(WIDTH,HEIGHT,GRID_SIZE)
}

function draw() {
  background(255);
  world.draw() // drawing the grid
}
