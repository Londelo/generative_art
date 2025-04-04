/* eslint-disable max-lines */
/* eslint-disable complexity */
let gameOfLife;
const defaultGameState = {
  cells: [],
  cellSize: 20,
  framesCounted: 0,
  gridSize: 60,
  lifeSpeed: 100,
  livingLife: true
};

function GameOfLife( state = defaultGameState ) {
  this.state = state;

  const createGrid = () => {
    const position = {
      x: 0,
      y: 0
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
        position.x = 0;
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
    background( 'black' );
    for ( let index = 0; index < this.state.cells.length; index++ ) {
      this.state.cells[index].draw();
    }
  };

  const identifyLivingNeighbors = () => {
    this.state.cells.forEach( ( cell ) => {
      cell.countLivingNeighbors( this.state );
    } );
  };

  const lifeHappens = () => {
    // THE RULES
    // Any cell with less than two neighbors dies
    // Any living cell with more than three living neighbors dies
    // Any living cell with two or three living neighbors lives, unchanged, to the next generation
    // Any dead cell with exactly three living neighbors will come to life

    if( this.state.livingLife ) {
      identifyLivingNeighbors();

      this.state.cells.map( ( cell ) => {

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

  this.handleMouseControls = () => {
    this.state.cells.map( ( cell, index ) => {
      if( cell.isMouseOverCell() && mouseIsPressed ) {
        this.test( index );
        cell.hasLife = true;
      }

      return cell;
    } );
  };

  this.test = ( testIndex ) => {

    const cell = this.state.cells[testIndex];
    cell.hasLife = true;
    cell.draw();

    // identifyLivingNeighbors(this.state)

    // cell.arrayOfNeighbors.forEach((cell) => {
    // 	if(cell) {
    // 		cell.draw(true)
    // 	}
    // })
  };

  createGrid();
  startLife( 1000 );
  drawCells();
  setInterval( lifeHappens, this.state.lifeSpeed );
  console.log( 'Living Life', this.state.livingLife );
  console.log( 'Total Cells', this.state.cells.length );
}

function Cell( index, size, position, gridPosition ) {
  this.index = index;
  this.position = position;
  this.gridPosition = gridPosition;
  this.size = size;
  this.hasLife = false;
  this.age = 1;

  this.draw = ( test ) => {
    // stroke(`rgba(0,255,0,1)`)

    if( this.hasLife ) {
      fill( `rgba(0,255,0, ${this.age})` );
    } else {
      fill( 'black' );
    }

    if( test ) {
      stroke( 'red' );
    }

    square( this.position.x, this.position.y, this.size );

    // fill('black')
    // text(this.index, this.position.x, this.position.y + this.size)
  };

  this.countLivingNeighbors = ( {
    cells, gridSize
  } ) => {

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

    const neighborIndexes = [
      left,
      right,
      topMiddle,
      topRight,
      topLeft,
      bottomMiddle,
      bottomLeft,
      bottomRight
    ];

    let numOfLivingNeighbors = 0;

    // console.log('\n -------- \n')
    // console.log(this.index, this.hasLife)
    const arrayOfNeighbors = neighborIndexes.map( ( neighborsIndex ) => {
      const cell = cells[neighborsIndex];
      // console.log(cell)
      if( cell && cell.hasLife ) {
        numOfLivingNeighbors++;
      }

      return cell;
    } );

    // console.log(numOfLivingNeighbors, arrayOfNeighbors)
    // console.log('\n -------- \n')

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

function setup() {

  createCanvas( windowWidth, windowHeight );
  noStroke();

  gameOfLife = new GameOfLife();
}

function draw() {
  gameOfLife.handleMouseControls();
}

function keyPressed() {
  if( key == 'p' ) {
    gameOfLife.state.livingLife = !gameOfLife.state.livingLife;
    console.log( gameOfLife.state.livingLife );
  }
}

