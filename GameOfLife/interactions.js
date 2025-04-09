const onClickGiveLife = ( cells ) => {
  if( !mouseIsPressed ) {
    return;
  }

  cells.forEach( ( cell ) => {
    if( isMouseOverCell( cell ) ) {
      setLifeOn( cell );
      drawCell( { cell } );
    }
  } );
};

const onKeyPause = ( _gameState ) => {
  if( key == 'p' ) {
    _gameState.livingLife = !_gameState.livingLife;
    console.log( 'LIFE STATUS: ', _gameState.livingLife );
  }
};

const onKeyWatchCell = ( cells ) => {
  if( key == 'w' ) {
    cells.forEach( ( cell ) => {
      if( isMouseOverCell( cell ) ) {
        setWatchCell( cell );
        logTestCell( cell );
      }
    } );
  }
};
