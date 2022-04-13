
let flies = []
let moving = false
let v
let last_position = {}, rotation
let backgroundColor = "#000D0D"
function setup () {
	function makeFireFlies (numOfFlies) {
		for (let i = 0; i < numOfFlies; i++) {
			let FireFly = new fireFly
			flies.push(FireFly)
		}
	}

	// //find appropriate canvas width
	// canvas_size = windowWidth < windowHeight ? windowWidth : windowHeight
	// canvas_size -= 80

	createCanvas( windowWidth, windowHeight)

	// //set canvas in center
	// let margin_left = (windowWidth - canvas_size) / 2
	// $(".p5Canvas").css("margin-left", margin_left)
	// $(".p5Canvas").css("margin-top", 40)

	background(backgroundColor)
	noStroke()

	makeFireFlies(1)	
}

function draw () {

	function makeTargetVisible(target) {
		fill('purple')
		ellipse(
			target.x,
			target.y,
			20,
			20
		)
	}

	background(backgroundColor)
	flies.forEach((flie,) => {

		if(mouseIsPressed) {
			flie.headToMouse()
		} else {
			flie.headToRandomSpot()
		}

		// makeTargetVisible({
		// 	x: flie.the_heading.x,
		// 	y: flie.the_heading.y
		// })
		
		flie.drawHead()
		flie.drawWings()
		flie.drawTail()
	})

	// testing angles of a wing
	// translate(50, 50);
	// rotate(rotation)
	// ellipse(0, 0, 50, 20);
}

function fireFly() {

	let opacity = 1,
	headColor = {r:0, g:0, b: 0},
	bodyColor = {r:0, g:0, b: 0},
	darkTailColor = {r:0, g:0, b: 0},
	lightTailColor = {r:242, g:200, b:75},
	tailColor = darkTailColor,
	wingColor = {r:200, g:200, b: 200, o: 1}

	this.fly_length = 5
	this.fly_piece_size = 20
	this.speed = 2.5
	
	this.head_position = {
		x: random(this.fly_piece_size, windowWidth - this.fly_piece_size),
		y: random(this.fly_piece_size, windowHeight - this.fly_piece_size)
	}

	this.fly_pieces = []
	this.wings = []

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
		let num_wings = 2,
		width = this.fly_piece_size + 25,
		height = this.fly_piece_size - 25
		
		for (let c = 0; c < num_wings; c++) {

			this.wings.push({
				width: width,
				height: height
			})
		}
	}

	this.drawWings = () => {
		let wingLocation = this.fly_pieces[1]
		this.wings.forEach((wing, c) => {

			let radius = wingLocation.size + 20,
			rotation, angle, x, y, rotateBy = 20 * 100

			angle = (rotateBy) * (Math.PI/180);
			rotation = 3.0

			let point = { x: 220, y: 220 }
			x = Math.cos(angle) * (point.x - 200) - Math.sin(angle) * (point.y - 200) + 200;
			y = Math.sin(angle) * (point.x - 200) + Math.cos(angle) * (point.y - 200) + 200;

			push()

			ellipseMode(CENTER);
			// rotate(Math.PI / rotation)
			fill(`rgba(${wingColor.r},${wingColor.g},${wingColor.b}, ${wingColor.o})`)
			ellipse(
				x,
				y,
				wing.width,
				wing.height
			)

			fill('red')
				ellipse(
					200,
					200,
					10,
					10
				)
			pop()
		})
	}

	this.drawHead = () => {

		let head = this.fly_pieces[0]
		let x1, y1, distance

		x1 =  this.the_heading.x - head.x
		y1 = this.the_heading.y - head.y

		distance = Math.sqrt(x1*x1 + y1*y1)
		x1 /= distance
		y1 /= distance

		head.x += x1 * this.speed
		head.y +=	y1 * this.speed


		fill(`rgba(${headColor.r},${headColor.g},${headColor.b}, ${opacity})`)
		ellipse(
			head.x,
			head.y,
			head.size,
			head.size
		)

		//if we reach out destination
		if(distance < 10) {
			this.random_heading = this.createRandomHeading()
		}
	}

	this.drawTail = () => {
		let tailColors = [`rgba(${bodyColor.r},${bodyColor.g},${bodyColor.b}, ${opacity})`, `rgba(${tailColor.r},${tailColor.g},${tailColor.b}, ${opacity})`],
		colorIndex = 0

		this.fly_pieces.forEach((piece, i) => {
			if(i !== 0) {

				let x1, y1, distance

				x1 =  this.fly_pieces[i - 1].x - piece.x
				y1 = this.fly_pieces[i - 1].y - piece.y

				distance = Math.sqrt(x1*x1 + y1*y1)

				if(distance > this.fly_pieces[i - 1].size + 3) {

					x1 /= distance
					y1 /= distance

					piece.x += x1 * this.speed
					piece.y +=	y1 * this.speed
				}

				fill(tailColors[colorIndex])
				ellipse(
					piece.x,
					piece.y,
					piece.size,
					piece.size
				)

				if(colorIndex !== tailColors.length -1) {
					colorIndex++
				}
			}
		})
	}

	function getRandomLightTimer() {
		return random(3000, 10000)
	}

	function isLightOn_onStart() {
		let randomNumber = random(0, 10).toFixed(0)

		if(randomNumber > 5) {
			tailColor = lightTailColor
			return true
		}
		
		return false
	}

	this.lightTimer = getRandomLightTimer()
	this.isLightOn = isLightOn_onStart()

	this.handleLights = () => {
		setTimeout(() => {
			this.isLightOn = !this.isLightOn
			this.lightTimer = getRandomLightTimer()
			this.handleLights()
		}, this.lightTimer)
	}

	this.createRandomHeading = () => {
		return {
			x: random(this.fly_piece_size, windowWidth - this.fly_piece_size),
			y: random(this.fly_piece_size, windowHeight - this.fly_piece_size)
		}
	}

	this.random_heading  = this.createRandomHeading()
	this.the_heading = this.random_heading

	this.headToMouse = () => {
		this.the_heading = {
			x: mouseX,
			y: mouseY
		}

		tailColor = lightTailColor

		this.speed = 5
	}

	this.headToRandomSpot = () => {
		this.the_heading = this.random_heading

		if(this.isLightOn) {
			tailColor = lightTailColor
		} else {
			tailColor = darkTailColor
		}

		this.speed = 2.5
	}

	make()
	this.handleLights()
}




// let radius = wingLocation.size + 20,
// 					rotation,
// 					 angle,
// 						x,
// 						y

// 			x = (radius * Math.cos(angle)) + wingLocation.x
// 			y = (radius * Math.sin(angle)) + wingLocation.y

// 			angle = (c / (this.wings.length / 2)) * Math.PI;
// 			rotation = atan2(this.fly_pieces[0].y - y, this.fly_pieces[0].x - x)