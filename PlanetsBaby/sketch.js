let Planets = []
let Trails = []

let orbit = {
}

function setup () {

	// //find appropriate canvas width
	// canvas_size = windowWidth < windowHeight ? windowWidth : windowHeight
	// canvas_size -= 80

	createCanvas( windowWidth, windowHeight, 	WEBGL)

	// //set canvas in center
	// let margin_left = (windowWidth - canvas_size) / 2
	// $(".p5Canvas").css("margin-left", margin_left)
	// $(".p5Canvas").css("margin-top", 40)

	const NumPlanets = 30
	for (var i = 0; i < NumPlanets; i++) {

		const NewPlanet = new Planet

		NewPlanet.Props = {
			size: random(5, 25),
			speed: random(.01, .02),
			color: 50,
			angle: random(0, 360),
			orbit: {
				xradius: random(100, 500),
				yradius: random(-50, 20),
				zradius: random(-100, 10),
				x: 0,
				y: 0,
				z: -20
			}
		}

		Planets.push(NewPlanet)
	}

	orbit = {
		xradius: random(50, 300),
		yradius: random(-80, -20),
		zradius: random(-100, 10),
		x: 0,
		y: 0,
		z: -20
	}

}

function draw () {

	background("grey")

	// pointLight(250, 250, 250, 0, 0, -20);
	// ambientMaterial(250);

	for (var i = 0; i < Planets.length; i++) {
		const BigObjectInTheSky = Planets[i]
		BigObjectInTheSky.Draw()
		BigObjectInTheSky.Move()
		BigObjectInTheSky.MakeTrail()
		// BigObjectInTheSky.Trail.push(BigObjectInTheSky.Position)
		// console.log(BigObjectInTheSky.Trail.length, BigObjectInTheSky.Trail, BigObjectInTheSky.Position);
	}
	//the sun
	push()
	fill("orange")
	translate(orbit.x, orbit.y, orbit.z)
	sphere(30, 100, 100)
	pop()
}

function Planet () {

	this.Position = {x: 0, y: 0, z: 0}
	this.Props = {} // speed, size, ect...
	this.Trail = []

	this.Draw = () => {
		// noStroke()
		push()
		fill(this.Props.color)
		translate(this.Position.x, this.Position.y, this.Position.z)
		sphere(this.Props.size, 100, 100)
		pop()
	}

	this.Move = () => {

		let x, y
		x = this.Props.orbit.x + Math.cos(this.Props.angle) * this.Props.orbit.xradius
		y = this.Props.orbit.y + Math.sin(this.Props.angle) * this.Props.orbit.yradius
		z = this.Props.orbit.z + Math.sin(this.Props.angle) * this.Props.orbit.zradius

		this.Props.angle += this.Props.speed

		this.Position.x = x
		this.Position.y = y
		this.Position.z = z
	}

	this.MakeTrail = () => {

		if(this.Trail.length > 10) {
			this.Trail.pop()
		}

		// this.Trail.forEach((point) => {
		// 	push()
		// 	fill("red")
		// 	translate(point.x, point.y, point.z)
		// 	sphere(10, 100, 100)
		// 	pop()
		// })
	}
}

const SetUpOurSolarSystem = (index) => {

	switch (index) {

		case 1:

			break;

		case 2:

			break;

		case 3:

			break;

		case 4:

			break;

		case 5:

			break;

		case 6:

			break;

		case 7:

			break;

		case 8:

			break;

		case 9:

			break;

		default:

	}
}






//
