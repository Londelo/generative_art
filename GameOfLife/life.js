
function GameOfLife() {
  this.state = {
    cells: [],
    livingLife: true,
    cellSize: 20,
    gridSize: 10,
    lifeSpeed: 2000,
    numOfFirstArrivals: 0
  };

  const createGrid = () => {
    const startingX = 0;
    const startingY = 0;

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
      gridSize,
      cellSize,
      cells
    } = this.state;

    while( gridPosition.y <= gridSize ) {
      const newCell = new Cell( cellIndex, cellSize, { ...position }, { ...gridPosition } );

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

  const spawnCells = ( ) => {
    const theChosenCells = [];
    for ( let index = 0; index < this.state.numOfFirstArrivals; index++ ) {
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


  const conwaysGame = () => {
    // THE RULES
    // Any cell with less than two neighbors dies
    // Any living cell with more than three living neighbors dies
    // Any living cell with two or three living neighbors lives, unchanged, to the next generation
    // Any dead cell with exactly three living neighbors will come to life

    const setLife = ( cell ) => {
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
    };

    if( this.state.livingLife ) {
      for ( let index = 0; index < this.state.cells.length; index++ ) {
        const cell = this.state.cells[index];
        cell.countLivingNeighbors( this.state );
        setLife( cell );
        cell.draw();
      }
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
    spawnCells();
    conwaysGame();
    setInterval( conwaysGame, this.state.lifeSpeed );
  };
}
