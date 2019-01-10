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
	TheGround = new Ground

	TheGround.size = {
		w: 10000,
		h: 100
	}
	TheGround.position = {
		x: 0,
		y: windowHeight - TheGround.size.h
	}

	for (let i = 0; i < 200; i++) {

		let NewThing = RandomCreation(0)
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

function Ground () {

	this.position = {}
	this.size = {}
	this.speed = 5

	this.draw = () => {

		fill("black")
		rect(this.position.x, this.position.y, this.size.w, this.size.h)
	}
}

const RandomCreation = (Num) => {

	switch (Num) {
		case 0:
			let NewThing = new SimpleTree

			NewThing.TrunkSize = {
				w: random(20, 100),
				h: random(20, 120)
			}
			let RandomWidth = random(20, NewThing.TrunkSize.w)
			NewThing.BranchSize = {
				left: RandomWidth,
				top: random( NewThing.TrunkSize.h / 2, NewThing.TrunkSize.h * 2 ),
				right: RandomWidth
			}
			NewThing.startingX = random(0, TheGround.size.w)
			NewThing.position.y = windowHeight - (TheGround.size.h + NewThing.TrunkSize.h)

			return NewThing
			break;
		default:

	}
}

function SimpleTree () {

	this.startingX = 0
	this.position = {}
	this.TrunkSize = {}
	this.BranchSize = {}


	this.draw = () => {

		let HalfWidth = this.TrunkSize.w/2

		this.position.x = this.startingX + TheGround.position.x

		push()
		fill("black")
		rect(this.position.x, this.position.y, this.TrunkSize.w, this.TrunkSize.h)
		pop()

		push()
		fill("black")
		// triangle(30, 75, 58, 20, 86, 75)
		triangle(
			this.position.x - this.BranchSize.left, this.position.y,
			this.position.x + HalfWidth, this.position.y - this.BranchSize.top,
			this.position.x + this.TrunkSize.w + this.BranchSize.right, this.position.y
		)
		pop()
	}
}






//
