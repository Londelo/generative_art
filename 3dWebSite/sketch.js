let TheBox

// COLORs # "#7D7D7D" "#2B2B2B" "#303030" "#383838"

function setup () {

	createCanvas( windowWidth, windowHeight, WEBGL)

	TheBox = new BigBox
	angleMode(RADIANS)
}

function draw () {

	background("#7D7D7D")

	// rotateX(frameCount * 0.01);
  // rotateY(frameCount * 0.01);
  // box(50);

	TheBox.Rotate()
	TheBox.Draw()
	TheBox.DrawDots()
}

function BigBox () {

	this.Pos = { x:0, y:0, z:-1000, rotation: 0, axis:"x" }
	this.Size = { w:windowWidth, h:windowHeight, d:windowHeight }
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
		// console.table(this.Faces);
		// console.log("------------------");
		// console.table(this.OrigPos);

		push()
		fill("red")
		translate(this.Pos.x, this.Pos.y, this.Pos.z)

		if(this.Pos.axis === "x") {
			rotateX(this.Pos.rotation)
		}
		if(this.Pos.axis === "y") {
			rotateY(this.Pos.rotation)
		}
		if(this.Pos.axis === "z") {
			rotateZ(this.Pos.rotation)
		}

  	box(this.Size.w, this.Size.h, this.Size.d)
		pop()
	}

	this.Rotate = () => {

		if(key === "w") {
			this.Pos.rotation = 0
			this.Pos.rotation += .05
			this.Pos.axis = "x"
			rotateOnX()
		}
		if(key === "d") {
			this.Pos.rotation = 0
			this.Pos.rotation += .05
			this.Pos.axis = "y"
			rotateOnY()
		}
		if(key === "a") {
			this.Pos.rotation = 0
			this.Pos.rotation += .05
			this.Pos.axis = "z"
			rotateOnZ()
		}
	}

	let rotateOnZ = () => {

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

	let rotateOnY = () => {

		let cosA = Math.cos(this.Pos.rotation), sinA = Math.sin(this.Pos.rotation)

		let newFaces = this.Faces.map((Face, i) => {

			return {
				x: this.OrigPos[i].x * cosA + this.OrigPos[i].z * sinA,
				y: this.OrigPos[i].y,
				z: this.OrigPos[i].z * cosA - this.OrigPos[i].x * sinA
			}
		})

		this.Faces = newFaces
	}

	let rotateOnX = () => {

		let cosA = Math.cos(this.Pos.rotation), sinA = Math.sin(this.Pos.rotation)

		let newFaces = this.Faces.map((Face, i) => {

			return {
				x: this.OrigPos[i].x,
				y: this.OrigPos[i].y * cosA - this.OrigPos[i].z * sinA,
				z: this.OrigPos[i].z * cosA + this.OrigPos[i].y * sinA
			}
		})

		this.Faces = newFaces
	}

	this.DrawDots = () => {


		for (let i = 0; i < 6; i++) {
			let Face = this.Faces[i]
			push()
			fill("black")
			translate(Face.x, Face.y, Face.z)
			sphere(20);
			pop()
		}
	}
}












//
