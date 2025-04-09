
// eslint-disable-next-line complexity
const getCellsNeighborsIndex = ( { cell, gridSize } ) => {
  const onTopOfGrid = cell.gridPosition.y === 1;
  const onBottomOfGrid = cell.gridPosition.y === gridSize;
  const onLeftOfGrid = cell.gridPosition.x === 1;
  const onRightOfGrid = cell.gridPosition.x === gridSize;

  const right = !onRightOfGrid ? cell.index + 1 : undefined;
  const left = !onLeftOfGrid ? cell.index - 1 : undefined;

  const topMiddle = !onTopOfGrid ? cell.index - gridSize : undefined;
  const topRight = !onTopOfGrid && !onRightOfGrid ? cell.index - gridSize + 1 : undefined;
  const topLeft = !onTopOfGrid && !onLeftOfGrid ? cell.index - gridSize - 1 : undefined;

  const bottomMiddle = !onBottomOfGrid ? cell.index + gridSize : undefined;
  const bottomRight = !onBottomOfGrid && !onRightOfGrid ? cell.index + gridSize + 1 : undefined;
  const bottomLeft = !onBottomOfGrid && !onLeftOfGrid ? cell.index + gridSize - 1 : undefined;

  return [
    left,
    right,
    topMiddle,
    topRight,
    topLeft,
    bottomMiddle,
    bottomLeft,
    bottomRight
  ];
};

const setLivingNeighborsCount = ( { cells, cell, gridSize } ) => {

  const neighborsIndex = getCellsNeighborsIndex( { cell, gridSize } );

  cell.numOfLivingNeighbors = neighborsIndex.reduce( ( numOfLivingNeighbors, index ) => {
    const neighbor = cells[index];
    if( neighbor && neighbor.hasLife ) {
      return numOfLivingNeighbors + 1;
    }

    return numOfLivingNeighbors;
  }, 0 );
};

const setLife = ( cell ) => {
  // THE RULES
  // Any live cell with fewer than two live neighbors dies, as if by under population.
  // Any live cell with two or three live neighbors lives on to the next generation.
  // Any live cell with more than three live neighbors dies, as if by overpopulation.
  // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

  if( cell.hasLife ) {
    if( cell.numOfLivingNeighbors < 2 || cell.numOfLivingNeighbors > 3 ) {
      cell.status = 'just died';
      cell.hasLife = false;
    } else if ( cell.age > 0.1 ) {
      cell.status = 'living';
      cell.age -= 0.1;
    } else if ( cell.age <= 0.1 ) {
      cell.status = 'just died';
      cell.hasLife = false;
      cell.age = 1;
    }
  } else {
    if( cell.numOfLivingNeighbors === 3 ) {
      cell.status = 'born';
      cell.hasLife = true;
      cell.age = 1;
    } else {
      cell.status = 'dead';
    }
  }
};

const setLifeOn = ( cell ) => {
  cell.hasLife = true;
};

const setWatchCell = ( cell ) => {
  cell.watch = true;
};

const drawCell = ( { cell, isTesting } ) => {
  push();

  if( cell.hasLife ) {
    fill( `rgba(0,255,0, ${cell.age})` );
  } else {
    fill( blackColor );
  }

  if( isTesting ) {
    stroke( 'red' );
  }

  square( cell.position.x, cell.position.y, cell.size );
  pop();
};

const isMouseOverCell = ( cell ) => {
  const { position: { x: cellX, y: cellY }, size } = cell;

  const inXRange = mouseX > cellX && mouseX < cellX + size;
  const inYRange = mouseY > cellY && mouseY < cellY + size;

  if( inXRange && inYRange ) {
    return true;
  }

  return false;
};

function createCell( {
  index, size, position, gridPosition, hasLife = false, status
} ) {
  return {
    index,
    position,
    gridPosition,
    size,
    hasLife,
    status,
    numOfLivingNeighbors: 0,
    age: 1,
    watch: false
  };
}
