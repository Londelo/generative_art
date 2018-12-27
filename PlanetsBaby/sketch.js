let Planets = []
let Trails = []

function setup () {

	// //find appropriate canvas width
	// canvas_size = windowWidth < windowHeight ? windowWidth : windowHeight
	// canvas_size -= 80

	createCanvas( windowWidth, windowHeight, 	WEBGL)

	// //set canvas in center
	// let margin_left = (windowWidth - canvas_size) / 2
	// $(".p5Canvas").css("margin-left", margin_left)
	// $(".p5Canvas").css("margin-top", 40)

	let NumPlanets = [
		{id:"work", rank:23},
		{id:"Programing", rank:5},
		{id:"Climbing", rank:1},
		{id:"SlackLining", rank:1},
		{id:"Hiking", rank:.5},
		{id:"Sam", rank:12},
		{id:"Games", rank:2},
		{id:"podcast.book", rank:5},
		{id:"misc", rank:8}
	]

	for (var i = 0; i < NumPlanets.length; i++) {

		const NewPlanet = new Planet, PlanetDesc = NumPlanets[i]

		NewPlanet.Props = {
			size: PlanetDesc.rank * 5,
			speed: random(.01, .02),
			color: 50,
			angle: random(0, 360),
			orbit: {
				xradius: random(500, 600),
				yradius: random(-100, 500),
				zradius: random(-500, -300),
				x: 0,
				y: 0,
				z: -400
			}
		}

		Planets.push(NewPlanet)
	}
}

function draw () {

	background("grey")

	for (var i = 0; i < Planets.length; i++) {
		const BigObjectInTheSky = Planets[i]

		BigObjectInTheSky.Draw()
		BigObjectInTheSky.Move()
	}

	//the sun
	push()
	fill("red")
	translate(0, 0, -400)
	sphere(300, 100, 100)
	pop()

}

function Planet () {

	this.Position = {x: 0, y: 0, z: 0}
	this.Props = {} // speed, size, ect...
	this.Trail = []

	this.Draw = () => {
		noStroke()
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






//
