

const gameState = {
  cells: [],
  livingLife: true,
  cellSize: 20,
  gridSize: 10,
  lifeSpeed: 2000,
  numOfFirstArrivals: 0
};

const blackColor = '#181818';

const createSketch = () => {
  push();
  createCanvas( windowWidth, windowHeight );
  noStroke();
  // background( blackColor );
  // stroke( 'grey' );
  pop();
};

const selectTheChosenCells = () => {
  const { gridSize, numOfFirstArrivals } = gameState;
  const totalCells = gridSize * gridSize;
  const theChosenCells = [];

  for ( let index = 0; index < numOfFirstArrivals; index++ ) {
    const randomIndex = Number( random( 0, totalCells ).toFixed( 0 ) );
    theChosenCells.push( randomIndex );
  }
  return theChosenCells;
};

const createCells = () => {
  const { gridSize, cellSize, cells } = gameState;

  const startingX = 0;
  const startingY = 0;
  const position = { x: startingX, y: startingY };
  const gridPosition = { x: 1, y: 1 };
  const theChosenCells = selectTheChosenCells();
  let cellIndex = 0;

  while( gridPosition.y <= gridSize ) {
    const hasLife = !!theChosenCells[cellIndex];
    const newCell = new createCell( cellIndex, cellSize, hasLife, { ...position }, { ...gridPosition } );

    cells.push( newCell );

    if( gridPosition.x < gridSize ) {
      position.x += cellSize;
      gridPosition.x ++;
    } else {
      position.y += cellSize;
      position.x = startingX;
      gridPosition.y ++;
      gridPosition.x = 1;
    }

    cellIndex ++;
  }
};

const conwaysGame = ( { cell, cells, gridSize } ) => {
  // THE RULES
  // Any live cell with fewer than two live neighbors dies, as if by under population.
  // Any live cell with two or three live neighbors lives on to the next generation.
  // Any live cell with more than three live neighbors dies, as if by overpopulation.
  // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.


  // TODO: the big problem here is i need to count all the living neighbors before changing the living state,
  // but id live to one have one for loop here.
  const numOfLivingNeighbors = countCellsLivingNeighbors( { cells, cell, gridSize } );
  if( cell.hasLife ) {
    if( numOfLivingNeighbors < 2 || numOfLivingNeighbors > 3 ) {
      console.log( numOfLivingNeighbors, 'just died' );
      cell.justDied = true; // Maybe this is the solution
      cell.hasLife = false;
    } else if ( cell.age > 0.1 ) {
      console.log( numOfLivingNeighbors, 'aged' );
      cell.age -= 0.1;
      cell.age = cell.age.toFixed( 1 );
    }
  } else {
    if( numOfLivingNeighbors === 3 ) {
      console.log( numOfLivingNeighbors, 'born' );
      cell.hasLife = true;
      cell.age = 1;
    }
  }
};

const playTheGame = () => {
  const { livingLife, cells, gridSize } = gameState;
  console.log( 'draw start' );
  if( livingLife ) {
    for ( let index = 0; index < cells.length; index++ ) {
      const cell = cells[index];
      conwaysGame( { cell, cells, gridSize } );
      drawCell( { cell } );
    }
  }
  console.log( 'draw end' );
};

function setup() {
  createSketch();
  createCells();
  playTheGame();
  setInterval( playTheGame, gameState.lifeSpeed );
}

function draw() {
  // gameOfLife.onClickLife();
}

function keyPressed() {
  // gameOfLife.onKeyPause();
}

