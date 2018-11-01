
let flies = []
let moving = false
let v
let last_position = {}, rotation
function setup () {

	// //find appropriate canvas width
	// canvas_size = windowWidth < windowHeight ? windowWidth : windowHeight
	// canvas_size -= 80

	createCanvas( windowWidth, windowHeight)

	// //set canvas in center
	// let margin_left = (windowWidth - canvas_size) / 2
	// $(".p5Canvas").css("margin-left", margin_left)
	// $(".p5Canvas").css("margin-top", 40)

	background("#43454B")
	noStroke()

	for (let i = 0; i < 1; i++) {
		let FireFly = new fireFly
		flies.push(FireFly)
	}

 ellipseMode(CENTER)
}

function draw () {

	background("#43454B")

	flies.forEach((flie,) => {

		fill('purple')
		ellipse(
			flie.the_heading.x,
			flie.the_heading.y,
			20,
			20
		)

		flie.fly_pieces.forEach((piece, i) => {

			//make wings
			if(i === 1) {
				flie.wings.forEach((wing, c) => {

					let radius = piece.size + 20,
							// rotation,
			 				angle,
			 			 	x,
			 			 	y

					x = (radius * Math.cos(angle)) + piece.x
					y = (radius * Math.sin(angle)) + piece.y

					angle = (c / (flie.wings.length / 2)) * Math.PI;
					rotation = atan2(flie.fly_pieces[0].y - y, flie.fly_pieces[0].x - x)

					push()

					rotate(rotation)
					x = (radius * Math.cos(angle)) + piece.x
					y = (radius * Math.sin(angle)) + piece.y
					fill('grey')
					ellipse(
						x,
						y,
						wing.width,
						wing.height
					)
					pop()

					fill('red')
					ellipse(
						x,
						y,
						10,
						10
					)
				})
			}

			if(piece.id === "head") {

				let x1, y1, distance

				x1 =  flie.the_heading.x - piece.x
				y1 = flie.the_heading.y - piece.y

				distance = Math.sqrt(x1*x1 + y1*y1)
				x1 /= distance
				y1 /= distance

				piece.x += x1 * flie.speed
				piece.y +=	y1 * flie.speed


				fill('green')
				ellipse(
					piece.x,
					piece.y,
					piece.size,
					piece.size
				)

				//if we reach out destination
				if(distance < 10) {

					flie.the_heading = {
						x: random(flie.fly_piece_size, windowWidth - flie.fly_piece_size),
						y: random(flie.fly_piece_size, windowHeight - flie.fly_piece_size)
					}
				}

			}
			else {
				// console.log(piece, i, "HIT");

				let x1, y1, distance

				x1 =  flie.fly_pieces[i - 1].x - piece.x
				y1 = flie.fly_pieces[i - 1].y - piece.y

				distance = Math.sqrt(x1*x1 + y1*y1)

				if(distance > flie.fly_pieces[i - 1].size + 3) {

					x1 /= distance
					y1 /= distance

					piece.x += x1 * flie.speed
					piece.y +=	y1 * flie.speed
				}

				fill('green')
				ellipse(
					piece.x,
					piece.y,
					piece.size,
					piece.size
				)
			}


		})
	})

	translate(50, 50);
	rotate(rotation)
	ellipse(0, 0, 50, 20);
}

function fireFly() {

	this.fly_length = 8
	this.fly_piece_size = 55
	this.head_position = {
		x: random(this.fly_piece_size, windowWidth - this.fly_piece_size),
		y: random(this.fly_piece_size, windowHeight - this.fly_piece_size)
	}
	this.fly_pieces = []
	this.wings = []
	this.the_heading = {
		x: random(this.fly_piece_size, windowWidth - this.fly_piece_size),
		y: random(this.fly_piece_size, windowHeight - this.fly_piece_size)
	}
	this.speed = 2.5

	let make = () => {

		for (let i = 0; i < this.fly_length; i++) {

			//the head
			if(i === 0) {

				this.fly_pieces.push({
					id: "head",
					x: Number(this.head_position.x.toFixed(0)),
					y: Number(this.head_position.y.toFixed(0)),
					size: this.fly_piece_size
				})
			}
			else if(i === 1) {

				this.head_position.y += this.fly_piece_size
				this.fly_piece_size -= (this.fly_piece_size - 7) < 3 ? 0 : 7

				this.fly_pieces.push({
					id: i,
					x: Number(this.head_position.x.toFixed(0)),
					y: Number(this.head_position.y.toFixed(0)),
					size: this.fly_piece_size
				})

				makeWings()
			}
			//the tail
			else {

				this.head_position.y += this.fly_piece_size
				this.fly_piece_size -= (this.fly_piece_size - 7) < 3 ? 0 : 7

				this.fly_pieces.push({
					id: i,
					x: Number(this.head_position.x.toFixed(0)),
					y: Number(this.head_position.y.toFixed(0)),
					size: this.fly_piece_size})
			}
		}
	}

	let makeWings = () => {

		// I got this from http://bl.ocks.org/bycoffe/3404776
		 let radius = this.fly_piece_size + 20,
				 num_wings = 2,
				 width = this.fly_piece_size + 25,
				 height = this.fly_piece_size - 25,
				 angle,
				 x,
				 y;

		 for (let c = 0; c < num_wings; c++) {

				angle = (c / (num_wings / 2)) * Math.PI; // Calculate the angle at which the element will be placed.
																							// For a semicircle, we would use (i / num_wings) * Math.PI.
				x = (radius * Math.cos(angle)) + (this.head_position.x); // Calculate the x position of the element.
				y = (radius * Math.sin(angle)) + (this.head_position.y); // Calculate the y position of the element.

				this.wings.push({
					x: Number(x.toFixed(0)),
					y: Number(y.toFixed(0)),
					width: width,
					height: height
				})
		 }
	}

	make()
}





//
