
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

const countCellsLivingNeighbors = ( { cells, cell, gridSize } ) => {

  const neighborsIndex = getCellsNeighborsIndex( { cell, gridSize } );

  return neighborsIndex.reduce( ( numOfLivingNeighbors, index ) => {
    const cell = cells[index];
    if( cell && ( cell.hasLife || cell.justDied ) ) {
      return numOfLivingNeighbors + 1;
    }

    return numOfLivingNeighbors;
  }, 0 );
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

function createCell( index, size, position, gridPosition, hasLife = false ) {
  return {
    index,
    position,
    gridPosition,
    size,
    hasLife,
    age: 1
  };
}
