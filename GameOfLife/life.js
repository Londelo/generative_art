
const defaultGameState = {
  cells: [],
  cellSize: 20,
  framesCounted: 0,
  lifeSpeed: 200,
  livingLife: true
};

function GameOfLife( state = defaultGameState ) {
  this.state = state;

  const findGridSize = ( targetSize, padding ) => {
    const { cellSize } = this.state;
    return Math.floor( targetSize / cellSize ) - padding;
  };

  const createGrid = () => {
    const gridPadding = this.state.cellSize * 1;
    const startingX = gridPadding;
    const startingY = gridPadding;
    const gridHeight = findGridSize( windowHeight, 1 );
    const gridWidth = findGridSize( windowWidth, 2 );

    const position = {
      x: startingX,
      y: startingY
    };
    const gridPosition = {
      x: 1,
      y: 1
    };
    let cellIndex = 0;
    const {
      cellSize,
      cells
    } = this.state;

    while( gridPosition.y <= gridHeight ) {
      const newCell = new Cell( cellIndex, cellSize, { ...position }, { ...gridPosition } );

      cells.push( newCell );

      if( gridPosition.x < gridWidth ) {
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

  const startLife = ( numOfFirstArrivals ) => {
    const theChosenCells = [];
    for ( let index = 0; index < numOfFirstArrivals; index++ ) {
      const randomIndex = Number( random( 0, this.state.cells.length ).toFixed( 0 ) );
      theChosenCells.push( randomIndex );
    }

    this.state.cells.map( ( cell, index ) => {
      // TODO: perhaps instead of creating a list of randodm indexs we could do a coin flip
      if( theChosenCells.includes( index ) ) {
        cell.hasLife = true;
      }
      return cell;
    } );
  };

  const drawCells = () => {
    for ( let index = 0; index < this.state.cells.length; index++ ) {
      this.state.cells[index].draw();
    }
  };

  const lifeHappens = () => {
    // THE RULES
    // Any cell with less than two neighbors dies
    // Any living cell with more than three living neighbors dies
    // Any living cell with two or three living neighbors lives, unchanged, to the next generation
    // Any dead cell with exactly three living neighbors will come to life

    if( this.state.livingLife ) {

      this.state.cells.map( ( cell ) => {
        cell.countLivingNeighbors( this.state );

        if( cell.hasLife ) {
          if( cell.numOfLivingNeighbors < 2 || cell.numOfLivingNeighbors > 3 ) {
            cell.hasLife = false;
          } else if ( cell.age > 0.1 ) {
            cell.age -= 0.1;
            cell.age = cell.age.toFixed( 1 );
          }
        } else {
          if( cell.numOfLivingNeighbors === 3 ) {
            cell.hasLife = true;
            cell.age = 1;
          }
        }

        return cell;
      } );

      drawCells();
    }
  };

  this.onClickLife = () => {
    if( !mouseIsPressed ) {
      return;
    }

    this.state.cells.forEach( ( cell ) => {
      if( cell.isMouseOverCell() ) {
        cell.hasLife = true;
        cell.draw();
      }
    } );
  };

  this.onKeyPause = () => {
    if( key == 'p' ) {
      this.state.livingLife = !this.state.livingLife;
      console.log( this.state.livingLife );
    }
  };

  this.startLife = () => {
    createGrid();
    startLife( 3000 );
    drawCells();
    setInterval( lifeHappens, this.state.lifeSpeed );
  };
}
