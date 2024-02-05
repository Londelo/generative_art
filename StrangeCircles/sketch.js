let lines = []
let circles = []

function setup () {
	// //find appropriate canvas width
	// canvas_size = windowWidth < windowHeight ? windowWidth : windowHeight
	// canvas_size -= 80

	createCanvas( windowWidth, windowHeight)

	// //set canvas in center
	// let margin_left = (windowWidth - canvas_size) / 2
	// $(".p5Canvas").css("margin-left", margin_left)
	// $(".p5Canvas").css("margin-top", 40)

	let num_circles = Number(random(1, 20).toFixed(0))
	for (let i = 0; i < num_circles; i++) {
		make_circle(i)
	}

	 let num_lines = Number(random(3, 1000).toFixed(0)),
	 c_id = 0,
	 temp_dir = true,
	 temp_weight = 0
	for (let i = 0; i < num_lines; i++) {

		let line = new theLine

		let split_num = Number((num_lines / 2).toFixed(0)),
				num_by_ran = Number((num_lines / random(2, 8)).toFixed(0))

		if(i % 3 === 0) {
			temp_dir = !temp_dir
			line.vec.spin_speed += i/10
		}

		let random_id_1 = Number(random(0, circles[c_id].length - 1).toFixed(0))
		let random_id_2 = Number(random(0, circles[c_id].length - 1).toFixed(0))
		let p1 = circles[c_id][ random_id_1 ]
		let p2 = circles[c_id][ random_id_2 ]

		line.vec.p1_id = random_id_1
		line.vec.x = p1.x
		line.vec.y = p1.y

		line.vec.p2_id = random_id_2
		line.vec.x1 = p2.x
		line.vec.y1 = p2.y

		line.vec.spin_direction = temp_dir
		line.circle_id = c_id
		line.weight += temp_weight

		if(i % num_by_ran === 0) {
			line.weight = 1.5
		}
		lines.push(line)
	}
}

function draw () {

	background("white")


	lines.forEach((lin) => {

		if (mouseIsPressed && frameCount % lin.vec.spin_speed === 0 ) {
			lin.spin()
		}
		colorMode(HSB);
		strokeWeight(lin.weight)
		stroke(lin.colr.h, lin.colr.s, lin.colr.b)
		line(lin.vec.x, lin.vec.y, lin.vec.x1, lin.vec.y1)
	})

	circles.forEach((points) => {
		points.forEach((point) => {
			fill("black")
			ellipse(point.x, point.y, 1, 1)
		})
	})

}


function theLine () {

	this.circle_id = 0

	this.weight = 0.2

	this.vec = {
		spin_direction: true,
		spin_speed: 1,
		p1_id: 0,
		x: 0,
		y: 0,
		p2_id: 0,
		x1: 0,
		y1: 0
	}

	this.colr = {
		h: 10,
		s: 62,
		b: 0
	}

	this.spin = () => {

		let p1_id, p2_id
		let ranNum = this.vec.spin_direction ? 1 : -1
		//check P1
		if ( this.vec.p1_id + ranNum >= 359 ) {
			p1_id =	0
		}
		else if ( this.vec.p1_id + ranNum <= 0 ) {
			p1_id =	359
		}
		else {
			p1_id = Number(this.vec.p1_id) + ranNum
		}
		//check P2
		if ( this.vec.p2_id + ranNum >= 359 ) {
			p2_id =	0
		}
		else if ( this.vec.p2_id + ranNum <= 0 ) {
			p2_id =	359
		}
		else {
			p2_id = Number(this.vec.p2_id) + ranNum
		}

		let p1 = circles[this.circle_id][ p1_id ]
		let p2 = circles[this.circle_id][ p2_id ]
		this.vec.p1_id = p1_id
		this.vec.x = p1.x
		this.vec.y = p1.y

		this.vec.p2_id = p2_id
		this.vec.x1 = p2.x
		this.vec.y1 = p2.y
	}
}

const make_circle = (i) => {

	// I got this from http://bl.ocks.org/bycoffe/3404776
	 let radius = random(100, 400),
			 num_points = 360,
			 angle,
			 x,
			 y,
			 points = []

	 for (let c = 0; c < num_points; c++) {

			angle = (c / (num_points / 2)) * Math.PI; // Calculate the angle at which the element will be placed.
																						// For a semicircle, we would use (i / num_points) * Math.PI.
			x = (radius * Math.cos(angle)) + (windowWidth/2); // Calculate the x position of the element.
			y = (radius * Math.sin(angle)) + (windowHeight/2); // Calculate the y position of the element.

			points.push({
				x: Number(x.toFixed(0)),
				y: Number(y.toFixed(0)),
			})

			if(c === num_points - 1) {
				circles.push([...points])
			}
	 }
}












//
