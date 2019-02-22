let TheBox, zoomage = 100, xangle = 0, yangle = 0

// COLORs # "#7D7D7D" "#2B2B2B" "#303030" "#383838"

function setup () {

	createCanvas( windowWidth, windowHeight, WEBGL)

	TheBox = new BigBox
	angleMode(RADIANS)
}

function draw () {

	background("#7D7D7D")

	// push()
	// fill("blue")
	// translate(0, 0, 0)
	// sphere(10, 10, 10)
	// pop()

	TheBox.Rotate()
	TheBox.DrawDots()
	TheBox.Draw()
}

function BigBox () {

	this.Pos = { x:0, y:0, z:-windowWidth, rotation: 0, axis:"x" }
	this.Size = { w:windowWidth, h:windowHeight, d:windowWidth }
	this.OrigPos = [
		{//front
			x: this.Pos.x - (this.Size.w/2),
			y: this.Pos.y - (this.Size.h/2),
			z: this.Pos.z + (this.Size.d/2),
		},{//top
			x: this.Pos.x - (this.Size.w/2),
			y: this.Pos.y - (this.Size.h/2),
			z: this.Pos.z - (this.Size.d/2),
		},{//back
			x: this.Pos.x - (this.Size.w/2),
			y: this.Pos.y + (this.Size.h/2),
			z: this.Pos.z - (this.Size.d/2),
		},{//bottom
			x: this.Pos.x - (this.Size.w/2),
			y: this.Pos.y + (this.Size.h/2),
			z: this.Pos.z + (this.Size.d/2),
		},{//left
			x: this.Pos.x - (this.Size.w/2),
			y: this.Pos.y - (this.Size.h/2),
			z: this.Pos.z - (this.Size.d/2),
		},{//right
			x: this.Pos.x + (this.Size.w/2),
			y: this.Pos.y - (this.Size.h/2),
			z: this.Pos.z + (this.Size.d/2),
		}
	]
	this.Faces = this.OrigPos

	this.Draw = () => {

		push()
		fill("red")
		translate(this.Pos.x, this.Pos.y, this.Pos.z)

		if(this.Pos.axis === "x") {
			rotateX(this.Pos.rotation)
			RotateOnX()
		}
		else if(this.Pos.axis === "y") {
			rotateY(this.Pos.rotation)
			RotateOnY()
		}
		else if(this.Pos.axis === "z") {
			rotateZ(this.Pos.rotation)
			RotateOnZ()
		}
  	box(this.Size.w, this.Size.h, this.Size.d)
		pop()
	}

	let CheckForReset = (newAxis) => {

		if(newAxis !== this.Pos.axis) {
			this.Pos.rotation = 0
			this.Pos.axis = newAxis
		}
	}

	let RotateOnX = () => {

		let cosA = Math.cos(this.Pos.rotation), sinA = Math.sin(this.Pos.rotation)

		let newFaces = this.Faces.map((Face, i) => {

			return {
				x: this.OrigPos[i].x,
				y: this.OrigPos[i].y * cosA - (this.OrigPos[i].z - this.Pos.z) * sinA,
				z: ((this.OrigPos[i].z - this.Pos.z) * cosA + this.OrigPos[i].y * sinA) + this.Pos.z
			}
		})

		this.Faces = newFaces
	}

	let RotateOnY = () => {

		let cosA = Math.cos(this.Pos.rotation), sinA = Math.sin(this.Pos.rotation)

		let newFaces = this.Faces.map((Face, i) => {

			return {
				x: this.OrigPos[i].x * cosA + (this.OrigPos[i].z - this.Pos.z) * sinA,
				y: this.OrigPos[i].y,
				z: ((this.OrigPos[i].z - this.Pos.z) * cosA - this.OrigPos[i].x * sinA) + this.Pos.z
			}
		})

		this.Faces = newFaces
	}

	let RotateOnZ = () => {

		let cosA = Math.cos(this.Pos.rotation), sinA = Math.sin(this.Pos.rotation)

		let newFaces = this.Faces.map((Face, i) => {

			return {
				x: this.OrigPos[i].x * cosA - this.OrigPos[i].y * sinA,
				y: this.OrigPos[i].y * cosA + this.OrigPos[i].x * sinA,
				z: this.OrigPos[i].z
			}
		})

		this.Faces = newFaces
	}

	this.Rotate = () => {

		if(key === "x") {
			CheckForReset("x")
			this.Pos.rotation += .01
		}
		else if(key === "y") {
			CheckForReset("y")
			this.Pos.rotation += .01
		}
		else if(key === "z") {
			CheckForReset("z")
			this.Pos.rotation += .01
		}
	}

	this.DrawDots = () => {


		for (let i = 0; i < 6; i++) {
			let Face = this.Faces[i]
			push()
			fill("black")
			translate(
				Face.x,
				Face.y,
				Face.z)
			sphere(10);
			pop()
		}
	}
}












//
