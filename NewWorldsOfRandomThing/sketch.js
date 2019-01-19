let TheGround,
		TheMoon,
		AllThings = [],
		LastPlacedThing = {x: 0, width:0}

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
	TheGround.make()

	TheMoon = new Moon
	TheMoon.make()

	for (let i = 0; i < 100; i++) {
		let RandomNum = Number(random(0,2).toFixed(0))
		let NewThing = RandomCreation(RandomNum)
		AllThings.push(NewThing)
	}
}

function draw () {

	background("grey")

	TheMoon.draw()
	TheGround.draw()

	for (var i = 0; i < AllThings.length; i++) {
		let Thing = AllThings[i]

		Thing.position.x = Thing.startingX + TheGround.position.x

		if(Thing.position.x < windowWidth + 200 && Thing.position.x > -200) {
			Thing.draw()
		}
	}

	MoveMoonAndGround()

}

function Ground () {

	this.position = {}
	this.size = {}
	this.speed = 1

	this.draw = () => {

		fill("black")
		rect(this.position.x, this.position.y, this.size.w, this.size.h)
	}

	this.make = () => {

		this.size = {
			w: 10000,
			h: 50
		}
		this.position = {
			x: 0,
			y: windowHeight - TheGround.size.h
		}
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
			w: this.TrunkSize.w + random(10, 30),
			h: random( this.TrunkSize.h * 2 , this.TrunkSize.h * 5),
		}

		let SpaceBetween = random(LastPlacedThing.width + 10,  200)

		this.startingX = LastPlacedThing.x += SpaceBetween

		LastPlacedThing.width = this.TrunkSize.w

		this.position.y = windowHeight - (TheGround.size.h + this.TrunkSize.h)
	}
}

function SimpleHouse () {

	this.startingX = 0
	this.position = {}
	this.BaseSize = {}
	this.RoofSize = {}
	this.Door = {}
	this.windows = {}

	this.draw = () => {

		//Base
		push()
		fill("black")
		rect(this.position.x, this.position.y, this.BaseSize.w, this.BaseSize.h)
		pop()

		//Roof
		push()
		fill("black")
		triangle(
			this.position.x - this.RoofSize.w, this.position.y,
			this.position.x + (this.BaseSize.w/2), this.position.y - this.RoofSize.h,
			this.position.x + this.BaseSize.w + this.RoofSize.w, this.position.y
		)
		pop()

		drawDoor()
		drawWindows()

	}

	const drawDoor = () => {

		let DoorPosition = {
			x: (this.position.x + (this.BaseSize.w / 2)) - (this.Door.w / 2),
			y:	(this.position.y + this.BaseSize.h) - this.Door.h
		}
		//Door
		push()
		fill("grey")
		rect(
			DoorPosition.x,
			DoorPosition.y,
			this.Door.w,
			this.Door.h
		)
		pop()

		//Knob
		push()
		fill("black")
		ellipse(
			DoorPosition.x + (this.Door.w * .2),
			DoorPosition.y + (this.Door.h / 2),
			this.Door.NobRadius,
			this.Door.NobRadius
		)
		pop()
	}

	const drawWindows = () => {

		let WindowPositions = {
			x1: this.position.x + (this.BaseSize.w * .1),
			y1:	this.position.y + (this.BaseSize.h * .05),
			x2: this.position.x + (this.BaseSize.w * .65),
			y2:	this.position.y + (this.BaseSize.h * .05)
		}
		//window 1
		push()
		fill("grey")
		rect(
			WindowPositions.x1,
			WindowPositions.y1,
			this.windows.size,
			this.windows.size
		)
		pop()

			//window 2
			push()
			fill("grey")
			rect(
				WindowPositions.x2,
				WindowPositions.y2,
				this.windows.size,
				this.windows.size
			)
			pop()
	}

	this.make = () => {

		this.BaseSize.w = random(80, 150)
		this.BaseSize.h = random(this.BaseSize.w / 2, this.BaseSize.w + 20)

		this.RoofSize = {
			w: this.BaseSize.w * .25,
			h:  this.BaseSize.h * .7
		}

		this.Door = {
			w: this.BaseSize.w * .25,
			h: this.BaseSize.h * .45,
			NobRadius: 3
		}

		this.windows = {
			size: this.BaseSize.w * .25
		}

		let SpaceBetween = random(LastPlacedThing.width + 10,  300)

		this.startingX = LastPlacedThing.x += SpaceBetween
		// this.startingX = random(150, 200)

		LastPlacedThing.width = this.BaseSize.w

		this.position.y = windowHeight - (TheGround.size.h + this.BaseSize.h)
	}
}

function FireFlies () {

	this.startingX = 0
	this.position = { x: 0, y: 0}
	this.allPositions = []
	this.amount = random(3, 10)

	const move = (bug) => {

		let x, y
		x = this.position.x + Math.cos(bug.xangle) * bug.xradius
		y = this.position.y + Math.sin(bug.yangle) * bug.yradius

		bug.xangle += bug.xspeed
		bug.yangle += bug.yspeed

		bug.x = x
		bug.y = y
	}

	const changeOpacity = (bug) => {

		if(bug.color.a <= 0.1) {
			bug.lighting = true
		}
		else if (bug.color.a >= 1) {
			bug.lighting = false
		}

		if(!bug.lighting) {
			bug.color.a -= .005
		}
		else if (bug.lighting) {
			bug.color.a += .005
		}
	}

	this.draw = () => {

		for (var i = 0; i < this.allPositions.length; i++) {

			let bug = this.allPositions[i]

			move(bug)
			changeOpacity(bug)

			fill(`rgba(${bug.color.r}, ${bug.color.g}, ${bug.color.b}, ${bug.color.a})`)
			ellipse(bug.x, bug.y, bug.size, bug.size)
		}

	}

	this.make = () => {

		let SpaceBetween = random(LastPlacedThing.width + 10,  300)

		this.startingX = LastPlacedThing.x += SpaceBetween
		// this.startingX = random(200, 300)

		this.position.y = (windowHeight - TheGround.size.h) - 50

		for (let i = 0; i <= this.amount; i++) {

			let bug = {
				x: 0,
				y: 0,
				size: random(1.5, 5),
				xspeed: random(.01, .02),
				yspeed: random(.01, .02),
				lighting: true,
				color: {r: 242, g: 163, b: 44, a: random(0,1)},
				xangle: random(0, 360),
				yangle: random(0, 360),
				xradius: random(20, 200),
				yradius: random(20, 100),
			}

			this.allPositions.push(bug)
		}
	}
}

function Moon () {

	this.radius = 100
	this.position = {}

	this.draw = () => {

		noStroke()
		//moon
		push()
		fill("black")
		ellipse(
			this.position.x,
			this.position.y,
			this.radius,
			this.radius
		)
		pop()

		//shadow
		push()
		fill("grey")
		ellipse(
			this.position.x + 15,
			this.position.y + 5,
			this.radius,
			this.radius
		)
		pop()

	}

	this.make = () => {

		this.position = {
			x: 100,
			y: windowHeight
		}
	}
}

const RandomCreation = (Num) => {

	let NewThing

	switch (Num) {

		case 0:

		 	NewThing = new SimpleTree

			NewThing.make()

			return NewThing
		break;

		case 1:

		 	NewThing = new SimpleHouse

			NewThing.make()

			return NewThing
		break;

		case 2:

		 	NewThing = new FireFlies

			NewThing.make()

			return NewThing
		break;


	}
}

const MoveMoonAndGround = () => {

	TheGround.position.x -= TheGround.speed
	TheMoon.position.x += (TheGround.speed * .12)

	if(TheMoon.position.x > windowWidth/2) {
		TheMoon.position.y += (TheGround.speed * .12)
	}
	else {
		TheMoon.position.y -= (TheGround.speed * .12)
	}

	if(TheGround.position.x < (TheGround.size.w - windowWidth) * -1) {
		TheGround.position.x = 0
		TheMoon.make()
	}
}






//
