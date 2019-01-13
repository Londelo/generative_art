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

	for (let i = 0; i < 100; i++) {

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

			NewThing.make()

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

		let TempPosition = {x: this.position.x, y: this.position.y, w: this.BranchSize.w},
				TempSizes = {BW: this.BranchSize.w, BH: this.BranchSize.h}

		this.position.x = this.startingX + TheGround.position.x

		push()
		fill("black")
		rect(this.position.x, this.position.y, this.TrunkSize.w, this.TrunkSize.h)
		pop()

		push()
		fill("black")
		triangle(
			this.position.x - this.BranchSize.w, this.position.y,
			this.position.x + (this.TrunkSize.w/2), this.position.y - this.BranchSize.h,
			this.position.x + this.TrunkSize.w + this.BranchSize.w, this.position.y
		)
		pop()

		TempPosition.y -= TempSizes.BH / 2
		TempSizes.BW -= TempSizes.BW / 2
		push()
		fill("black")
		triangle(
			TempPosition.x - TempSizes.BW, TempPosition.y,
			TempPosition.x + (this.TrunkSize.w/2), TempPosition.y - TempSizes.BH,
			TempPosition.x + this.TrunkSize.w + TempSizes.BW, TempPosition.y
		)
		pop()

		TempPosition.y -= TempSizes.BH / 2
		TempSizes.BW -= TempSizes.BW / 2
		push()
		fill("black")
		triangle(
			TempPosition.x - TempSizes.BW, TempPosition.y,
			TempPosition.x + (this.TrunkSize.w/2), TempPosition.y - TempSizes.BH,
			TempPosition.x + this.TrunkSize.w + TempSizes.BW, TempPosition.y
		)
		pop()
	}

	this.make = () => {

		this.TrunkSize = {
			w: random(20, 75),
			h: random(20, 50)
		}

		this.BranchSize = {
			w: random(20, 100),
			h: random( this.TrunkSize.h , this.TrunkSize.h * 4),
		}

		this.startingX = random(0, TheGround.size.w)

		this.position.y = windowHeight - (TheGround.size.h + this.TrunkSize.h)
	}
}






//
