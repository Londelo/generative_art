

let gameOfLife;
const blackColor = '#181818';

const createSketch = () => {
  push();
  createCanvas( windowWidth, windowHeight );
  noStroke();
  // background( blackColor );
  // stroke( 'grey' );
  pop();
};

function setup() {
  createSketch();
  gameOfLife = new GameOfLife();
  gameOfLife.startLife();
}

function draw() {
  gameOfLife.onClickLife();
}

function keyPressed() {
  gameOfLife.onKeyPause();
}

