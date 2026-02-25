// Initial Animation - Gate Opening/Closing System
// Gates split apart with particle effects and spatial audio

const InitialAnimation = (() => {
  // Gate state
  let leftGate;
  let rightGate;
  let gateSpeed;

  // Particle system
  const particles = [];
  let lastSpawnTime = 0;
  let totalParticlesSpawned = 0;

  // Animation state
  let isOpening = false;
  let isClosing = false;
  let openingStartTime;
  let closingStartTime;

  // Audio
  let audioContext;
  let audioInitialized = false;

  // Constants
  const ANIMATION_DURATION = 1500;
  const RAMP_UP_TIME = 100;
  const PHASE1_SPAWN_INTERVAL = 2;
  const PHASE2_SPAWN_INTERVAL = 0.5;
  const ZONE1_HEIGHT = 100;  // 50% chance
  const ZONE2_HEIGHT = 300;  // 30% chance
  const ZONE3_HEIGHT = 500;  // 15% chance

  function setup() {
    const canvas = createCanvas( windowWidth, windowHeight );
    canvas.parent( document.body );
    canvas.id( 'p5-overlay' );
    canvas.style( 'position', 'fixed' );
    canvas.style( 'top', '0' );
    canvas.style( 'left', '0' );
    canvas.style( 'z-index', '5' );
    canvas.style( 'pointer-events', 'auto' );

    gateSpeed = ( width / 2 ) / ( ANIMATION_DURATION / 1000 * 60 );

    initializeGates();
    canvas.elt.addEventListener( 'click', openGates );
  }

  function initializeGates() {
    leftGate = { x: 0, y: 0, w: width / 2, h: height };
    rightGate = { x: width / 2, y: 0, w: width / 2, h: height };
  }

  function canAnimate() {
    return !isOpening && !isClosing;
  }

  function openGates() {
    if ( !canAnimate() ) return;

    document.getElementById( 'p5-overlay' ).style.pointerEvents = 'none';

    if ( !audioInitialized ) {
      audioContext = new ( window.AudioContext || window.webkitAudioContext )();
      audioInitialized = true;
    }

    initializeGates();
    particles.length = 0;
    totalParticlesSpawned = 0;
    document.getElementById( 'close-gate-btn' ).style.display = 'none';

    setTimeout( () => {
      isOpening = true;
      openingStartTime = millis();
      lastSpawnTime = 0;
      enableHTMLContent();
      playGateSound( 'opening' );
    }, 500 );
  }

  window.closeGates = function() {
    if ( !canAnimate() ) return;

    document.getElementById( 'close-gate-btn' ).style.display = 'none';
    isOpening = false;

    leftGate.x = -leftGate.w;
    rightGate.x = width;
    particles.length = 0;

    isClosing = true;
    closingStartTime = millis();
    playGateSound( 'closing' );
  };

  function playGateSound( direction ) {
    if ( !audioContext ) return;

    const isOpening = direction === 'opening';
    const [ leftOsc, rightOsc, leftGain, rightGain, leftPanner, rightPanner ] = createAudioNodes();

    // Frequency sweep
    const startFreq = isOpening ? 250 : 280;
    const midFreq = 80;
    const endFreq = isOpening ? 280 : 250;

    [ leftOsc, rightOsc ].forEach( ( osc, i ) => {
      osc.frequency.setValueAtTime( startFreq + i * 2, audioContext.currentTime );
      osc.frequency.exponentialRampToValueAtTime( midFreq + i * 2, audioContext.currentTime + 0.3 );
      osc.frequency.setValueAtTime( midFreq + i * 2, audioContext.currentTime + 1.3 );
      osc.frequency.exponentialRampToValueAtTime( endFreq + i * 2, audioContext.currentTime + 1.5 );
    });

    // Panning
    const startPan = isOpening ? -0.3 : -1;
    const endPan = isOpening ? -1 : -0.3;
    leftPanner.pan.setValueAtTime( startPan, audioContext.currentTime );
    leftPanner.pan.linearRampToValueAtTime( endPan, audioContext.currentTime + 1.5 );

    rightPanner.pan.setValueAtTime( -startPan, audioContext.currentTime );
    rightPanner.pan.linearRampToValueAtTime( -endPan, audioContext.currentTime + 1.5 );

    // Volume envelope
    [ leftGain, rightGain ].forEach( gain => {
      gain.gain.setValueAtTime( 0, audioContext.currentTime );
      gain.gain.linearRampToValueAtTime( 0.15, audioContext.currentTime + 0.3 );
      gain.gain.setValueAtTime( 0.15, audioContext.currentTime + 1.3 );
      gain.gain.exponentialRampToValueAtTime( 0.001, audioContext.currentTime + 1.5 );
    });

    // Connect and play
    connectAudioNodes( leftOsc, leftGain, leftPanner );
    connectAudioNodes( rightOsc, rightGain, rightPanner );
    [ leftOsc, rightOsc ].forEach( osc => {
      osc.start();
      osc.stop( audioContext.currentTime + 1.6 );
    });
  }

  function createAudioNodes() {
    const leftOsc = audioContext.createOscillator();
    const rightOsc = audioContext.createOscillator();
    leftOsc.type = rightOsc.type = 'sine';

    return [
      leftOsc,
      rightOsc,
      audioContext.createGain(),
      audioContext.createGain(),
      audioContext.createStereoPanner(),
      audioContext.createStereoPanner()
    ];
  }

  function connectAudioNodes( osc, gain, panner ) {
    osc.connect( gain );
    gain.connect( panner );
    panner.connect( audioContext.destination );
  }

  function spawnParticles( elapsed ) {
    const spawnInterval = elapsed < RAMP_UP_TIME ? PHASE1_SPAWN_INTERVAL : PHASE2_SPAWN_INTERVAL;
    const jitteredInterval = spawnInterval * random( 0.8, 1.2 );
    const particlesToSpawn = Math.floor( ( elapsed - lastSpawnTime ) / jitteredInterval );

    if ( particlesToSpawn > 0 ) {
      lastSpawnTime += particlesToSpawn * jitteredInterval;

      for ( let i = 0; i < particlesToSpawn; i++ ) {
        createParticleAtGate( leftGate, leftGate.x + leftGate.w );
        createParticleAtGate( rightGate, rightGate.x );
      }
    }
  }

  function createParticleAtGate( gate, xPos ) {
    const xOffset = random( -20, 20 );
    const yPos = random( height );
    const distanceFromCenter = Math.abs( yPos - height / 2 );

    let extendedChance = 0.05;
    if ( distanceFromCenter < ZONE1_HEIGHT / 2 ) extendedChance = 0.5;
    else if ( distanceFromCenter < ZONE2_HEIGHT / 2 ) extendedChance = 0.3;
    else if ( distanceFromCenter < ZONE3_HEIGHT / 2 ) extendedChance = 0.15;

    const flickerTime = random() < extendedChance ? random( 200, 500 ) : 100;
    particles.push( new Particle( xPos + xOffset, yPos, flickerTime ) );
    totalParticlesSpawned++;
  }

  function updateGatesOpening( elapsed ) {
    leftGate.x -= gateSpeed;
    rightGate.x += gateSpeed;

    if ( leftGate.x + leftGate.w <= 0 && rightGate.x >= width ) {
      isOpening = false;
      document.getElementById( 'close-gate-btn' ).style.display = 'flex';
      console.log( 'Gates opened. Particles spawned:', totalParticlesSpawned );
    }
  }

  function updateGatesClosing() {
    if ( leftGate.x < 0 ) {
      leftGate.x += gateSpeed;
      if ( leftGate.x >= 0 ) leftGate.x = 0;
    }

    if ( rightGate.x > width / 2 ) {
      rightGate.x -= gateSpeed;
      if ( rightGate.x <= width / 2 ) rightGate.x = width / 2;
    }

    if ( leftGate.x >= 0 && rightGate.x <= width / 2 ) {
      isClosing = false;
      disableHTMLContent();
      document.getElementById( 'p5-overlay' ).style.pointerEvents = 'auto';
      console.log( 'Gates closed. Click to reopen.' );
    }
  }

  function enableHTMLContent() {
    document.querySelector( 'header' ).style.pointerEvents = 'auto';
    document.querySelector( '.grid' ).style.pointerEvents = 'auto';
  }

  function disableHTMLContent() {
    document.querySelector( 'header' ).style.pointerEvents = 'none';
    document.querySelector( '.grid' ).style.pointerEvents = 'none';
  }

  function drawGates() {
    noStroke();
    fill( 27, 42, 65 );

    // Draw left gate
    rect( leftGate.x, leftGate.y, leftGate.w, leftGate.h );
    if ( leftGate.x + leftGate.w > 0 && leftGate.x + leftGate.w < width ) {
      stroke( 216, 237, 245 );
      strokeWeight( 2 );
      line( leftGate.x + leftGate.w, 0, leftGate.x + leftGate.w, height );
    }

    // Draw right gate
    noStroke();
    rect( rightGate.x, rightGate.y, rightGate.w, rightGate.h );
    if ( rightGate.x > 0 && rightGate.x < width ) {
      stroke( 216, 237, 245 );
      strokeWeight( 2 );
      line( rightGate.x, 0, rightGate.x, height );
    }
  }

  // Particle class
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
      this.alpha = elapsed > this.flickerTime ? this.alpha - 25 : random( 150, 255 );
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

  function draw() {
    clear();

    // Opening animation
    if ( isOpening ) {
      const elapsed = millis() - openingStartTime;
      spawnParticles( elapsed );
      updateGatesOpening( elapsed );
    }

    // Closing animation
    if ( isClosing ) {
      updateGatesClosing();
    }

    // Draw gates
    drawGates();

    // Update and draw particles
    for ( let i = particles.length - 1; i >= 0; i-- ) {
      particles[i].update();
      particles[i].display();
      if ( particles[i].isDead() ) particles.splice( i, 1 );
    }
  }

  return { setup, draw };
})();

// P5.js lifecycle hooks
function setup() {
  InitialAnimation.setup();
}

function draw() {
  InitialAnimation.draw();
}

function windowResized() {
  resizeCanvas( windowWidth, windowHeight );
}
