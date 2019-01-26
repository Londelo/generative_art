let TheGround,
		TheMoon,
		AllThings = [],
		AllClouds = [],
		LastPlacedThing = {x: 0, width:0},
		Physics = {
			gravity: 1
		}

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

	MakeLandThings()
	MakeClouds()
}

function draw () {

	background("#7D7D7D")

	// push()
	// fill("red")
	// ellipse(300, windowHeight - (windowHeight * .85), 30, 30)
	// pop()
	//
	// push()
	// fill("red")
	// ellipse(300, windowHeight - (windowHeight * .28), 30, 30)
	// pop()

	TheMoon.draw()
	DrawAllThings()
	TheGround.draw()

}

function Ground () {

	this.position = {}
	this.size = {}
	this.speed = 1

	const move = () => {

		this.position.x -= this.speed

		if(this.position.x < (this.size.w - windowWidth) * -1) {
			this.position.x = 0
		}
	}

	this.draw = () => {

		move()

		fill("#2B2B2B")
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
	this.TrunkSize = {
		w: random(15, 25),
		h: random(20, 30)
	}
	this.BranchSize = {
		w: this.TrunkSize.w + random(5, 15),
		h: random( this.TrunkSize.h, this.TrunkSize.h * 3),
	}

	this.draw = () => {

		let TempPosition = {x: this.position.x, y: this.position.y, w: this.BranchSize.w},
				TempSizes = {BW: this.BranchSize.w, BH: this.BranchSize.h}

		push()
		fill("#2B2B2B")
		rect(this.position.x, this.position.y, this.TrunkSize.w, this.TrunkSize.h)
		pop()

		push()
		fill("#2B2B2B")
		triangle(
			this.position.x - this.BranchSize.w, this.position.y + 1,
			this.position.x + (this.TrunkSize.w/2), this.position.y - this.BranchSize.h,
			this.position.x + this.TrunkSize.w + this.BranchSize.w, this.position.y + 1
		)
		pop()

		TempPosition.y -= TempSizes.BH / 2
		TempSizes.BW -= TempSizes.BW / 2
		push()
		fill("#2B2B2B")
		triangle(
			TempPosition.x - TempSizes.BW, TempPosition.y,
			TempPosition.x + (this.TrunkSize.w/2), TempPosition.y - TempSizes.BH,
			TempPosition.x + this.TrunkSize.w + TempSizes.BW, TempPosition.y
		)
		pop()

		TempPosition.y -= TempSizes.BH / 2
		TempSizes.BW -= TempSizes.BW / 2
		push()
		fill("#2B2B2B")
		triangle(
			TempPosition.x - TempSizes.BW, TempPosition.y,
			TempPosition.x + (this.TrunkSize.w/2), TempPosition.y - TempSizes.BH,
			TempPosition.x + this.TrunkSize.w + TempSizes.BW, TempPosition.y
		)
		pop()
	}

	this.make = () => {

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
		fill("#2B2B2B")
		rect(this.position.x, this.position.y, this.BaseSize.w, this.BaseSize.h)
		pop()

		//Roof
		push()
		fill("#2B2B2B")
		triangle(
			this.position.x - this.RoofSize.w, this.position.y + 1,
			this.position.x + (this.BaseSize.w/2), this.position.y - this.RoofSize.h,
			this.position.x + this.BaseSize.w + this.RoofSize.w, this.position.y + 1
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

		for (let i = 0; i < this.allPositions.length; i++) {

			let bug = this.allPositions[i]

			move(bug)
			changeOpacity(bug)

			fill(`rgba(${bug.color.r}, ${bug.color.g}, ${bug.color.b}, ${bug.color.a})`)
			ellipse(bug.x, bug.y, bug.size, bug.size)
		}

	}

	this.make = () => {

		let SpaceBetween = random(LastPlacedThing.width + 10,  300)

		this.startingX = LastPlacedThing.x +=  SpaceBetween
		// this.startingX = random(200, 300)

		this.position.y = (windowHeight - TheGround.size.h) - 20

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
				yradius: random(20, 50),
			}

			this.allPositions.push(bug)
		}
	}
}

function Moon () {

	this.radius = 100
	this.position = {}
	this.shadow = {}
	this.angle = 600
	this.xradius = 0
	this.yradius = 0
	this.speed = .001

	const move = () => {

		let x, y
		x = (windowWidth/2) + Math.cos(this.angle) * this.xradius
		y = (windowHeight) + Math.sin(this.angle) * this.yradius

		this.angle += this.speed

		this.position.x = x
		this.position.y = y

		// if it goes below the ground
		if(this.position.y > windowHeight + (this.yradius/2)) {
			this.angle = 600
			this.make()
		}
	}

	this.draw = () => {

		move()

		noStroke()
		//moon
		push()
		fill("#2B2B2B")
		ellipse(
			this.position.x,
			this.position.y,
			this.radius,
			this.radius
		)
		pop()

		//shadow
		push()
		fill("#7D7D7D")
		ellipse(
			this.position.x + this.shadow.x,
			this.position.y + this.shadow.y,
			this.radius,
			this.radius
		)
		pop()

	}

	this.make = () => {

		this.shadow = {
			x: random(10, 100),
			y: random(3, 15)
		}
										// 	This is 30% the width - 50% of width
		this.xradius = random(windowWidth - (windowWidth * .7), windowWidth - (windowWidth * .4))
		// 								// 	This is 40% the width - 60% of width
		this.yradius = random(windowHeight - (windowHeight * .6), windowHeight - (windowHeight * .4))
	}
}

function Cloud () {

	this.type = "Cloud"
	this.position = { x: random(0, TheGround.size.w), y: random(
		windowHeight - (windowHeight * .85),
		windowHeight - (windowHeight * .30)
	)}
	this.numOfPoofs = random(10,20)
	this.allPoofs = []
	this.speed = random(0.2, 0.8)

	this.weather = 0
	// Number(random(0,1).toFixed())
	this.weatherVolume = random(10000, 30000)
	this.rainDrops = []
	this.snowFlakes = []
	this.volumeVisible = 0

	this.move = () => {
		this.position.x -= this.speed
	}

	this.draw = () => {

		for (let i = 0; i < this.allPoofs.length; i++) {

			let poof = this.allPoofs[i]

			fill(`#363636`)

			if(i === 0) {
				ellipse(this.position.x, this.position.y, poof.size, poof.size)
			}
			else {
				ellipse(this.position.x + poof.xOffSet , this.position.y + poof.yOffSet, poof.size, poof.size)
			}
		}
	}

	this.make = () => {

		let size = random(.5, 3)
		for (let i = 0; i <= this.weatherVolume; i++) {

			//Make poofs for clouds
			if(i <= this.numOfPoofs) {

				let poof = {
							xOffSet: random(-80, 80),
							yOffSet: random(20, 50),
							size: random(80, 120)
						}

				this.allPoofs.push(poof)
			}

			//Make weather
			if(this.weather === 1) {
				//make rain
				let drop = {
					xOffSet: random(-80, 80),
					yOffSet: random(20, 30),
					size: size
				}

				this.rainDrops.push(drop)
			}
			else if (this.weather === 0) {
				//make snow
				let	RandomNum = Number(random(0,1).toFixed()),
						flake = {
						xOffSet: random(-80, 80),
						yOffSet: random(20, 30),
						size: size,
						counter: 0,
						floating: RandomNum === 1 ? true : false
					}

				this.snowFlakes.push(flake)
			}

		}
	}

	this.activateWeather = () => {

		if(this.weather === 1) {

			fill('black')

			if(this.volumeVisible <= this.rainDrops.length - 11) {
				this.volumeVisible += 1
			}

			//make it rain
			for (let i = 0; i < this.volumeVisible; i++) {
				let drop = this.rainDrops[i]

				if(this.position.y + drop.yOffSet < windowHeight) {

					drop.xOffSet -= this.speed / 2
					drop.yOffSet += Physics.gravity

					ellipse(this.position.x - drop.xOffSet, this.position.y + drop.yOffSet, drop.size, drop.size)
				}
			}
		}
		else if (this.weather === 0) {

			fill('white')


			if(this.volumeVisible <= this.snowFlakes.length - 11) {
				this.volumeVisible += 1
			}

			//make it snow
				for (let i = 0; i < this.volumeVisible; i++) {
					let flake = this.snowFlakes[i]

					if(this.position.y + flake.yOffSet < windowHeight) {

						if(flake.counter === 30) {
							flake.counter = 0
							flake.floating = !flake.floating
						}
						else if(flake.floating === true) {
							flake.counter += 1
							flake.xOffSet += this.speed - (this.speed * .3)
						}
						else if(flake.floating === false) {
							flake.counter += 1
							flake.xOffSet -= this.speed - (this.speed * .3)
						}

						flake.xOffSet -= this.speed - (this.speed * .8)
						flake.yOffSet += Physics.gravity

						ellipse(this.position.x - flake.xOffSet, this.position.y + flake.yOffSet, flake.size, flake.size)
					}
				}
		}
	}
}

const MakeClouds = () => {

	let NumOfClouds = random(50, 100)

	for (let i = 0; i < NumOfClouds; i++) {
		let NewCloud = new Cloud
		NewCloud.make()
		AllThings.push(NewCloud)
	}
}

const MakeLandThings = () => {

	let NumOfThings = 1000

	for (let i = 0; i < NumOfThings; i++) {
		let RandomNum = Number(random(0,2).toFixed(0))
		let NewThing = RandomCreation(RandomNum)
		AllThings.push(NewThing)
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

const DrawAllThings = () => {

	for (let i = 0; i < AllThings.length; i++) {
		let Thing = AllThings[i]

		if( Thing.type ) {
			if( Thing.type === "Cloud") {

				Thing.move()

				if(Thing.position.x < windowWidth + 200 && Thing.position.x > -200) {
					Thing.activateWeather()
					Thing.draw()
				}
			}
		}
		else {

			Thing.position.x = Thing.startingX + TheGround.position.x

			if(Thing.position.x < windowWidth + 200 && Thing.position.x > -200) {
				Thing.draw()
			}
		}
	}
}






//
