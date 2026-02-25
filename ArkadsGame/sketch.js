// ARKAD - Keyboard Music Visualizer
// Press keys to create colorful shapes and play musical notes

const visualObjects = [];
let audioSystem;
let startOverlay = true;

function setup() {
  createCanvas( windowWidth, windowHeight );
  background( '#181818' );

  // Initialize audio system
  audioSystem = AudioSystem();
}

function draw() {
  // Semi-transparent background for short trails
  background( 24, 24, 24, 150 );

  // Show start overlay
  if ( startOverlay ) {
    fill( 200 );
    noStroke();
    textAlign( CENTER, CENTER );
    textSize( 32 );
    text( 'Press any key to start', width / 2, height / 2 );
    textSize( 18 );
    text( 'Each keyboard key plays a note and spawns shapes', width / 2, height / 2 + 40 );
    return;
  }

  // Check collisions between gravity shapes
  for ( let idx = 0; idx < visualObjects.length; idx++ ) {
    for ( let jdx = idx + 1; jdx < visualObjects.length; jdx++ ) {
      checkCollision( visualObjects[idx], visualObjects[jdx] );
    }
  }

  // Update and draw all objects
  for ( let idx = visualObjects.length - 1; idx >= 0; idx-- ) {
    const obj = visualObjects[idx];

    obj.update();
    obj.draw();

    // Skip if object is still alive
    if ( !obj.isDead() ) {
      continue;
    }

    // Remove dead object (no death explosion for now)
    visualObjects.splice( idx, 1 );
  }

  // Enforce maximum object limit for performance
  if ( visualObjects.length > 200 ) {
    visualObjects.splice( 0, 50 );
  }
}

function keyPressed() {
  const keyChar = key.toLowerCase();

  // Dismiss start overlay on first keypress and activate audio
  if ( startOverlay ) {
    startOverlay = false;
    getAudioContext().resume();
    // Continue to process the keypress below
  }

  if ( audioSystem.isValidKey( keyChar ) ) {
    // Play audio
    audioSystem.playNote( keyChar );

    // Spawn one visual
    const color = audioSystem.getColorForKey( keyChar );
    const xPos = random( width );
    const yPos = random( height * 0.3, height * 0.7 );
    visualObjects.push( spawnRandomShape( xPos, yPos, color ) );

    return false;
  }

  return true;
}

function keyReleased() {
  return true;
}

function windowResized() {
  resizeCanvas( windowWidth, windowHeight );
}
