// Physics utilities for ARKAD
const GRAVITY = 0.3;
const GROUND_FRICTION = 0.95;
const ROTATION_DECAY = 0.95;

const handleGroundCollision = ( obj ) => {
  if ( obj.y + obj.size / 2 <= height ) {
    return false;
  }
  obj.y = height - obj.size / 2;
  obj.velocityY *= -0.1;
  obj.velocityX *= GROUND_FRICTION;
  obj.rotationSpeed *= ROTATION_DECAY;
  obj.onGround = true;
  const isSettled = Math.abs( obj.velocityX ) < 0.5 && Math.abs( obj.velocityY ) < 0.5;
  if ( isSettled && obj instanceof Square ) {
    const angle = ( obj.rotation % TWO_PI + TWO_PI ) % TWO_PI;
    obj.rotation = Math.round( angle / HALF_PI ) * HALF_PI;
    obj.rotationSpeed = 0;
  }
  return true;
};

const handleWallCollision = ( obj ) => {
  if ( obj.x - obj.size / 2 < 0 || obj.x + obj.size / 2 > width ) {
    obj.velocityX *= -1;
    obj.x = constrain( obj.x, obj.size / 2, width - obj.size / 2 );
  }
};

function checkCollision( obj1, obj2 ) {
  if ( !obj1.hasGravity || !obj2.hasGravity ) {
    return;
  }
  const dx = obj2.x - obj1.x;
  const dy = obj2.y - obj1.y;
  const distance = Math.sqrt( dx * dx + dy * dy );
  const minDist = ( obj1.size + obj2.size ) / 2;
  if ( distance >= minDist ) {
    return;
  }
  const angle = Math.atan2( dy, dx );
  const targetX = obj1.x + Math.cos( angle ) * minDist;
  const targetY = obj1.y + Math.sin( angle ) * minDist;
  const ax = ( targetX - obj2.x ) * 0.5;
  const ay = ( targetY - obj2.y ) * 0.5;
  obj1.x -= ax;
  obj1.y -= ay;
  obj2.x += ax;
  obj2.y += ay;
  const dvx = obj2.velocityX - obj1.velocityX;
  const dvy = obj2.velocityY - obj1.velocityY;
  const dvdr = dx * dvx + dy * dvy;
  if ( dvdr > 0 ) {
    return;
  }
  const impulse = 0.01 * dvdr / ( obj1.mass + obj2.mass );
  obj1.velocityX += impulse * obj2.mass * dx / distance;
  obj1.velocityY += impulse * obj2.mass * dy / distance;
  obj2.velocityX -= impulse * obj1.mass * dx / distance;
  obj2.velocityY -= impulse * obj1.mass * dy / distance;
  obj1.rotationSpeed += impulse * 0.01;
  obj2.rotationSpeed -= impulse * 0.01;
}
