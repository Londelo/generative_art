let Planets = []

function setup () {

	// //find appropriate canvas width
	// canvas_size = windowWidth < windowHeight ? windowWidth : windowHeight
	// canvas_size -= 80

	createCanvas( windowWidth, windowHeight)

	// //set canvas in center
	// let margin_left = (windowWidth - canvas_size) / 2
	// $(".p5Canvas").css("margin-left", margin_left)
	// $(".p5Canvas").css("margin-top", 40)

	const NumPlanets = 100
	for (var i = 0; i < NumPlanets; i++) {

		const NewPlanet = new Planet

		NewPlanet.Position = {
			x: random(0, windowWidth),
			y: random(0, windowHeight)
		}
		NewPlanet.Props = {
			size: random(0, 30),
			speed: random(.01, .03),
			color: "black",
			angle: random(0, 360),
			orbit: {
				xradius: random(10, 200),
				yradius: random(10, 200),
				x: windowWidth/2,
				y: windowHeight/2
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
		console.log(BigObjectInTheSky.Position, "Position");
	}

	// fill("green")
	// ellipse(windowWidth/2, windowHeight/2, 10, 10)

}

function Planet () {

	this.Position = {}
	this.Props = {} // speed, size, ect...

	this.Draw = () => {
		// noStroke()
		fill(this.Props.color)
		ellipse(this.Position.x, this.Position.y, this.Props.size, this.Props.size)
	}

	this.Move = () => {
		let x, y
		x = this.Props.orbit.x + Math.cos(this.Props.angle) * this.Props.orbit.xradius
		y = this.Props.orbit.y + Math.sin(this.Props.angle) * this.Props.orbit.yradius
		this.Props.angle += this.Props.speed
		console.log(x, y, this.Props.angle);

		this.Position.x = x
		this.Position.y = y
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
