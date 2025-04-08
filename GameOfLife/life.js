

// function GameOfLife() {

//   this.onClickLife = () => {
//     if( !mouseIsPressed ) {
//       return;
//     }

//     this.state.cells.forEach( ( cell, index ) => {
//       if( cell.isMouseOverCell() ) {
//         cell.hasLife = true;
//         cell.draw();
//       }
//     } );
//   };

//   this.onKeyPause = () => {
//     if( key == 'p' ) {
//       this.state.livingLife = !this.state.livingLife;
//       console.log( this.state.livingLife );
//     }
//   };

//   this.startLife = () => {
//     createAllCells();
//     spawnCells();
//     draw();
//     setInterval( draw, this.state.lifeSpeed );
//   };
// }
