

const gameState = {
  cells: [],
  livingLife: false,
  cellSize: 20,
  gridSize: 10,
  lifeSpeed: 2000,
  numOfFirstArrivals: 0
};

const blackColor = '#181818';

const logTestCell = ( cell ) => {

  if( !cell.watch ) {
    return;
  }
  const { index, status, numOfLivingNeighbors } = cell;
  console.log( 'WATCHING', { index, status, numOfLivingNeighbors } );
  drawCell( { cell, isTesting: true } );
};

const createSketch = () => {
  push();
  createCanvas( windowWidth, windowHeight );
  // noStroke();
  // background( blackColor );
  stroke( 'grey' );
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
    const newCell = new createCell( {
      index: cellIndex, size: cellSize, hasLife,
      position: { ...position },
      gridPosition: { ...gridPosition }
    } );

    cells.push( newCell );

    drawCell( { cell: newCell } );

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

const conwaysGame = () => {
  const { livingLife, cells, gridSize } = gameState;
  if( livingLife ) {
    console.log( 'Life is Happening' );
    for ( let index = 0; index < cells.length; index++ ) {
      const cell = cells[index];
      setLivingNeighborsCount( { cells, cell, gridSize } );
    }

    for ( let index = 0; index < cells.length; index++ ) {
      const cell = cells[index];
      setLife( cell );
      drawCell( { cell } );
      logTestCell( cell );
    }
  }
};

function setup() {
  createSketch();
  createCells();
  setInterval( conwaysGame, gameState.lifeSpeed );
  console.log( 'LIFE STATUS: ', gameState.livingLife );
}

function draw() {
  const { cells } = gameState;
  onClickGiveLife( cells );
}

function keyPressed() {
  const { cells } = gameState;

  onKeyPause( gameState );
  onKeyWatchCell( cells );
}

