
function Orbit () {

	this.Orbit = {
		x:windowWidth/2,
		y:windowHeight,
		angle: random(0, 360),
		speed: 1,
		radius: 200
	}

	let x, y
	x = this.Orbit.x + Math.cos(this.Orbit.angle) * this.Orbit.radius
	y = this.Orbit.y + Math.sin(this.Orbit.angle) * this.Orbit.radius

	this.Orbit.angle += this.Orbit.speed
	this.Orbit.angle += this.Orbit.speed

	this.position.x = x
	this.position.y = y
}


function _DotCircle() {
  // this makes a circle out of dots

  let allPoints = []
  
  this.MakePoints = () => {
      // I got this from http://bl.ocks.org/bycoffe/3404776
    let radius = random(100, 400),
    num_points = 180,
    angle, x, y

    for (let c = 0; c < num_points; c++) {

      angle = (c / (num_points / 2)) * Math.PI; // Calculate the angle at which the element will be placed.
                                            // For a semicircle, we would use (i / num_points) * Math.PI.
      x = (radius * Math.cos(angle)) + (windowWidth/2); // Calculate the x position of the element.
      y = (radius * Math.sin(angle)) + (windowHeight/2); // Calculate the y position of the element.

      allPoints.push({
        x: Number(x.toFixed(0)),
        y: Number(y.toFixed(0)),
      })
    }
  }

  this.Draw = () => {

    for (let index = 0; index < allPoints.length; index++) {
      const point = allPoints[index];
      fill(51)
      circle(point.x, point.y, 2)
    }
  }
}