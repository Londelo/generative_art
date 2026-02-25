// P5 overlay sketch for homepage effects
// Opening animation with splitting squares and particles

let leftSquare;
let rightSquare;
const particles = [];
let animationStarted = false;
let animationStartTime;
let moveSpeed;
let lastSpawnTime = 0;
let totalParticlesSpawned = 0;

const ANIMATION_DURATION = 1500; // 1.5 seconds
const RAMP_UP_TIME = 100; // First 100ms slow spawn
const PHASE1_SPAWN_INTERVAL = 2; // 3ms per particle (~5 per frame per square)
const PHASE2_SPAWN_INTERVAL = 0.5; // 1.5ms per particle (~10 per frame per square)
const CENTER_ZONE_HEIGHT = 200; // 200px tall zone in center for special particles

function setup() {
  const canvas = createCanvas( windowWidth, windowHeight );
  canvas.parent( document.body );
  canvas.id( 'p5-overlay' );

  canvas.style( 'position', 'fixed' );
  canvas.style( 'top', '0' );
  canvas.style( 'left', '0' );
  canvas.style( 'z-index', '5' );
  canvas.style( 'pointer-events', 'none' );

  // Calculate speed to complete in 1.5 seconds
  // Need to move half screen width in 1.5 seconds at 60fps
  moveSpeed = ( width / 2 ) / ( ANIMATION_DURATION / 1000 * 60 );

  // Initialize squares covering each half
  leftSquare = {
    x: 0,
    y: 0,
    w: width / 2,
    h: height,
    active: true
  };

  rightSquare = {
    x: width / 2,
    y: 0,
    w: width / 2,
    h: height,
    active: true
  };

  // Start animation after 500ms
  setTimeout( () => {
    animationStarted = true;
    animationStartTime = millis();
    lastSpawnTime = 0;
  }, 500 );
}

function draw() {
  clear();

  if ( animationStarted ) {
    const elapsed = millis() - animationStartTime;

    // Determine spawn interval based on phase
    let spawnInterval;
    if ( elapsed < RAMP_UP_TIME ) {
      spawnInterval = PHASE1_SPAWN_INTERVAL; // 0.1 sec per particle
    } else {
      spawnInterval = PHASE2_SPAWN_INTERVAL; // 0.05 sec per particle
    }

    // Calculate how many particles should spawn this frame
    const timeSinceLastSpawn = elapsed - lastSpawnTime;
    // Add slight randomness to spawn timing to break patterns
    const jitteredInterval = spawnInterval * random( 0.8, 1.2 );
    const particlesToSpawn = Math.floor( timeSinceLastSpawn / jitteredInterval );

    if ( particlesToSpawn > 0 ) {
      lastSpawnTime += particlesToSpawn * jitteredInterval;

      // Spawn multiple particles per frame
      for ( let i = 0; i < particlesToSpawn; i++ ) {
        if ( leftSquare.active ) {
          const xOffset = random( -20, 20 );
          const yPos = random( height );
          const inCenterZone = yPos > height / 2 - CENTER_ZONE_HEIGHT / 2 && yPos < height / 2 + CENTER_ZONE_HEIGHT / 2;
          const extendedLife = inCenterZone && random() < 0.5 ? random( 200, 1000 ) : 100;
          particles.push( new Particle( leftSquare.x + leftSquare.w + xOffset, yPos, extendedLife ) );
          totalParticlesSpawned++;
        }
        if ( rightSquare.active ) {
          const xOffset = random( -20, 20 );
          const yPos = random( height );
          const inCenterZone = yPos > height / 2 - CENTER_ZONE_HEIGHT / 2 && yPos < height / 2 + CENTER_ZONE_HEIGHT / 2;
          const extendedLife = inCenterZone && random() < 0.5 ? random( 200, 1000 ) : 100;
          particles.push( new Particle( rightSquare.x + xOffset, yPos, extendedLife ) );
          totalParticlesSpawned++;
        }
      }
    }

    // Move squares apart
    if ( leftSquare.active ) {
      leftSquare.x -= moveSpeed;

      // Check if innermost border reached left edge
      if ( leftSquare.x + leftSquare.w <= 0 ) {
        leftSquare.active = false;
        console.log( 'Left square complete. Total particles spawned:', totalParticlesSpawned );
      }
    }

    if ( rightSquare.active ) {
      rightSquare.x += moveSpeed;

      // Check if innermost border reached right edge
      if ( rightSquare.x >= width ) {
        rightSquare.active = false;
        console.log( 'Right square complete. Total particles spawned:', totalParticlesSpawned );
      }
    }

    // Log when animation is complete
    if ( !leftSquare.active && !rightSquare.active ) {
      console.log( 'Animation complete! Final total particles spawned:', totalParticlesSpawned );
      console.log( 'Particles currently alive:', particles.length );
    }
  }

  // Draw squares with pale sky blue border on innermost edge
  noStroke();
  fill( 27, 42, 65 ); // Deep navy background

  if ( leftSquare.active ) {
    rect( leftSquare.x, leftSquare.y, leftSquare.w, leftSquare.h );
    stroke( 216, 237, 245 ); // Pale sky blue
    strokeWeight( 2 );
    line( leftSquare.x + leftSquare.w, 0, leftSquare.x + leftSquare.w, height );
  }

  if ( rightSquare.active ) {
    noStroke();
    rect( rightSquare.x, rightSquare.y, rightSquare.w, rightSquare.h );
    stroke( 216, 237, 245 );
    strokeWeight( 2 );
    line( rightSquare.x, 0, rightSquare.x, height );
  }

  // Update and draw particles
  for ( let i = particles.length - 1; i >= 0; i-- ) {
    particles[i].update();
    particles[i].display();

    if ( particles[i].isDead() ) {
      particles.splice( i, 1 );
    }
  }

  // Draw center zone indicator lines
  stroke( 216, 237, 245, 50 ); // Pale sky blue with low opacity
  strokeWeight( 1 );
  line( 0, height / 2 - CENTER_ZONE_HEIGHT / 2, width, height / 2 - CENTER_ZONE_HEIGHT / 2 );
  line( 0, height / 2 + CENTER_ZONE_HEIGHT / 2, width, height / 2 + CENTER_ZONE_HEIGHT / 2 );
}

class Particle {
  constructor( x, y, flickerTime = 100 ) {
    this.x = x;
    this.y = y;
    this.alpha = 255;
    this.flickerTime = flickerTime; // Variable lifespan, 100ms normal or 200-1000ms for center zone
    this.createdTime = millis();
    this.size = random( 2, 4 );
  }

  update() {
    const elapsed = millis() - this.createdTime;

    if ( elapsed > this.flickerTime ) {
      // Start fading after flicker period
      this.alpha -= 25;
    } else {
      // Flicker effect
      this.alpha = random( 150, 255 );
    }
  }

  display() {
    stroke( 216, 237, 245, this.alpha );
    strokeWeight( this.size );
    point( this.x, this.y );
  }

  isDead() {
    return this.alpha <= 0;
  }
}

function windowResized() {
  resizeCanvas( windowWidth, windowHeight );
}
