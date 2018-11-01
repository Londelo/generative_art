const state = {
	all_particles : [],

}

function particle (x, y, size, color, amount) {

	for (let i = 0; i < amount; i++) {
		state.all_particles.push({x, y, size, color})
	}
	console.log(state.all_particles);

	this.draw() {

	}

}

function setup () {

	//find appropriate canvas width
	canvas_size = windowWidth < windowHeight ? windowWidth : windowHeight
	canvas_size -= 100

	background("grey")

	createCanvas( canvas_size, canvas_size)

	//set canvas ins center
	let margin_left = (windowWidth - canvas_size) / 2
	$(".p5Canvas").css("margin-left", margin_left)
	$(".p5Canvas").css("margin-top", 40)

	particle(random(0, windowWidth), random(0, windowHeight), 100, {r:145, g:145, b:145}, 10)

}

function draw () {

}





// end
