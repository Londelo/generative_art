
let color = ["#5B0B4C", "#482255", "#2F3C5E", "#1A5567", "#007170"]
let cycleLimit = 100
let squares = []
let rect_info = {}
let window_width = ""
let window_width_arr = []
let width_params = 100
let program_running = false

function setup () {

	window_width = windowWidth

	for (let i = 0; i <= windowWidth; i++) {
		window_width_arr.push(i)
	}

	createCanvas( windowWidth, windowHeight)

	background(69, 67, 75)
}

function draw () {


	//Things in slowMow
	if(frameCount % 2 === 0){

		if (window_width_arr.length >= 10 && !program_running) {
			// cycleLimit--
			start_makeing_squares()
		}
	}
	//----------------

}

function display_square (x, i, width) {

	let height = Math.floor( random(40, 550) ),
			y = windowHeight - height

	if(width < 3) {
		program_running = false
		return
	}

	window_width_arr.splice(i, width)
	console.log(random(0, color.length).toFixed(0));
	fill(`${color[random(0, color.length - 1).toFixed(0)]}`)
	noStroke()
	rect(x, y, width, height)

	program_running = false
}

function start_makeing_squares () {

	program_running = true

	let max_width = Math.floor( random(10, 65) ),
			x_index = Math.floor( random(0, window_width_arr.length) ),
			x = window_width_arr[x_index]


	//look right from the bottom left corner
	for (let i = 0; i <= max_width; i++) {

		// if the position in the arr is not the same as its actual position
		// or if the postion is out side the screen then move the postion to the right
		if(window_width_arr[x_index - 2] !== x - 2 || x - 1 < 0) {
			x += 1
			x_index += 1
		}

		// if the position in the arr is not the same as its actual position
		// or if the postion is out side the screen then make it smaller by two point pixels
		if(window_width_arr[x_index + i] !== x + i || x + i > windowWidth) {
			max_width = i - 2
			display_square(x, x_index, max_width)
		}

		//done looking left
		if(i === max_width) {

			display_square(x, x_index, max_width)
		}
	}

}

function mouseClicked () {
noLoop()
}
