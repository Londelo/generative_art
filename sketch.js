// Background Display - Interactive dot grid with cursor repulsion and physics squares
const BackgroundDisplay = (() => {
  const dots = [];
  const squares = [];
  const DOT_SIZE = 2;
  const DOT_SPACING = 15;
  const DOT_COLOR = [191, 130, 117]; // Dusty rose #BF8275
  const CURSOR_RADIUS = 25; // Radius of cursor circle
  const BUFFER_ZONE = 15; // Extra space around circle where dots shouldn't enter
  const REPEL_RADIUS = 90; // Distance at which dots start repelling
  const REPEL_STRENGTH = 1.5; // How strongly dots repel
  const SPRING_STRENGTH = 0.15; // How strongly dots return to home
  const DAMPING = 0.85; // Velocity damping for smooth motion

  // Shelf and physics constants
  const SQUARE_SIZE = 20;
  const GRAVITY = 0.5;
  const BOUNCE = 0.3;
  const FRICTION = 0.98;
  const RESET_DELAY = 10000; // 10 seconds in milliseconds
  const RETURN_SPEED = 0.1; // How fast squares return home
  let shelfY = 0;
  let shelfLeft = 0;
  let shelfRight = 0;

  let p;
  let mouseX = 0;
  let mouseY = 0;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let mouseVX = 0;
  let mouseVY = 0;

  // Square class for physics objects
  class Square {
    constructor( x, y ) {
      this.homeX = x;
      this.homeY = y;
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.size = SQUARE_SIZE;
      this.activated = false;
      this.returningHome = false;
      this.lastTouchTime = 0;
    }

    checkCollision( mx, my, mvx, mvy ) {
      // Check collision between cursor circle and square
      const dx = this.x - mx;
      const dy = this.y - my;
      const dist = Math.sqrt( dx * dx + dy * dy );

      // Collision radius: cursor radius + half square size
      const collisionRadius = CURSOR_RADIUS + this.size / 2;

      if ( dist < collisionRadius && dist > 0 ) {
        // Enable physics for THIS square when touched
        if ( !this.activated ) {
          this.activated = true;
        }
        this.lastTouchTime = p.millis();
        this.returningHome = false;

        // Calculate cursor speed and apply momentum transfer
        const cursorSpeed = Math.sqrt( mvx * mvx + mvy * mvy );
        const momentumMultiplier = 0.3; // Reduced from 0.8 - makes blocks heavier

        // Apply cursor velocity to square with momentum transfer
        this.vx += mvx * momentumMultiplier;
        this.vy += mvy * momentumMultiplier;

        // Push square out of collision overlap
        const overlap = collisionRadius - dist;
        if ( overlap > 0 ) {
          const pushX = ( dx / dist ) * overlap;
          const pushY = ( dy / dist ) * overlap;
          this.x += pushX;
          this.y += pushY;

          // Add small impulse based on collision normal
          const impulseStrength = Math.max( cursorSpeed * 0.15, 1.0 ); // Reduced from 0.3 and 2.0
          this.vx += ( dx / dist ) * impulseStrength;
          this.vy += ( dy / dist ) * impulseStrength;
        }
      }
    }

    update() {
      // Check if THIS square should return home (only if it was activated)
      if ( this.activated && !this.returningHome && p.millis() - this.lastTouchTime > RESET_DELAY ) {
        this.returningHome = true;
        // Clear velocity when starting return journey
        this.vx = 0;
        this.vy = 0;
      }

      if ( this.returningHome ) {
        // Smoothly return to home position
        const dx = this.homeX - this.x;
        const dy = this.homeY - this.y;
        const dist = Math.sqrt( dx * dx + dy * dy );

        if ( dist < 1 ) {
          // Snap to home position
          this.x = this.homeX;
          this.y = this.homeY;
          this.vx = 0;
          this.vy = 0;
          this.activated = false;
          this.returningHome = false;
        } else {
          // Move directly towards home (no physics, just interpolation)
          const returnSpeed = 0.08;
          this.x += dx * returnSpeed;
          this.y += dy * returnSpeed;
        }

        return;
      }

      // Only apply physics if THIS square is activated
      if ( !this.activated ) return;

      // Apply gravity
      this.vy += GRAVITY;

      // Apply velocity
      this.x += this.vx;
      this.y += this.vy;

      // Apply friction
      this.vx *= FRICTION;

      // Collision with shelf (only if within shelf boundaries)
      const isOnShelf = this.x > shelfLeft && this.x < shelfRight;
      if ( isOnShelf && this.y + this.size / 2 > shelfY ) {
        this.y = shelfY - this.size / 2;
        this.vy *= -BOUNCE;
        if ( Math.abs( this.vy ) < 0.5 ) this.vy = 0;
      }

      // Keep on screen horizontally (side walls)
      if ( this.x - this.size / 2 < 0 ) {
        this.x = this.size / 2;
        this.vx *= -BOUNCE;
      }
      if ( this.x + this.size / 2 > p.width ) {
        this.x = p.width - this.size / 2;
        this.vx *= -BOUNCE;
      }

      // Let squares fall off bottom if not on shelf
      if ( this.y - this.size / 2 > p.height ) {
        // Square fell off screen
        this.y = p.height + this.size;
      }
    }

    display( p5Instance ) {
      p5Instance.fill( 38, 38, 38 );
      p5Instance.noStroke();
      p5Instance.rect( this.x - this.size / 2, this.y - this.size / 2, this.size, this.size );
    }
  }

  function setup( p5Instance ) {
    p = p5Instance;

    // Initialize mouse tracking
    mouseX = p.mouseX;
    mouseY = p.mouseY;
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseVX = 0;
    mouseVY = 0;

    // Calculate shelf position (20% from top, aligned with container top)
    shelfY = p.height * 0.2;

    // Calculate shelf boundaries (60% width, centered - same as app container)
    const containerWidth = p.width * 0.6;
    shelfLeft = ( p.width - containerWidth ) / 2;
    shelfRight = shelfLeft + containerWidth;

    generateDots();
    generateArtSquares();
  }

  function generateArtSquares() {
    squares.length = 0;

    // Pixel patterns for letters (1 = square, 0 = empty)
    const letterG = [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0]
    ];

    const letterE = [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1]
    ];

    const letterN = [
      [1, 0, 0, 0, 1],
      [1, 1, 0, 0, 1],
      [1, 1, 0, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 0, 1, 1],
      [1, 0, 0, 1, 1],
      [1, 0, 0, 0, 1]
    ];

    const letterR = [
      [1, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 0],
      [1, 0, 1, 0, 0],
      [1, 0, 0, 1, 0],
      [1, 0, 0, 0, 1]
    ];

    const letterA = [
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1]
    ];

    const letterT = [
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0]
    ];

    const letterI = [
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1]
    ];

    const letterV = [
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0]
    ];

    // Layout: "GENERATIVE ART"
    const letters = [letterG, letterE, letterN, letterE, letterR, letterA, letterT, letterI, letterV, letterE, letterA, letterR, letterT];
    const letterSpacing = SQUARE_SIZE * 1.5;
    const wordSpacing = SQUARE_SIZE * 6; // Extra space between words

    // Calculate total width (10 letters + 9 letter spacings + 1 word spacing)
    const generativeWidth = ( 5 * SQUARE_SIZE * 10 ) + ( letterSpacing * 9 );
    const artWidth = ( 5 * SQUARE_SIZE * 3 ) + ( letterSpacing * 2 );
    const totalWidth = generativeWidth + wordSpacing + artWidth;
    const startX = ( p.width - totalWidth ) / 2;

    // Position letters on top of the shelf (2 squares higher than original)
    const startY = shelfY - ( 9 * SQUARE_SIZE );

    // Generate squares for "GENERATIVE"
    let currentX = startX;
    for ( let i = 0; i < 10; i++ ) {
      generateLetterSquares( letters[i], currentX, startY );
      currentX += ( 5 * SQUARE_SIZE ) + letterSpacing;
    }

    // Add word spacing
    currentX += wordSpacing - letterSpacing;

    // Generate squares for "ART"
    for ( let i = 10; i < 13; i++ ) {
      generateLetterSquares( letters[i], currentX, startY );
      currentX += ( 5 * SQUARE_SIZE ) + letterSpacing;
    }
  }

  function generateLetterSquares( pattern, offsetX, offsetY ) {
    for ( let row = 0; row < pattern.length; row++ ) {
      for ( let col = 0; col < pattern[row].length; col++ ) {
        if ( pattern[row][col] === 1 ) {
          const x = offsetX + ( col * SQUARE_SIZE ) + SQUARE_SIZE / 2;
          const y = offsetY + ( row * SQUARE_SIZE ) + SQUARE_SIZE / 2;
          squares.push( new Square( x, y ) );
        }
      }
    }
  }

  function generateDots() {
    if ( !p ) return;

    dots.length = 0;

    for ( let x = DOT_SPACING; x < p.width; x += DOT_SPACING ) {
      for ( let y = DOT_SPACING; y < p.height; y += DOT_SPACING ) {
        dots.push( {
          homeX: x,
          homeY: y,
          x: x,
          y: y,
          vx: 0,
          vy: 0
        } );
      }
    }
  }

  function updateDots( p5Instance ) {
    // Update mouse position and calculate velocity
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = p5Instance.mouseX;
    mouseY = p5Instance.mouseY;
    mouseVX = mouseX - prevMouseX;
    mouseVY = mouseY - prevMouseY;

    for ( let dot of dots ) {
      // Calculate distance from cursor
      const dx = dot.x - mouseX;
      const dy = dot.y - mouseY;
      const dist = Math.sqrt( dx * dx + dy * dy );

      // Apply repulsion force if within radius
      if ( dist < REPEL_RADIUS && dist > 0 ) {
        const exclusionZone = CURSOR_RADIUS + BUFFER_ZONE;

        // Stronger force closer to the circle boundary
        const force = ( REPEL_RADIUS - dist ) / REPEL_RADIUS;

        // Extra strong force if dot is inside or near the buffer zone
        const multiplier = dist < exclusionZone + 10 ? 4.0 : 1.0;

        const fx = ( dx / dist ) * force * REPEL_STRENGTH * multiplier;
        const fy = ( dy / dist ) * force * REPEL_STRENGTH * multiplier;
        dot.vx += fx;
        dot.vy += fy;

        // Hard boundary: if dot is inside exclusion zone, push it out immediately
        if ( dist < exclusionZone ) {
          const pushDist = exclusionZone - dist;
          dot.x += ( dx / dist ) * pushDist;
          dot.y += ( dy / dist ) * pushDist;
        }
      }

      // Apply spring force back to home position
      const homeX = dot.homeX - dot.x;
      const homeY = dot.homeY - dot.y;
      dot.vx += homeX * SPRING_STRENGTH;
      dot.vy += homeY * SPRING_STRENGTH;

      // Apply damping
      dot.vx *= DAMPING;
      dot.vy *= DAMPING;

      // Update position
      dot.x += dot.vx;
      dot.y += dot.vy;
    }
  }

  function draw( p5Instance ) {
    p5Instance.clear();

    // Update dot positions
    updateDots( p5Instance );

    // Draw dots
    p5Instance.noStroke();
    p5Instance.fill( DOT_COLOR[0], DOT_COLOR[1], DOT_COLOR[2] );
    for ( let dot of dots ) {
      p5Instance.circle( dot.x, dot.y, DOT_SIZE );
    }

    // Check collisions with cursor and update squares
    for ( let square of squares ) {
      square.checkCollision( mouseX, mouseY, mouseVX, mouseVY );
      square.update();
      square.display( p5Instance );
    }

    // Draw cursor circle (dark blue, transparent)
    p5Instance.noFill();
    p5Instance.stroke( 88, 90, 115, 100 );
    p5Instance.strokeWeight( 2 );
    p5Instance.circle( mouseX, mouseY, CURSOR_RADIUS * 2 );
  }

  function resize( p5Instance ) {
    p = p5Instance;
    shelfY = p.height * 0.2;

    // Recalculate shelf boundaries
    const containerWidth = p.width * 0.6;
    shelfLeft = ( p.width - containerWidth ) / 2;
    shelfRight = shelfLeft + containerWidth;

    generateDots();
    generateArtSquares();
  }

  return { setup, draw, resize };
})();

// Initial Animation - Gate Opening/Closing System
// Gates split apart with particle effects and spatial audio

const InitialAnimation = (() => {
  // P5 instance
  let p;

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
  const GATE_STATE_KEY = 'gatePosition';
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  function saveGateState( state ) {
    const gateData = {
      state: state,
      timestamp: Date.now()
    };
    localStorage.setItem( GATE_STATE_KEY, JSON.stringify( gateData ) );
  }

  function loadGateState() {
    const stored = localStorage.getItem( GATE_STATE_KEY );
    if ( !stored ) return null;

    try {
      const gateData = JSON.parse( stored );
      const age = Date.now() - gateData.timestamp;

      // If record is older than 1 day, return null to force closed state
      if ( age > ONE_DAY_MS ) {
        localStorage.removeItem( GATE_STATE_KEY );
        return null;
      }

      return gateData.state;
    } catch ( e ) {
      localStorage.removeItem( GATE_STATE_KEY );
      return null;
    }
  }

  function setup( p5Instance ) {
    p = p5Instance;

    gateSpeed = ( p.width / 2 ) / ( ANIMATION_DURATION / 1000 * 60 );

    initializeGates();

    // Check saved gate state
    const savedState = loadGateState();
    if ( savedState === 'open' ) {
      // Restore open state
      leftGate.x = -leftGate.w;
      rightGate.x = p.width;
      enableHTMLContent();
      document.getElementById( 'close-gate-btn' ).style.display = 'flex';
      document.getElementById( 'gate-canvas' ).style.pointerEvents = 'none';
      console.log( 'Restored open gate state from storage' );
    } else {
      // Start closed (default or expired state)
      disableHTMLContent();
      console.log( 'Gates closed (default state)' );
    }

    document.getElementById( 'gate-canvas' ).addEventListener( 'click', openGates );
  }

  function initializeGates() {
    leftGate = { x: 0, y: 0, w: p.width / 2, h: p.height };
    rightGate = { x: p.width / 2, y: 0, w: p.width / 2, h: p.height };
  }

  function canAnimate() {
    return !isOpening && !isClosing;
  }

  function openGates() {
    if ( !canAnimate() ) return;

    document.getElementById( 'gate-canvas' ).style.pointerEvents = 'none';

    if ( !audioInitialized ) {
      audioContext = new ( window.AudioContext || window.webkitAudioContext )();
      audioInitialized = true;
    }

    initializeGates();
    particles.length = 0;
    totalParticlesSpawned = 0;
    document.getElementById( 'close-gate-btn' ).style.display = 'none';

    isOpening = true;
    openingStartTime = p.millis();
    lastSpawnTime = 0;
    disableHTMLContent();
    playGateSound( 'opening' );
  }

  window.closeGates = function() {
    if ( !canAnimate() ) return;

    // Initialize audio if not already done (handles restored gate state)
    if ( !audioInitialized ) {
      audioContext = new ( window.AudioContext || window.webkitAudioContext )();
      audioInitialized = true;
    }

    document.getElementById( 'close-gate-btn' ).style.display = 'none';
    isOpening = false;

    leftGate.x = -leftGate.w;
    rightGate.x = p.width;
    particles.length = 0;

    disableHTMLContent();
    isClosing = true;
    closingStartTime = p.millis();
    playGateSound( 'closing' );
  };

  function playGateSound( direction ) {
    if ( !audioContext ) return;

    // Resume audio context if suspended (browser behavior)
    if ( audioContext.state === 'suspended' ) {
      audioContext.resume();
    }

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
    const jitteredInterval = spawnInterval * p.random( 0.8, 1.2 );
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
    const xOffset = p.random( -20, 20 );
    const yPos = p.random( p.height );
    const distanceFromCenter = Math.abs( yPos - p.height / 2 );

    let extendedChance = 0.05;
    if ( distanceFromCenter < ZONE1_HEIGHT / 2 ) extendedChance = 0.5;
    else if ( distanceFromCenter < ZONE2_HEIGHT / 2 ) extendedChance = 0.3;
    else if ( distanceFromCenter < ZONE3_HEIGHT / 2 ) extendedChance = 0.15;

    const flickerTime = p.random() < extendedChance ? p.random( 200, 500 ) : 100;
    particles.push( new Particle( xPos + xOffset, yPos, flickerTime ) );
    totalParticlesSpawned++;
  }

  function updateGatesOpening( elapsed ) {
    leftGate.x -= gateSpeed;
    rightGate.x += gateSpeed;

    if ( leftGate.x + leftGate.w <= 0 && rightGate.x >= p.width ) {
      isOpening = false;
      enableHTMLContent();
      saveGateState( 'open' );
      document.getElementById( 'close-gate-btn' ).style.display = 'flex';
      console.log( 'Gates opened. Particles spawned:', totalParticlesSpawned );
    }
  }

  function updateGatesClosing() {
    if ( leftGate.x < 0 ) {
      leftGate.x += gateSpeed;
      if ( leftGate.x >= 0 ) leftGate.x = 0;
    }

    if ( rightGate.x > p.width / 2 ) {
      rightGate.x -= gateSpeed;
      if ( rightGate.x <= p.width / 2 ) rightGate.x = p.width / 2;
    }

    if ( leftGate.x >= 0 && rightGate.x <= p.width / 2 ) {
      isClosing = false;
      disableHTMLContent();
      saveGateState( 'closed' );
      document.getElementById( 'gate-canvas' ).style.pointerEvents = 'auto';
      console.log( 'Gates closed. Click to reopen.' );
    }
  }

  function enableHTMLContent() {
    document.querySelector( '.container' ).style.pointerEvents = 'auto';
  }

  function disableHTMLContent() {
    document.querySelector( '.container' ).style.pointerEvents = 'none';
  }

  function drawGates( p5Instance ) {
    // Only draw gates if they're visible on screen
    const leftGateVisible = leftGate.x + leftGate.w > 0;
    const rightGateVisible = rightGate.x < p5Instance.width;

    if ( !leftGateVisible && !rightGateVisible ) return;

    p5Instance.noStroke();
    p5Instance.fill( 88, 89, 115 );

    // Draw left gate (only if visible)
    if ( leftGateVisible ) {
      p5Instance.rect( leftGate.x, leftGate.y, leftGate.w, leftGate.h );
      if ( leftGate.x + leftGate.w < p5Instance.width ) {
        p5Instance.stroke( 242, 171, 109 );
        p5Instance.strokeWeight( 2 );
        p5Instance.line( leftGate.x + leftGate.w, 0, leftGate.x + leftGate.w, p5Instance.height );
      }
    }

    // Draw right gate (only if visible)
    if ( rightGateVisible ) {
      p5Instance.noStroke();
      p5Instance.rect( rightGate.x, rightGate.y, rightGate.w, rightGate.h );
      if ( rightGate.x > 0 ) {
        p5Instance.stroke( 242, 171, 109 );
        p5Instance.strokeWeight( 2 );
        p5Instance.line( rightGate.x, 0, rightGate.x, p5Instance.height );
      }
    }
  }

  // Particle class
  class Particle {
    constructor( x, y, flickerTime = 100 ) {
      this.x = x;
      this.y = y;
      this.alpha = 255;
      this.flickerTime = flickerTime;
      this.createdTime = p.millis();
      this.size = p.random( 2, 4 );
    }

    update() {
      const elapsed = p.millis() - this.createdTime;
      this.alpha = elapsed > this.flickerTime ? this.alpha - 25 : p.random( 150, 255 );
    }

    display( p5Instance ) {
      p5Instance.stroke( 242, 171, 109, this.alpha );
      p5Instance.strokeWeight( this.size );
      p5Instance.point( this.x, this.y );
    }

    isDead() {
      return this.alpha <= 0;
    }
  }

  function draw( p5Instance ) {
    p5Instance.clear();

    // Opening animation
    if ( isOpening ) {
      const elapsed = p.millis() - openingStartTime;
      spawnParticles( elapsed );
      updateGatesOpening( elapsed );
    }

    // Closing animation
    if ( isClosing ) {
      updateGatesClosing();
    }

    // Draw gates (only when animating or visible)
    if ( isOpening || isClosing || leftGate.x + leftGate.w > 0 || rightGate.x < p5Instance.width ) {
      drawGates( p5Instance );
    }

    // Update and draw particles
    for ( let i = particles.length - 1; i >= 0; i-- ) {
      particles[i].update();
      particles[i].display( p5Instance );
      if ( particles[i].isDead() ) particles.splice( i, 1 );
    }
  }

  return { setup, draw };
})();

// P5.js instance for background (z-index 1)
new p5(( p ) => {
  p.setup = function() {
    const canvas = p.createCanvas( p.windowWidth, p.windowHeight );
    canvas.parent( document.body );
    canvas.id( 'background-canvas' );
    canvas.style( 'position', 'fixed' );
    canvas.style( 'top', '0' );
    canvas.style( 'left', '0' );
    canvas.style( 'z-index', '1' );
    canvas.style( 'pointer-events', 'none' );

    BackgroundDisplay.setup( p );
  };

  p.draw = function() {
    BackgroundDisplay.draw( p );
  };

  p.windowResized = function() {
    p.resizeCanvas( p.windowWidth, p.windowHeight );
    BackgroundDisplay.resize( p );
  };
});

// P5.js instance for gates/particles (z-index 10)
new p5(( p ) => {
  p.setup = function() {
    const canvas = p.createCanvas( p.windowWidth, p.windowHeight );
    canvas.parent( document.body );
    canvas.id( 'gate-canvas' );
    canvas.style( 'position', 'fixed' );
    canvas.style( 'top', '0' );
    canvas.style( 'left', '0' );
    canvas.style( 'z-index', '10' );
    canvas.style( 'pointer-events', 'auto' );

    InitialAnimation.setup( p );
  };

  p.draw = function() {
    InitialAnimation.draw( p );
  };

  p.windowResized = function() {
    p.resizeCanvas( p.windowWidth, p.windowHeight );
  };
});
