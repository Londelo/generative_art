var state

class makeState {

	constructor() {
		this.center_circle = { x: windowWidth/2, y: windowHeight/2, size: 125 } 
		this.circles = []
	}
}

function setup () {

	state = new makeState()

	createCanvas( windowWidth, windowHeight )
	noStroke()
}

function draw () {
	background("pink")

	drawCenterCircle()
}


function drawCenterCircle() {
	stroke("black")

	if(this.hasLife) {
		fill(`rgba(0,255,0, ${this.yearsOld})`)
	} else {
		fill("black")
	}
	circle(state.center_circle.x, state.center_circle.y, state.center_circle.size)
}
	
