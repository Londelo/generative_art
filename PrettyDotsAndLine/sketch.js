let position = {x: 10, y: 10}
let up_or_right = "right"
let steps_up = 20
let steps_right = 20
let canvas_size
let all_circle = []
let reDraw = false
let reDrawing = false
let mouse_position = {}

function setup () {

	// //find appropriate canvas width
	// canvas_size = windowWidth < windowHeight ? windowWidth : windowHeight
	// canvas_size -= 80

	createCanvas( windowWidth, windowHeight)

	// //set canvas ins center
	// let margin_left = (windowWidth - canvas_size) / 2
	// $(".p5Canvas").css("margin-left", margin_left)
	// $(".p5Canvas").css("margin-top", 40)

	background("#43454B")
	stroke("#323234")

	//create all circles
	while(position.y < windowHeight) {
		circle_baby()
	}
}

function draw (circle, color) {

	check_mouse_position()

	if(reDraw && !reDrawing){

		reDrawing = true

		background("light-grey")

		for (let i = 0, cir_len = all_circle.length; i < cir_len; i++) {

			let circle = all_circle[i]

			circle.size = floor(random(0, 20))

			fill("black")
			ellipse(circle.x, circle.y, circle.size, circle.size)

			if(i === all_circle.length - 1) {
				reDraw = false
				reDrawing = false
			}
		}
	}
}

function circle_baby () {

	if(up_or_right === "up") {

		//set new position
		position.y += steps_up
		position.x = 20

		//set random size
		let size = floor(random(0, 20))

		//display circle
		fill("#3A3E41")
		ellipse(position.x, position.y, size, size)
		//save circle info
		all_circle.push({x: position.x, y: position.y, size})

		//set up for next circle
		up_or_right = "right"
		position.x += steps_right
	}
	else if(up_or_right === "right") {

		//catch if it has gone to far right
		if(position.x >= windowWidth){
			up_or_right = "up"
			return
		}

		//set random size
		let size = floor(random(0, 20))

		//display circle
		fill("#3A3E41")
		ellipse(position.x, position.y, size, size);

		//save circle info
		all_circle.push({x: position.x, y: position.y, size})

		//set up for next circle
		position.x += steps_right
	}

}

function get_mouse_area () {

	let done_yet = false

	//from the center this will look 6 pixels in each direction
	let steps_one_way = 30
	let area = (steps_one_way * 2) * (steps_one_way * 2)

	//this starts at the bot left corner
	let currently_scanning = {x:floor(mouse_position.x - steps_one_way), y:floor(mouse_position.y - steps_one_way)}
	let top_of_square = currently_scanning.y + (steps_one_way * 2)
	let mouse_positions_around = []
	let scanning_direction = "up"

	for (let i = 1; i <= area; i++) {

		if(currently_scanning.y === top_of_square) {
			//move right and save
			currently_scanning.y -= steps_one_way * 2 // reset y
			currently_scanning.x += 1 // move right
			mouse_positions_around.push(`${currently_scanning.x} ${currently_scanning.y}`)
		}
		else {
			//move up one and save
			currently_scanning.y += 1
			mouse_positions_around.push(`${currently_scanning.x} ${currently_scanning.y}`)
		}

		if(i === area){
			done_yet= true
		}
	}

	if (done_yet) {
		return mouse_positions_around
	}
}

function check_mouse_position () {

	let old_mouse_position = mouse_position
	mouse_position = {x:mouseX, y:mouseY}

	let mouse_area = []
	mouse_area = get_mouse_area ()

	if(mouse_area.length > 0) {

		for (let i = 0, cir_len = all_circle.length; i < cir_len; i++) {

			let circle = all_circle[i]

			if(mouse_area.includes(`${circle.x} ${circle.y}`)) {
				noStroke()
				fill(random(0, 230), random(0, 230), random(0, 230))
				ellipse(circle.x, circle.y, circle.size, circle.size)
			}
		}
	}
}

function mouseClicked () {
	reDraw = true
}
