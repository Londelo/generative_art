
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
