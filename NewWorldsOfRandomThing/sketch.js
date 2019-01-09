let TheGround

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
		w: 1000,
		h: 100
	}
	TheGround.position = {
		x: 0,
		y: windowHeight - TheGround.size.h
	}
}


function draw () {

	background("grey")

	console.log(keyCode);
	TheGround.draw()

	if(keyCode === 100) {
		console.log("hit");
		TheGround.position.x += TheGround.speed
	}
	if(keyCode === 97) {
		TheGround.position.x -= TheGround.speed
	}

}

function ground () {

	this.postion = {}
	this.size = {}
	this.speed = 5

	this.draw = () => {

		fill("black")
		rect(this.position.x, this.position.y, this.size.w, this.size.h)
	}
}






//
