var state
class makeState {

	constructor() {
		this.center_circle = new makeCenterCircle()
		this.renderedItems = [ this.center_circle, new makeCircle() ]
	}

	isClose(point1, point2, gap) {
		let distance = this.getDistance(point1, point2)
		// console.log(distance)
		if(distance > gap) {
			return false
		}
		return true
	}

	getDistance(point1, point2) {
		let x = point2.x - point1.x
		let y = point2.y - point1.y
		return Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2)).toFixed(0)
	}
}

function setup () {

	state = new makeState()
	
	makeCircles(1000)

	createCanvas( windowWidth, windowHeight )
	noStroke()
}

function draw () {
	background("pink")
	render()
}

function render() {
	for (let index = 0; index < state.renderedItems.length; index++) {
		const item = state.renderedItems[index];
		item.draw()
	}
}

class makeCenterCircle {
	
	constructor() {
		this.x = windowWidth/2
		this.y = windowHeight/2
		this.size = random(50, 200).toFixed(0)
		this.color = "black"
	}

	draw() {
		fill(this.color)
		circle(this.x, this.y, this.size)
	}
}

class makeCircle {
	
	constructor() {
		this.x = windowWidth/2
		this.y = windowHeight/2
		this.size = 20
		this.color = "black"
		this.speed = random(5,50)
		this.angle = 0
		this.target_location = { x: random(0, windowWidth), y: random(0, windowHeight) }
	}

	draw() {
		this.x = this.x
		this.y = this.y

		fill(this.color)
		circle(this.x, this.y, this.size)
		this.move()

		// this.drawTarget()
	}

	drawTarget() {
		fill("red")
		circle(this.target_location.x, this.target_location.y, this.size)
	}

	move() {

		if(!state.isClose(this, this.target_location, this.speed)) {
			let x1, y1, distance

			x1 =  this.target_location.x - this.x
			y1 = this.target_location.y - this.y

			distance = Math.sqrt(x1*x1 + y1*y1)
			x1 /= distance
			y1 /= distance

			this.x += x1 * this.speed
			this.y +=	y1 * this.speed
		}

	}
}

function makeCircles(amount) {
	for (let index = 0; index < amount; index++) {
		const circle = new makeCircle()
		state.renderedItems.push(circle)
	}
}

