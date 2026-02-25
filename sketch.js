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
let isReversing = false;
let reverseStartTime;

// Audio
let audioContext;
let audioInitialized = false;

const ANIMATION_DURATION = 1500; // 1.5 seconds
const RAMP_UP_TIME = 100; // First 100ms slow spawn
const PHASE1_SPAWN_INTERVAL = 2; // 2ms per particle
const PHASE2_SPAWN_INTERVAL = 0.5; // 0.5ms per particle
const ZONE1_HEIGHT = 100; // 100px zone - 50% chance
const ZONE2_HEIGHT = 300; // 300px zone - 30% chance
const ZONE3_HEIGHT = 500; // 500px zone - 15% chance

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

  // Setup click listener to start animation with audio
  setTimeout( () => {
    canvas.elt.style.pointerEvents = 'auto';
    canvas.elt.addEventListener( 'click', startAnimation, { once: true } );
  }, 100 );
}

function startAnimation() {
  // Reset canvas pointer events
  document.getElementById( 'p5-overlay' ).style.pointerEvents = 'none';

  // Initialize audio
  if ( !audioInitialized ) {
    audioContext = new ( window.AudioContext || window.webkitAudioContext )();
    audioInitialized = true;
  }

  // Start animation after 500ms
  setTimeout( () => {
    animationStarted = true;
    animationStartTime = millis();
    lastSpawnTime = 0;

    // Enable pointer events on HTML content during forward animation
    document.querySelector( 'header' ).style.pointerEvents = 'auto';
    document.querySelector( '.grid' ).style.pointerEvents = 'auto';

    startHummingSound();
  }, 500 );
}

function startHummingSound() {
  if ( !audioContext ) return;

  // Create two oscillators for stereo humming effect
  const leftOsc = audioContext.createOscillator();
  const rightOsc = audioContext.createOscillator();

  // Set oscillator type and frequency with pitch envelope
  leftOsc.type = 'sine';
  rightOsc.type = 'sine';

  // Start high, drop to bass, rise back to high
  leftOsc.frequency.setValueAtTime( 250, audioContext.currentTime );
  rightOsc.frequency.setValueAtTime( 252, audioContext.currentTime );

  // Drop to low bass during fade in
  leftOsc.frequency.exponentialRampToValueAtTime( 80, audioContext.currentTime + 0.3 );
  rightOsc.frequency.exponentialRampToValueAtTime( 82, audioContext.currentTime + 0.3 );

  // Hold bass tone
  leftOsc.frequency.setValueAtTime( 80, audioContext.currentTime + 1.3 );
  rightOsc.frequency.setValueAtTime( 82, audioContext.currentTime + 1.3 );

  // Rise back to high tone during fade out
  leftOsc.frequency.exponentialRampToValueAtTime( 280, audioContext.currentTime + 1.5 );
  rightOsc.frequency.exponentialRampToValueAtTime( 282, audioContext.currentTime + 1.5 );

  // Create gain nodes for volume control
  const leftGain = audioContext.createGain();
  const rightGain = audioContext.createGain();

  // Create stereo panners
  const leftPanner = audioContext.createStereoPanner();
  const rightPanner = audioContext.createStereoPanner();

  // Set initial pan positions
  leftPanner.pan.setValueAtTime( -0.3, audioContext.currentTime );
  rightPanner.pan.setValueAtTime( 0.3, audioContext.currentTime );

  // Volume envelope: fade in, hold, fade out through end of animation
  leftGain.gain.setValueAtTime( 0, audioContext.currentTime );
  rightGain.gain.setValueAtTime( 0, audioContext.currentTime );
  leftGain.gain.linearRampToValueAtTime( 0.15, audioContext.currentTime + 0.3 );
  rightGain.gain.linearRampToValueAtTime( 0.15, audioContext.currentTime + 0.3 );
  leftGain.gain.setValueAtTime( 0.15, audioContext.currentTime + 1.3 ); // Hold until fade out starts
  rightGain.gain.setValueAtTime( 0.15, audioContext.currentTime + 1.3 );
  leftGain.gain.exponentialRampToValueAtTime( 0.001, audioContext.currentTime + 1.5 ); // Fade out through end
  rightGain.gain.exponentialRampToValueAtTime( 0.001, audioContext.currentTime + 1.5 );

  // Pan from center to edges
  leftPanner.pan.linearRampToValueAtTime( -1, audioContext.currentTime + 1.5 );
  rightPanner.pan.linearRampToValueAtTime( 1, audioContext.currentTime + 1.5 );

  // Connect audio graph
  leftOsc.connect( leftGain );
  leftGain.connect( leftPanner );
  leftPanner.connect( audioContext.destination );

  rightOsc.connect( rightGain );
  rightGain.connect( rightPanner );
  rightPanner.connect( audioContext.destination );

  // Start and stop
  leftOsc.start();
  rightOsc.start();
  leftOsc.stop( audioContext.currentTime + 1.6 );
  rightOsc.stop( audioContext.currentTime + 1.6 );
}

// Make function available globally for HTML onclick
window.reverseAnimation = function() {
  // Hide button
  document.getElementById( 'reverse-btn' ).style.display = 'none';

  // Stop forward animation
  animationStarted = false;

  // Reset squares to edges (off screen)
  leftSquare.x = -leftSquare.w;
  leftSquare.y = 0;
  leftSquare.active = true;

  rightSquare.x = width;
  rightSquare.y = 0;
  rightSquare.active = true;

  // Clear particles
  particles.length = 0;

  // Start reverse
  isReversing = true;
  reverseStartTime = millis();

  // Play reverse sound
  startReverseSound();
};

function startReverseSound() {
  if ( !audioContext ) return;

  const leftOsc = audioContext.createOscillator();
  const rightOsc = audioContext.createOscillator();

  leftOsc.type = 'sine';
  rightOsc.type = 'sine';

  // Reverse frequency sweep: high to bass
  leftOsc.frequency.setValueAtTime( 280, audioContext.currentTime );
  rightOsc.frequency.setValueAtTime( 282, audioContext.currentTime );
  leftOsc.frequency.exponentialRampToValueAtTime( 80, audioContext.currentTime + 0.2 );
  rightOsc.frequency.exponentialRampToValueAtTime( 82, audioContext.currentTime + 0.2 );
  leftOsc.frequency.setValueAtTime( 80, audioContext.currentTime + 1.3 );
  rightOsc.frequency.setValueAtTime( 82, audioContext.currentTime + 1.3 );
  leftOsc.frequency.exponentialRampToValueAtTime( 250, audioContext.currentTime + 1.5 );
  rightOsc.frequency.exponentialRampToValueAtTime( 252, audioContext.currentTime + 1.5 );

  const leftGain = audioContext.createGain();
  const rightGain = audioContext.createGain();
  const leftPanner = audioContext.createStereoPanner();
  const rightPanner = audioContext.createStereoPanner();

  // Start panned out, move to center
  leftPanner.pan.setValueAtTime( -1, audioContext.currentTime );
  rightPanner.pan.setValueAtTime( 1, audioContext.currentTime );
  leftPanner.pan.linearRampToValueAtTime( -0.3, audioContext.currentTime + 1.5 );
  rightPanner.pan.linearRampToValueAtTime( 0.3, audioContext.currentTime + 1.5 );

  // Volume fade in, hold, fade out
  leftGain.gain.setValueAtTime( 0, audioContext.currentTime );
  rightGain.gain.setValueAtTime( 0, audioContext.currentTime );
  leftGain.gain.linearRampToValueAtTime( 0.15, audioContext.currentTime + 0.2 );
  rightGain.gain.linearRampToValueAtTime( 0.15, audioContext.currentTime + 0.2 );
  leftGain.gain.setValueAtTime( 0.15, audioContext.currentTime + 1.3 );
  rightGain.gain.setValueAtTime( 0.15, audioContext.currentTime + 1.3 );
  leftGain.gain.exponentialRampToValueAtTime( 0.001, audioContext.currentTime + 1.5 );
  rightGain.gain.exponentialRampToValueAtTime( 0.001, audioContext.currentTime + 1.5 );

  leftOsc.connect( leftGain );
  leftGain.connect( leftPanner );
  leftPanner.connect( audioContext.destination );
  rightOsc.connect( rightGain );
  rightGain.connect( rightPanner );
  rightPanner.connect( audioContext.destination );

  leftOsc.start();
  rightOsc.start();
  leftOsc.stop( audioContext.currentTime + 1.6 );
  rightOsc.stop( audioContext.currentTime + 1.6 );
}

function draw() {
  clear();

  if ( animationStarted && !isReversing ) {
    const elapsed = millis() - animationStartTime;

    // Determine spawn interval based on phase
    let spawnInterval;
    if ( elapsed < RAMP_UP_TIME ) {
      spawnInterval = PHASE1_SPAWN_INTERVAL;
    } else {
      spawnInterval = PHASE2_SPAWN_INTERVAL;
    }

    // Calculate particles to spawn this frame (only during forward animation)
    const timeSinceLastSpawn = elapsed - lastSpawnTime;
    const jitteredInterval = spawnInterval * random( 0.8, 1.2 );
    const particlesToSpawn = Math.floor( timeSinceLastSpawn / jitteredInterval );

    if ( particlesToSpawn > 0 && !isReversing ) {
      lastSpawnTime += particlesToSpawn * jitteredInterval;

      // Spawn particles
      for ( let i = 0; i < particlesToSpawn; i++ ) {
        if ( leftSquare.active ) {
          const xOffset = random( -20, 20 );
          const yPos = random( height );
          const distanceFromCenter = Math.abs( yPos - height / 2 );

          let extendedLife = 100;
          let extendedChance = 0.05;

          if ( distanceFromCenter < ZONE1_HEIGHT / 2 ) {
            extendedChance = 0.5;
          } else if ( distanceFromCenter < ZONE2_HEIGHT / 2 ) {
            extendedChance = 0.3;
          } else if ( distanceFromCenter < ZONE3_HEIGHT / 2 ) {
            extendedChance = 0.15;
          }

          if ( random() < extendedChance ) {
            extendedLife = random( 200, 500 );
          }

          particles.push( new Particle( leftSquare.x + leftSquare.w + xOffset, yPos, extendedLife ) );
          totalParticlesSpawned++;
        }

        if ( rightSquare.active ) {
          const xOffset = random( -20, 20 );
          const yPos = random( height );
          const distanceFromCenter = Math.abs( yPos - height / 2 );

          let extendedLife = 100;
          let extendedChance = 0.05;

          if ( distanceFromCenter < ZONE1_HEIGHT / 2 ) {
            extendedChance = 0.5;
          } else if ( distanceFromCenter < ZONE2_HEIGHT / 2 ) {
            extendedChance = 0.3;
          } else if ( distanceFromCenter < ZONE3_HEIGHT / 2 ) {
            extendedChance = 0.15;
          }

          if ( random() < extendedChance ) {
            extendedLife = random( 200, 500 );
          }

          particles.push( new Particle( rightSquare.x + xOffset, yPos, extendedLife ) );
          totalParticlesSpawned++;
        }
      }
    }

    // Move squares apart
    if ( leftSquare.active ) {
      leftSquare.x -= moveSpeed;
      if ( leftSquare.x + leftSquare.w <= 0 ) {
        leftSquare.active = false;
        console.log( 'Left square complete. Total particles spawned:', totalParticlesSpawned );
      }
    }

    if ( rightSquare.active ) {
      rightSquare.x += moveSpeed;
      if ( rightSquare.x >= width ) {
        rightSquare.active = false;
        console.log( 'Right square complete. Total particles spawned:', totalParticlesSpawned );
      }
    }

    if ( !leftSquare.active && !rightSquare.active ) {
      console.log( 'Animation complete! Final total particles spawned:', totalParticlesSpawned );
      console.log( 'Particles currently alive:', particles.length );

      // Show reverse button
      document.getElementById( 'reverse-btn' ).style.display = 'flex';
    }
  }

  // Handle reverse animation
  if ( isReversing ) {
    const elapsed = millis() - reverseStartTime;

    // Move squares back together
    if ( leftSquare.x < 0 ) {
      leftSquare.x += moveSpeed;
      if ( leftSquare.x >= 0 ) {
        leftSquare.x = 0;
      }
    }

    if ( rightSquare.x > width / 2 ) {
      rightSquare.x -= moveSpeed;
      if ( rightSquare.x <= width / 2 ) {
        rightSquare.x = width / 2;
      }
    }

    // Complete reverse when both reach center
    if ( leftSquare.x >= 0 && rightSquare.x <= width / 2 ) {
      leftSquare.x = 0;
      rightSquare.x = width / 2;
      leftSquare.active = true;
      rightSquare.active = true;
      isReversing = false;

      // Disable pointer events on HTML content
      document.querySelector( 'header' ).style.pointerEvents = 'none';
      document.querySelector( '.grid' ).style.pointerEvents = 'none';

      console.log( 'Reverse animation complete. Squares locked in place.' );
    }
  }

  // Draw squares (always draw if active, during animation or when locked in place)
  noStroke();
  fill( 27, 42, 65 );

  if ( leftSquare.active || isReversing || ( !animationStarted && leftSquare.x >= 0 ) ) {
    rect( leftSquare.x, leftSquare.y, leftSquare.w, leftSquare.h );
    if ( leftSquare.x + leftSquare.w > 0 && leftSquare.x + leftSquare.w < width ) {
      stroke( 216, 237, 245 );
      strokeWeight( 2 );
      line( leftSquare.x + leftSquare.w, 0, leftSquare.x + leftSquare.w, height );
    }
  }

  if ( rightSquare.active || isReversing || ( !animationStarted && rightSquare.x <= width ) ) {
    noStroke();
    rect( rightSquare.x, rightSquare.y, rightSquare.w, rightSquare.h );
    if ( rightSquare.x > 0 && rightSquare.x < width ) {
      stroke( 216, 237, 245 );
      strokeWeight( 2 );
      line( rightSquare.x, 0, rightSquare.x, height );
    }
  }

  // Update and draw particles
  for ( let i = particles.length - 1; i >= 0; i-- ) {
    particles[i].update();
    particles[i].display();

    if ( particles[i].isDead() ) {
      particles.splice( i, 1 );
    }
  }
}

class Particle {
  constructor( x, y, flickerTime = 100 ) {
    this.x = x;
    this.y = y;
    this.alpha = 255;
    this.flickerTime = flickerTime;
    this.createdTime = millis();
    this.size = random( 2, 4 );
  }

  update() {
    const elapsed = millis() - this.createdTime;

    if ( elapsed > this.flickerTime ) {
      this.alpha -= 25;
    } else {
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
