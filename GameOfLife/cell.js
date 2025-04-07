
function Cell( index, size, position, gridPosition ) {
  this.index = index;
  this.position = position;
  this.gridPosition = gridPosition;
  this.size = size;
  this.hasLife = false;
  this.age = 1;

  this.draw = ( test ) => {
    push();

    if( this.hasLife ) {
      fill( `rgba(0,255,0, ${this.age})` );
    } else {
      fill( blackColor );
    }

    if( test ) {
      stroke( 'red' );
    }

    square( this.position.x, this.position.y, this.size );
    pop();
  };

  // eslint-disable-next-line complexity
  const getNeighborsIndex = ( gridSize ) => {
    const onTopOfGrid = this.gridPosition.y === 1;
    const onBottomOfGrid = this.gridPosition.y === gridSize;
    const onLeftOfGrid = this.gridPosition.x === 1;
    const onRightOfGrid = this.gridPosition.x === gridSize;

    const right = !onRightOfGrid ? this.index + 1 : undefined;
    const left = !onLeftOfGrid ? this.index - 1 : undefined;

    const topMiddle = !onTopOfGrid ? this.index - gridSize : undefined;
    const topRight = !onTopOfGrid && !onRightOfGrid ? this.index - gridSize + 1 : undefined;
    const topLeft = !onTopOfGrid && !onLeftOfGrid ? this.index - gridSize - 1 : undefined;

    const bottomMiddle = !onBottomOfGrid ? this.index + gridSize : undefined;
    const bottomRight = !onBottomOfGrid && !onRightOfGrid ? this.index + gridSize + 1 : undefined;
    const bottomLeft = !onBottomOfGrid && !onLeftOfGrid ? this.index + gridSize - 1 : undefined;

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

  this.countLivingNeighbors = ( {
    cells, gridSize
  } ) => {

    const neighborsIndex = getNeighborsIndex( gridSize );

    let numOfLivingNeighbors = 0;

    const arrayOfNeighbors = neighborsIndex.map( ( index ) => {
      const cell = cells[index];
      if( cell && cell.hasLife ) {
        numOfLivingNeighbors++;
      }

      return cell;
    } );

    this.numOfLivingNeighbors = numOfLivingNeighbors;
    this.arrayOfNeighbors = arrayOfNeighbors;
  };

  this.isMouseOverCell = () => {
    const {
      position: {
        x: cellX,
        y: cellY
      },
      size
    } = this;

    const inXRange = mouseX > cellX && mouseX < cellX + size;
    const inYRange = mouseY > cellY && mouseY < cellY + size;

    if( inXRange && inYRange ) {
      return true;
    }

    return false;
  };
}
