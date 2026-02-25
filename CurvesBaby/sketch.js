
const allCurves = [],
  circles = [];

// function preload() {
//   soundFormats('mp3');
//   var mySound = loadSound('fantasy-loop.mp3');
// }


function setup() {
  // //find appropriate canvas width
  // canvas_size = windowWidth < windowHeight ? windowWidth : windowHeight
  // canvas_size -= 80

  createCanvas( windowWidth, windowHeight );

  const num_curves = 1000;
  for ( let i = 0; i < num_curves; i++ ) {

    const newCurve = new kurve;

    if( i === 0 ) {

      newCurve.points.x1 = windowWidth / 2;
      newCurve.points.y1 = windowHeight / 2;

      newCurve.points.x2 = windowWidth / 4;
      newCurve.points.y2 = windowHeight / 2;

      newCurve.points.x3 = ( windowWidth / 4 ) * 3;
      newCurve.points.y3 = windowHeight / 2;

      newCurve.points.x4 = windowWidth / 2;
      newCurve.points.y4 = windowHeight / 2;

    } else {
      newCurve.points.x1 = windowWidth / 2;
      newCurve.points.y1 = windowHeight / 2;

      newCurve.points.x2 = allCurves[0].points.x2;
      newCurve.points.y2 = allCurves[0].points.y2;

      newCurve.points.x3 = allCurves[0].points.x3;
      newCurve.points.y3 = allCurves[0].points.y3;

      newCurve.points.x4 = windowWidth / 2;
      newCurve.points.y4 = windowHeight / 2;
    }

    allCurves.push( newCurve );
  }

  const num_circles = 1;
  for ( let i = 0; i < num_circles; i++ ) {
    circleOfDots();
  }

  background( '#FCC8CD' );
}


function draw() {

  background( 'black' );

  allCurves.forEach( ( curve ) => {

    curve.make();
    // curve.makeDots()

    if( mouseIsPressed ) {
      curve.findDot();
      // mySound.setVolume(1);
      // mySound.play()
    }

    if( curve.dotsFound.x1 ) {
      curve.change( random( 50, 300 ) );
      curve.goDot();
    }
  } );


  circles.forEach( ( points ) => {
    points.forEach( ( point ) => {
      push();
      stroke( random( 10, 300 ), random( 10, 300 ), random( 10, 300 ) );
      fill( random( 10, 300 ), random( 10, 300 ), random( 10, 300 ) );
      ellipse( point.x, point.y, 1, 1 );
      pop();
    } );
  } );

}


function kurve() {

  this.points = {};

  this.dotsFound = {};

  this.speed = 3;

  this.make = () => {

    noFill();
    // "#556487"
    stroke( 'white' );
    curve(
      this.points.x1,
      this.points.y1,
      this.points.x2,
      this.points.y2,
      this.points.x3,
      this.points.y3,
      this.points.x4,
      this.points.y4
    );
  };

  this.makeDots = () => {

    fill( 'red' );
    // the curve
    // ellipse(
    // 	this.points.x1,
    // 	this.points.y1,
    // 	10,
    // 	10
    // )
    // ellipse(
    // 	this.points.x4,
    // 	this.points.y4,
    // 	10,
    // 	10
    // )
    // the ends
    ellipse(
      this.points.x2,
      this.points.y2,
      10,
      10
    );
    ellipse(
      this.points.x3,
      this.points.y3,
      10,
      10
    );
  };

  this.change = ( num ) => {

    this.points.x1 += random( -num, num );
    this.points.y1 += random( -num, num );

    // this.points.x2 += random(-num, num)
    // this.points.y2 += random(-num, num)
    //
    // this.points.x3 += random(-num, num)
    // this.points.y3 += random(-num, num)

    this.points.x4 += random( -num, num );
    this.points.y4 += random( -num, num );
  };

  this.findDot = () => {

    circles.forEach( ( points, i ) => {

      if( i === 0 ) {
        const dot1 = points[fixedNum( random( 0,points.length - 1 ) )],
          dot2 = points[fixedNum( random( 0,points.length - 1 ) )];
        this.dotsFound.x1 = dot1.x;
        this.dotsFound.y1 = dot1.y;

        this.dotsFound.x2 = dot2.x;
        this.dotsFound.y2 = dot2.y;
      }
    } );
  };

  this.goDot = () => {

    const direction1 = moveThere(
        this.points.x2,
        this.points.y2,
        this.dotsFound.x1,
        this.dotsFound.y1,
        this.speed
      ),
      direction2 = moveThere(
        this.points.x3,
        this.points.y3,
        this.dotsFound.x2,
        this.dotsFound.y2,
        this.speed
      );

    this.points.x2 = direction1.x;

    this.points.y2 = direction1.y;

    this.points.x3 = direction2.x;

    this.points.y3 = direction2.y;
  };
}

const circleOfDots = () => {

  // I got this from http://bl.ocks.org/bycoffe/3404776
  let radius = random( 50, 300 ),
    num_points = 360,
    angle,
    x,
    y,
    points = [];

  for ( let c = 0; c < num_points; c++ ) {

    angle = ( c / ( num_points / 2 ) ) * Math.PI; // Calculate the angle at which the element will be placed.
    // For a semicircle, we would use (i / num_points) * Math.PI.
    x = ( radius * Math.cos( angle ) ) + ( windowWidth / 2 ); // Calculate the x position of the element.
    y = ( radius * Math.sin( angle ) ) + ( windowHeight / 2 ); // Calculate the y position of the element.

    points.push( {x: Number( x.toFixed( 0 ) ),
      y: Number( y.toFixed( 0 ) )} );

    if( c === num_points - 1 ) {
      circles.push( [ ...points ] );
    }
  }
};

const moveThere = ( x, y, x1, y1, speed ) => {

  let xx, yy, distance;

  xx =  x1 - x;
  yy = y1 - y;

  distance = Math.sqrt( xx * xx + yy * yy );
  xx /= distance;
  yy /= distance;

  x += xx * speed;
  y +=	yy * speed;

  if( distance < 10 ) {
    x = x1;
    y = y1;
  }

  return {x, y};
};

const fixedNum = ( num ) => {
  return Number( num.toFixed( 0 ) );
};






















//
