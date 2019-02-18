let AllParticals = []
// COLORs # "#7D7D7D" "#2B2B2B" "#303030" "#383838"

function setup () {

	// //find appropriate canvas width
	// canvas_size = windowWidth < windowHeight ? windowWidth : windowHeight
	// canvas_size -= 80

	createCanvas( windowWidth, windowHeight )

	// //set canvas in center
	// let margin_left = (windowWidth - canvas_size) / 2
	// $(".p5Canvas").css("margin-left", margin_left)
	// $(".p5Canvas").css("margin-top", 40)

	for (var i = 0; i < 30; i++) {

		let NewPartical = new Particle
		AllParticals.push(NewPartical)
	}

}

function draw () {

	console.time("frame")
	background("#7D7D7D")

	var fps = frameRate();
	fill(255);
	stroke(0);
	text("FPS: " + fps.toFixed(2), 100, 100);

	for (let i = 0; i < AllParticals.length; i++) {

		let Particle = AllParticals[i]

		Particle.Draw()
		Particle.Move()

	}
	// for (let i = 0; i < AllParticals.length; i++) {
	//
	// 	let Particle = AllParticals[i]
	//
	// 	Particle.Move()
	// }
	console.timeEnd("frame")
}

function Particle () {

	this.Pos = {x:0,y:0}
	this.Size = 10
	this.Orbit = {
		x:windowWidth/2,
		y:windowHeight/2,
		angle: random(0, 360),
		speed: random(.01, .03),
		radius: random(100, 200)
	}

	this.Move = () => {

		let x, y
		x = this.Orbit.x + Math.cos(this.Orbit.angle) * this.Orbit.radius
		y = this.Orbit.y + Math.sin(this.Orbit.angle) * this.Orbit.radius

		this.Orbit.angle += this.Orbit.speed
		this.Orbit.angle += this.Orbit.speed

		this.Pos.x = x
		this.Pos.y = y
	}

	this.Draw = () => {

		fill("#7D7D7D")
		stroke("red")
		rect(this.Pos.x, this.Pos.y, this.Size, this.Size)
	}
}







//
