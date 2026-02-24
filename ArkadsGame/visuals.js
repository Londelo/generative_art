// Visual System for ARKAD - animated shapes spawned by keypresses

function Circle( x, y, color, hasGravity ) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.size = random( 80, 180 );
  this.mass = this.size;
  this.hasGravity = hasGravity;
  this.velocityX = random( -2, 2 );
  this.velocityY = random( -3, -1 );
  this.rotation = random( TWO_PI );
  this.rotationSpeed = random( -0.03, 0.03 );
  this.lifespan = this.maxLifespan = 600;
  this.isDying = false;
  this.deathTimer = 30;
  this.onGround = false;
  this.update = () => {
    if ( this.hasGravity ) {
      this.velocityY += GRAVITY;
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.rotation += this.rotationSpeed;
      this.onGround = false;
      handleGroundCollision( this );
      handleWallCollision( this );
      this.rotationSpeed = Math.abs( this.rotationSpeed ) < 0.001 ? 0 : this.rotationSpeed;
    }
    this.lifespan--;
    if ( this.lifespan <= 0 && !this.isDying ) {
      this.isDying = true;
    }
    if ( this.isDying ) {
      this.deathTimer--;
    }
  };
  this.draw = () => {
    const currentSize = this.isDying ? map( this.deathTimer, 30, 0, this.size, 0 ) : this.size;
    const opacity = this.isDying ? map( this.deathTimer, 30, 0, 255, 0 ) : 255;
    push();
    translate( this.x, this.y );
    rotate( this.rotation );
    fill( this.color.red, this.color.green, this.color.blue, opacity );
    noStroke();
    ellipse( 0, 0, currentSize, currentSize );
    pop();
  };
  this.isDead = () => {
    return this.isDying && this.deathTimer <= 0;
  };
  this.onDeath = () => {
    return {x: this.x, y: this.y, color: this.color};
  };
}

function Square( x, y, color, hasGravity ) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.size = random( 80, 180 );
  this.mass = this.size;
  this.hasGravity = hasGravity;
  this.velocityX = random( -2, 2 );
  this.velocityY = random( -3, -1 );
  this.rotation = random( TWO_PI );
  this.rotationSpeed = random( -0.03, 0.03 );
  this.lifespan = this.maxLifespan = 600;
  this.isDying = false;
  this.deathTimer = 30;
  this.onGround = false;
  this.update = () => {
    if ( this.hasGravity ) {
      this.velocityY += GRAVITY;
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.rotation += this.rotationSpeed;
      this.onGround = false;
      handleGroundCollision( this );
      handleWallCollision( this );
      this.rotationSpeed = Math.abs( this.rotationSpeed ) < 0.001 ? 0 : this.rotationSpeed;
    }
    this.lifespan--;
    if ( this.lifespan <= 0 && !this.isDying ) {
      this.isDying = true;
    }
    if ( this.isDying ) {
      this.deathTimer--;
    }
  };
  this.draw = () => {
    const currentSize = this.isDying ? map( this.deathTimer, 30, 0, this.size, 0 ) : this.size;
    const opacity = this.isDying ? map( this.deathTimer, 30, 0, 255, 0 ) : 255;
    push();
    translate( this.x, this.y );
    rotate( this.rotation );
    fill( this.color.red, this.color.green, this.color.blue, opacity );
    noStroke();
    rectMode( CENTER );
    rect( 0, 0, currentSize, currentSize );
    pop();
  };
  this.isDead = () => {
    return this.isDying && this.deathTimer <= 0;
  };
  this.onDeath = () => {
    return {x: this.x, y: this.y, color: this.color};
  };
}

function ZippyLine( x, y, color ) {
  this.x = x;
  this.y = y;
  this.prevX = x;
  this.prevY = y;
  this.color = color;
  const angle = random( TWO_PI );
  const speed = random( 8, 15 );
  this.velocityX = cos( angle ) * speed;
  this.velocityY = sin( angle ) * speed;
  this.update = () => {
    this.prevX = this.x;
    this.prevY = this.y;
    this.x += this.velocityX;
    this.y += this.velocityY;
  };
  this.draw = () => {
    stroke( this.color.red, this.color.green, this.color.blue, 200 );
    strokeWeight( 10 );
    line( this.prevX, this.prevY, this.x, this.y );
  };
  this.isDead = () => {
    return this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50;
  };
}

function Sparkle( x, y, color ) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.lifespan = this.maxLifespan = 60;
  const numLines = floor( random( 5, 21 ) );
  this.lines = [];
  for ( let lineIdx = 0; lineIdx < numLines; lineIdx++ ) {
    const angle = ( TWO_PI / numLines ) * lineIdx + random( -0.2, 0.2 );
    this.lines.push( {angle, length: 0, maxLength: random( 60, 150 )} );
  }
  this.update = () => {
    this.lifespan--;
    for ( let lineIdx = 0; lineIdx < this.lines.length; lineIdx++ ) {
      const progress = 1 - ( this.lifespan / this.maxLifespan );
      this.lines[lineIdx].length = this.lines[lineIdx].maxLength * progress;
    }
  };
  this.draw = () => {
    const opacity = map( this.lifespan, 0, this.maxLifespan, 0, 0.9 );
    stroke( this.color.red, this.color.green, this.color.blue, opacity * 255 );
    strokeWeight( 3 );
    for ( let lineIdx = 0; lineIdx < this.lines.length; lineIdx++ ) {
      const sparkLine = this.lines[lineIdx];
      const endX = this.x + cos( sparkLine.angle ) * sparkLine.length;
      const endY = this.y + sin( sparkLine.angle ) * sparkLine.length;
      line( this.x, this.y, endX, endY );
    }
    fill( this.color.red, this.color.green, this.color.blue, opacity * 255 );
    noStroke();
    ellipse( this.x, this.y, 8, 8 );
  };
  this.isDead = () => {
    return this.lifespan <= 0;
  };
}

function spawnRandomShape( x, y, color ) {
  const rand = random( 100 );
  if ( rand < 15 ) {
    return new Circle( x, y, color, true );
  } else if ( rand < 30 ) {
    return new Square( x, y, color, true );
  } else if ( rand < 65 ) {
    return new ZippyLine( x, y, color );
  }
  return new Sparkle( x, y, color );
}
