// P5 overlay sketch for homepage effects
// Opening animation with splitting squares and particles

let leftSquare;
let rightSquare;
let particles = [];
let animationStarted = false;
let animationStartTime;
let moveSpeed;

const ANIMATION_DURATION = 1500; // 1.5 seconds
const RAMP_UP_TIME = 300; // First 300ms slow spawn
const TARGET_PARTICLES_PER_SQUARE = 500;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent(document.body);
  canvas.id('p5-overlay');

  canvas.style('position', 'fixed');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '5');
  canvas.style('pointer-events', 'none');

  // Calculate speed to complete in 1.5 seconds
  // Need to move half screen width in 1.5 seconds at 60fps
  moveSpeed = (width / 2) / (ANIMATION_DURATION / 1000 * 60);

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
  setTimeout(() => {
    animationStarted = true;
    animationStartTime = millis();
  }, 500);
}

function draw() {
  clear();

  if (animationStarted) {
    const elapsed = millis() - animationStartTime;

    // Calculate spawn rate with ramp-up
    let spawnRate;
    if (elapsed < RAMP_UP_TIME) {
      // Slow spawn for first 300ms
      spawnRate = map(elapsed, 0, RAMP_UP_TIME, 0.1, 0.5);
    } else {
      // Ramp up aggressively after 300ms
      const rampProgress = (elapsed - RAMP_UP_TIME) / (ANIMATION_DURATION - RAMP_UP_TIME);
      spawnRate = map(rampProgress, 0, 1, 0.5, 0.95);
    }

    // Move squares apart
    if (leftSquare.active) {
      leftSquare.x -= moveSpeed;

      // Spawn particles along right edge (innermost border)
      if (random() < spawnRate) {
        particles.push(new Particle(leftSquare.x + leftSquare.w, random(height)));
      }

      // Check if innermost border reached left edge
      if (leftSquare.x + leftSquare.w <= 0) {
        leftSquare.active = false;
      }
    }

    if (rightSquare.active) {
      rightSquare.x += moveSpeed;

      // Spawn particles along left edge (innermost border)
      if (random() < spawnRate) {
        particles.push(new Particle(rightSquare.x, random(height)));
      }

      // Check if innermost border reached right edge
      if (rightSquare.x >= width) {
        rightSquare.active = false;
      }
    }
  }

  // Draw squares with pale sky blue border on innermost edge
  noStroke();
  fill(27, 42, 65); // Deep navy background

  if (leftSquare.active) {
    rect(leftSquare.x, leftSquare.y, leftSquare.w, leftSquare.h);
    stroke(216, 237, 245); // Pale sky blue
    strokeWeight(2);
    line(leftSquare.x + leftSquare.w, 0, leftSquare.x + leftSquare.w, height);
  }

  if (rightSquare.active) {
    noStroke();
    rect(rightSquare.x, rightSquare.y, rightSquare.w, rightSquare.h);
    stroke(216, 237, 245);
    strokeWeight(2);
    line(rightSquare.x, 0, rightSquare.x, height);
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();

    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alpha = 255;
    this.flickerTime = 1000; // Flicker for 1 second
    this.createdTime = millis();
    this.size = random(3, 6);
  }

  update() {
    const elapsed = millis() - this.createdTime;

    if (elapsed > this.flickerTime) {
      // Start fading after flicker period
      this.alpha -= 5;
    } else {
      // Flicker effect
      this.alpha = random(150, 255);
    }
  }

  display() {
    noStroke();
    fill(216, 237, 245, this.alpha);
    circle(this.x, this.y, this.size);
  }

  isDead() {
    return this.alpha <= 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
