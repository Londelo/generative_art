let TheGround,
		AllThings = []

function setup () {
	// //find appropriate canvas width
	// canvas_size = windowWidth < windowHeight ? windowWidth : windowHeight
	// canvas_size -= 80

	createCanvas( windowWidth, windowHeight )

	// //set canvas in center
	// let margin_left = (windowWidth - canvas_size) / 2
	// $(".p5Canvas").css("margin-left", margin_left)
	// $(".p5Canvas").css("margin-top", 40)
	TheGround = new ground

	TheGround.size = {
		w: 10000,
		h: 100
	}
	TheGround.position = {
		x: 0,
		y: windowHeight - TheGround.size.h
	}

	for (let i = 0; i < 100; i++) {
		let NewThing = new square

		NewThing.size = {
			w: 50,
			h: random(50, 200)
		}
		NewThing.startingX = random(0, TheGround.size.w)
		NewThing.position.y = windowHeight - (TheGround.size.h + NewThing.size.h)

		AllThings.push(NewThing)
	}
}


function draw () {

	background("grey")

	TheGround.draw()

	if(keyCode === 100) {
		TheGround.position.x += TheGround.speed
	}
	if(keyCode === 97) {
		TheGround.position.x -= TheGround.speed
	}

	for (var i = 0; i < AllThings.length; i++) {
		let Thing = AllThings[i]
		Thing.draw()
	}

}

function ground () {

	this.position = {}
	this.size = {}
	this.speed = 5

	this.draw = () => {

		fill("black")
		rect(this.position.x, this.position.y, this.size.w, this.size.h)
	}
}

function square () {

	this.startingX = 0
	this.position = {}
	this.size = {}

	this.draw = () => {

		this.position.x = this.startingX + TheGround.position.x

		fill("black")
		rect(this.position.x, this.position.y, this.size.w, this.size.h)
	}
}






//
