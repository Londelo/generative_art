let TheGround,
		TheMidGround,
		TheBackGround,
		TheMoon,
		ForGround = [],
		MidGround = [],
		BackGround = [],
		LastPlacedThing = {x: 0, width:0},
		Enviorment


function setup () {

	// //find appropriate canvas width
	// canvas_size = windowWidth < windowHeight ? windowWidth : windowHeight
	// canvas_size -= 80

	createCanvas( windowWidth, windowHeight )

	// //set canvas in center
	// let margin_left = (windowWidth - canvas_size) / 2
	// $(".p5Canvas").css("margin-left", margin_left)
	// $(".p5Canvas").css("margin-top", 40)

	Enviorment = new Env

	TheGround = new Ground
	TheGround.basicSetUp(windowHeight)

	TheMidGround = new Ground
	TheMidGround.basicSetUp(windowHeight - 50, "mid")

	TheBackGround = new Ground
	TheBackGround.basicSetUp(windowHeight - 70, "back")

	TheMoon = new Moon
	TheMoon.basicSetUp()
	//
	MakeForGround()
	MakeMidGround()
	MakeBackGround()

}

function draw () {

	background("#7D7D7D")

	AddAndRemoveClouds()
	//
	// push()
	// fill("red")
	// ellipse(300, 30, 32, 32)
	// pop()
	//
	// push()
	// fill("red")
	// ellipse(300, windowHeight * .50, 30, 30)
	// pop()

	TheMoon.draw()

	TheBackGround.draw()
	DrawBackGround()

	Enviorment.CloudsInView = []
	TheMidGround.draw()
	DrawMidGround() //This Collects info on clouds in view

	TheGround.draw()
	DrawForGround() //This Collects info on clouds in view

	Enviorment.HandleWeather()
	Enviorment.GenerateClouds()
}


function Ground () {

	this.position = {}
	this.size = {
		w: 10000,
		h: 50
	}
	this.speed = 1
	this.color = "#2B2B2B"

	const move = () => {

		this.position.x -= this.speed

		if(this.position.x < (this.size.w - windowWidth) * -1) {
			this.position.x = 0
		}
	}

	this.draw = () => {
		move()

		fill(this.color)
		rect(this.position.x, this.position.y, this.size.w, this.size.h)
	}

	this.basicSetUp = (y, z) => {

			if(z === "mid") {
				this.color = "#303030"
			}
			else if(z === "back"){
				this.color = "#383838"
			}

		this.position = {
			x: 0,
			y: y - this.size.h
		}
	}
}

function SimpleTree () {

	this.type = "landThing"
	this.startingX = 0
	this.position = {x:0,y:0,z:"for"}
	this.TrunkSize = {w: 0, h: 0}
	this.BranchSize = {w: 0, h: 0}
	this.color = "#2B2B2B"

	this.draw = () => {

		let TempPosition = {x: this.position.x, y: this.position.y, w: this.BranchSize.w},
				TempSizes = {BW: this.BranchSize.w, BH: this.BranchSize.h}

		fill(this.color)

		//Trunk
		rect(this.position.x, this.position.y, this.TrunkSize.w, this.TrunkSize.h)

		//Branches
		triangle(
			this.position.x - this.BranchSize.w, this.position.y + 1,
			this.position.x + (this.TrunkSize.w/2), this.position.y - this.BranchSize.h,
			this.position.x + this.TrunkSize.w + this.BranchSize.w, this.position.y + 1
		)

		TempPosition.y -= TempSizes.BH / 2
		TempSizes.BW -= TempSizes.BW / 2

		triangle(
			TempPosition.x - TempSizes.BW, TempPosition.y,
			TempPosition.x + (this.TrunkSize.w/2), TempPosition.y - TempSizes.BH,
			TempPosition.x + this.TrunkSize.w + TempSizes.BW, TempPosition.y
		)

		TempPosition.y -= TempSizes.BH / 2
		TempSizes.BW -= TempSizes.BW / 2

		triangle(
			TempPosition.x - TempSizes.BW, TempPosition.y,
			TempPosition.x + (this.TrunkSize.w/2), TempPosition.y - TempSizes.BH,
			TempPosition.x + this.TrunkSize.w + TempSizes.BW, TempPosition.y
		)
	}

	this.basicSetUp = (Ground, z) => {

		if(z === "mid") {

			this.color = "#303030"
			this.TrunkSize = {
				w: random(5, 15),
				h: random(10, 20)
			}
		}
		else {

			this.TrunkSize = {
				w: random(15, 25),
				h: random(20, 30)
			}
		}

		this.BranchSize = {
			w: this.TrunkSize.w + random(5, 15),
			h: random( this.TrunkSize.h, this.TrunkSize.h * 3),
		}

		this.startingX = PickStartingPosition(
											this.TrunkSize.w,
											LastPlacedThing.width + 10,
											200
										)

		this.position.y = Ground.position.y - this.TrunkSize.h
	}
}

function SimpleHouse () {

	this.type = "landThing"

	this.startingX = 0
	this.position = {x:0,y:0,z:"for"}
	this.BaseSize = {}
	this.RoofSize = {}
	this.Door = {}
	this.windows = {}
	this.color = "#2B2B2B"

	this.draw = () => {

		fill(this.color)

		//Base
		push()
		rect(this.position.x, this.position.y, this.BaseSize.w, this.BaseSize.h)
		pop()

		//Roof
		push()
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

	this.basicSetUp = (Ground, z) => {

		if(z === "mid") {

			this.color = "#303030"
			this.BaseSize.w = random(50, 100)
			this.BaseSize.h = random(this.BaseSize.w / 2, this.BaseSize.w)
		}
		else {

			this.BaseSize.w = random(80, 150)
			this.BaseSize.h = random(this.BaseSize.w / 2, this.BaseSize.w + 20)
		}

		this.RoofSize = {
			w: this.BaseSize.w * .25,
			h:  this.BaseSize.h * .4
		}

		this.Door = {
			w: this.BaseSize.w * .25,
			h: this.BaseSize.h * .45,
			NobRadius: 3
		}

		this.windows = {
			size: this.BaseSize.w * .25
		}

		this.startingX = PickStartingPosition(
											this.BaseSize.w,
											LastPlacedThing.width + 10,
											300
										)

		this.position.y = Ground.position.y - this.BaseSize.h
	}
}

function SimpleMountain () {

		this.type = "landThing"
		this.NumOfAll = 0
		this.startingX = 0
		this.position = {x:0,y:0,z:"for"}
		this.size = {
			w: random(100, 200),
			h: random(50, 80)
		}
		this.color = "#383838"

	this.draw = () => {

		fill(this.color)

		triangle(
			this.position.x - (this.size.w / 2), this.position.y + 1,
			this.position.x, this.position.y - this.size.h,
			this.position.x + (this.size.w / 2), this.position.y + 1
		)
	}

	this.basicSetUp = (Ground) => {

		let SpaceBetween = random(LastPlacedThing.width * .6,  LastPlacedThing.width + 100)

		this.startingX = PickStartingPosition(
											this.size.w / 2,
											LastPlacedThing.width * .6,
											LastPlacedThing.width + 100
										)
		this.position.y = Ground.position.y
	}
}

function FireFlies () {

	this.type = "Fly"
	this.startingX = 0
	this.position = {x:0,y:0,z:"for"}
	this.allPositions = []
	this.amount = random(3, 8)

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

	this.basicSetUp = (Ground, z) => {

		this.startingX = PickStartingPosition(
											100,
											LastPlacedThing.width + 10,
											300
										)
		// this.startingX = random(200, 300)

		this.position.y = (windowHeight - Ground.size.h) - 20

		for (let i = 0; i <= this.amount; i++) {

			let bug = {
				x: 0,
				y: 0,
				xspeed: random(.01, .02),
				yspeed: random(.01, .02),
				lighting: true,
				color: {r: 242, g: 163, b: 44, a: random(0,1)},
				xangle: random(0, 360),
				yangle: random(0, 360),
				xradius: random(20, 200),
				yradius: random(20, 50),
			}

			if(z === "mid") {
				bug.size = random(1, 2)
			}
			else {
				bug.size = random(1.5, 4)
			}

			this.allPositions.push(bug)
		}
	}
}

function Moon () {

	this.radius	= 100
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
			this.basicSetUp()
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

	this.basicSetUp = () => {

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
	this.position = {
		x: 0,
		y: random( -30, windowHeight * .30),
		z: "for"
	}
	this.numOfPoofs = random(10,20)
	this.allPoofs = []
	this.color = `#2B2B2B`
	this.speed = random(0.2, 0.5)

	this.rainDrops = []
	this.snowFlakes = []
	this.wSize = random(1,3)

	this.move = (index) => {

		if (this.position.x < -200) {

			if(this.position.z === "for") {
				ForGround.splice(index, 1)
			}
			else {
				MidGround.splice(index, 1)
			}
		}
		this.position.x -= this.speed
	}

	this.draw = () => {

		for (let i = 0; i < this.allPoofs.length; i++) {

			let poof = this.allPoofs[i]

			fill(this.color)

			if(i === 0) {

				ellipse(this.position.x, this.position.y, poof.size, poof.size)
			}
			else {
				ellipse(this.position.x + poof.xOffSet , this.position.y + poof.yOffSet, poof.size, poof.size)
			}
		}
	}

	this.basicSetUp = (Ground, z) => {

		this.position.x =  windowWidth
		this.position.z = z === "for" ? "for" : "mid"

		// random(windowWidth + 100, windowWidth + 400)
		this.speed = z === "for" ? this.speed : this.speed - 0.1
		this.color = z === "for" ? this.color : "#303030"

		for (let i = 0; i <= this.numOfPoofs; i++) {

			let poof = {
						xOffSet: z === "for" ? random(-65, 65) : random(-55, 55),
						yOffSet: z === "for" ? random(30, 50) : random(20, 40),
						size: z === "for" ? random(50, 100) : random(30, 80)
					}

			this.allPoofs.push(poof)
		}
	}

	this.activateWeather = () => {

		if(Enviorment.weather === 1) {

			//make rain
			let drop = {
				xOffSet: random(-50, 50),
				yOffSet: random(20, 30),
				size: this.wSize
			}

			this.rainDrops.push(drop)

			MakeItRain()
		}
		else if (Enviorment.weather === 0) {

			//make snow
			let	RandomNum = Number(random(0,1).toFixed()),
					flake = {
						xOffSet: random(-50, 50),
						yOffSet: random(20, 30),
						size: this.wSize,
						counter: 0,
						floating: RandomNum === 1 ? true : false
					}

			this.snowFlakes.push(flake)

			MakeItSnow()
		}
		else {
			//slowly take out from the drops
			let takeOutNum = 2
			for (let c = 0; c < takeOutNum; c++) {

				if(this.rainDrops.length > 0) {
					let ranNum = Number(random( 0, this.rainDrops.length/2 ).toFixed())
					this.rainDrops.splice(ranNum, 1)
					MakeItRain()
				}
				if(this.snowFlakes.length > 0) {
					let ranNum = Number(random( 0, this.snowFlakes.length/2 ).toFixed())
					this.snowFlakes.splice(ranNum, 1)
					MakeItSnow()
				}
			}
		}
	}

	const MakeItSnow = () => {

		fill('white')
		//make it snow
			for (let i = 0; i < this.snowFlakes.length; i++) {
				let flake = this.snowFlakes[i]

				//If in view
				if(this.position.y + flake.yOffSet < windowHeight) {

					if(flake.counter === 20) {
						flake.counter = 0
						flake.floating = !flake.floating
					}
					else if(flake.floating === true) {
						flake.counter += 1
						flake.xOffSet += this.speed - (this.speed * .6)
					}
					else if(flake.floating === false) {
						flake.counter += 1
						flake.xOffSet -= this.speed - (this.speed * .6)
					}

					flake.xOffSet -= this.speed - (this.speed * .8)
					flake.yOffSet += Enviorment.Gravity

					ellipse(this.position.x - flake.xOffSet, this.position.y + flake.yOffSet, flake.size, flake.size)
				}
				else {
					this.snowFlakes.splice(i, 1)
				}
			}
	}

	const MakeItRain = () => {

		fill('black')
		//make it rain
		for (let i = 0; i < this.rainDrops.length; i++) {

			let drop = this.rainDrops[i]

			//If in view
			if(this.position.y + drop.yOffSet < windowHeight) {

				drop.xOffSet -= this.speed / 2
				drop.yOffSet += Enviorment.Gravity

				ellipse(this.position.x - drop.xOffSet, this.position.y + drop.yOffSet, drop.size, drop.size)
			}
			else {
				this.rainDrops.splice(i, 1)
			}
		}
	}
}

function Env () {

	this.Gravity = 1
	this.CloudsInView = []
	this.CloudTimer = 100
	this.CloudWeight = 0
	this.weather = 2 // 0=rain, 1=snow, 2=off

	this.HandleWeather = () => {

		console.log(this.CloudsInView.length, this.weather);

		if(this.CloudsInView.length >= 6 && this.weather === 2) {
			this.weather = Number(random(0,1).toFixed())
			this.CloudWeight = 0
		}
		else if (this.CloudsInView.length < 6){
			this.weather = 2
		}
	}

	this.GenerateClouds = () => {

		this.CloudTimer -= 1

		console.log(this.CloudTimer, this.CloudWeight.toFixed());

		if(this.CloudTimer === 0) {

			this.CloudTimer = Number(random(500,1200 - this.CloudWeight).toFixed())
			this.CloudWeight += random(20, 50)

			let RanNum = Number(random(0,1).toFixed()),
					NewCloud = new Cloud

			if(RanNum === 1) {
				NewCloud.basicSetUp(TheGround, "for")
				ForGround.unshift(NewCloud)
			}
			else {
				NewCloud.basicSetUp(TheMidGround, "mid")
				MidGround.push(NewCloud)
			}
		}
	}
}


const RandomLandCreation = (Num) => {

	let NewThing

	switch (Num) {

		case 0:

		 	NewThing = new SimpleTree
			return NewThing
		break;

		case 1:

		 	NewThing = new SimpleHouse
			return NewThing
		break;

		case 2:

		 	NewThing = new FireFlies
			return NewThing
		break;

	}
}

const PickStartingPosition = (width, least, most) => {

	let SpaceBetween = random(least,  most)

	LastPlacedThing.width = width
	LastPlacedThing.x += SpaceBetween

	return LastPlacedThing.x
	// return random(150, 200)
}


const MakeClouds = (least, most, ground, z) => {

	LastPlacedThing.x = 0

	let NumOfClouds = random(least, most),
			SomeClouds = []

	for (let i = 0; i < NumOfClouds; i++) {
		let NewCloud = new Cloud
		NewCloud.basicSetUp(ground, z)
		NewCloud.position.x = random(100, windowWidth - 100)
		SomeClouds.push(NewCloud)
	}

	return SomeClouds
}

const MakeLandThings = (ground, z) => {

	LastPlacedThing.x = 0

	let SomeThings = []

	while (LastPlacedThing.x < ground.size.w - 200) {
		let RandomNum = Number(random(0,2).toFixed(0))
		let NewThing = RandomLandCreation(RandomNum)
		NewThing.basicSetUp(ground, z)
		SomeThings.push(NewThing)
	}

	return SomeThings
}

const MakeMountains = (ground, z) => {

	LastPlacedThing.x = 0

	let SomeMoutains = []

	while (LastPlacedThing.x < ground.size.w - 200) {
		let NewMountain = new SimpleMountain
		NewMountain.basicSetUp(ground, z)
		SomeMoutains.push(NewMountain)
	}
	return SomeMoutains
}


const MakeForGround = () => {

	let Clouds = MakeClouds(1, 3, TheGround, "for"),
			LandThings = MakeLandThings(TheGround, "for")

	ForGround = LandThings.concat(Clouds)
}

const MakeMidGround = () => {

		let Clouds = MakeClouds(1, 2, TheMidGround, "mid"),
				LandThings = MakeLandThings(TheMidGround, "mid")

		MidGround = LandThings.concat(Clouds)
}

const MakeBackGround = () => {

	let Mountains = MakeMountains(TheBackGround, "back")

	BackGround = Mountains
}


const DrawForGround = () => {

	for (let i = 0; i < ForGround.length; i++) {

		let Thing = ForGround[i]

		if(Thing.type === "Cloud") {

			Thing.move(i)

			if(Thing.position.x < windowWidth + 200 && Thing.position.x > -200) {

				Enviorment.CloudsInView.push(Thing)
				Thing.activateWeather()
				Thing.draw()
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

const DrawMidGround = () => {

	for (let i = 0; i < MidGround.length; i++) {

		let Thing = MidGround[i]

		if(Thing.type === "Cloud") {

			Thing.move(i)

			if(Thing.position.x < windowWidth + 200 && Thing.position.x > -200) {

				Enviorment.CloudsInView.push(Thing)
				Thing.activateWeather()
				Thing.draw()
			}
		}
		else {

			Thing.position.x = Thing.startingX + TheMidGround.position.x

			if(Thing.position.x < windowWidth + 200 && Thing.position.x > -200) {
				Thing.draw()
			}
		}
	}
}

const DrawBackGround = () => {

	for (let i = 0; i < BackGround.length; i++) {

		let Thing = BackGround[i]

		Thing.position.x = Thing.startingX + TheBackGround.position.x

		if(Thing.position.x < windowWidth + 200 && Thing.position.x > -200) {
			Thing.draw()
		}
	}
}


const AddAndRemoveClouds = () => {

	let Clouds = [], NotClouds = []

	if(key === "a"){

		for (let i = 0; i < ForGround.length; i++) {
			let Thing = ForGround[i]

			if(Thing.position.x < windowWidth + 200 && Thing.position.x > -200) {

				if(Thing.type === "Cloud") {
					Clouds.push(Thing)
				}
				else {
					NotClouds.push(Thing)
				}
			}
		}

		Clouds.splice(Number(random(0,Clouds.length).toFixed()), 1)

		ForGround = NotClouds.concat(Clouds)
	}

	if(key === "d"){

		for (let i = 0; i < ForGround.length; i++) {
			let Thing = ForGround[i]
			if(Thing.position.x < windowWidth + 200 && Thing.position.x > -200) {

				if(Thing.type === "Cloud") {
					Clouds.push(Thing)
				}
				else {
					NotClouds.push(Thing)
				}
			}
		}

		let ranNum = Number(random(0,Clouds.length - 1).toFixed()), copiedCloud = Clouds[ranNum], newCloud = new Cloud
		newCloud.basicSetUp(TheGround)
		newCloud.position.x = copiedCloud.position.x + 50
		Clouds.push(newCloud)

		ForGround = NotClouds.concat(Clouds)
	}

}






//
