// P5 overlay sketch for homepage effects
// Transparent background with layered effects

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent(document.body);
  canvas.id('p5-overlay');

  // Position canvas as overlay
  canvas.style('position', 'fixed');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('z-index', '1');
  canvas.style('pointer-events', 'none');
}

function draw() {
  // Clear with transparency - this is key for overlay effect
  clear();

  // Example effect - you can replace this with anything
  // Drawing a subtle moving circle as a placeholder
  noStroke();
  fill(180, 161, 191, 30); // Light purple with transparency
  circle(mouseX, mouseY, 50);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
