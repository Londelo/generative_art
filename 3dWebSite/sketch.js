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

	this.Pos = { x:0, y:0, z:-1000, rotation: 0 }
	this.Size = { w:windowWidth, h:windowHeight, d:windowHeight }
	this.OrigPos = {
		rotation: -1,
		front: {
			x: this.Pos.x - (this.Size.w/2),
			y: this.Pos.y - (this.Size.h/2),
			z: this.Pos.z + (this.Size.d/2),
		},
		top:{
			x: this.Pos.x - (this.Size.w/2),
			y: this.Pos.y - (this.Size.h/2),
			z: this.Pos.z - (this.Size.d/2),
		},
		back:{
			x: this.Pos.x - (this.Size.w/2),
			y: this.Pos.y + (this.Size.h/2),
			z: this.Pos.z - (this.Size.d/2),
		},
		bottom:{
			x: this.Pos.x - (this.Size.w/2),
			y: this.Pos.y + (this.Size.h/2),
			z: this.Pos.z + (this.Size.d/2),
		},
		left:{
			x: this.Pos.x - (this.Size.w/2),
			y: this.Pos.y - (this.Size.h/2),
			z: this.Pos.z - (this.Size.d/2),
		},
		right:{
			x: this.Pos.x + (this.Size.w/2),
			y: this.Pos.y - (this.Size.h/2),
			z: this.Pos.z + (this.Size.d/2),
		}
	}
	this.Faces = {1:{},2:{},3:{},4:{},5:{},6:{}}

	this.Draw = () => {

		push()
		fill("red")
		translate(this.Pos.x, this.Pos.y, this.Pos.z)
		rotateZ(this.Pos.rotation)
  	box(this.Size.w, this.Size.h, this.Size.d,0,0);
		pop()
	}

	this.Rotate = () => {

		if(key === "w") {
			this.Pos.rotation += .05
		}
	}

	let SetFaces = () => {

		let cosA = Math.cos(this.Pos.rotation), sinA = Math.sin(this.Pos.rotation)

		this.Faces = {

			1:{
				pos: {
					x: this.OrigPos.front.x * cosA - this.OrigPos.front.y * sinA,
					y: this.OrigPos.front.y * cosA + this.OrigPos.front.x * sinA,
					z: this.OrigPos.front.z,
				}
			},
			2:{
				pos: {
					x: this.OrigPos.top.x * cosA - this.OrigPos.top.y * sinA,
					y: this.OrigPos.top.y * cosA + this.OrigPos.top.x * sinA,
					z: this.OrigPos.top.z,
				}
			},
			3:{
				pos: {
					x: this.OrigPos.back.x * cosA - this.OrigPos.back.y * sinA,
					y: this.OrigPos.back.y * cosA + this.OrigPos.back.x * sinA,
					z: this.OrigPos.back.z,
				}
			},
			4:{
				pos: {
					x: this.OrigPos.bottom.x * cosA - this.OrigPos.bottom.y * sinA,
					y: this.OrigPos.bottom.y * cosA + this.OrigPos.bottom.x * sinA,
					z: this.OrigPos.bottom.z,
				}
			},
			5:{
				pos: {
					x: this.OrigPos.left.x * cosA - this.OrigPos.left.y * sinA,
					y: this.OrigPos.left.y * cosA + this.OrigPos.left.x * sinA,
					z: this.OrigPos.left.z,
				}
			},
			6:{
				pos: {
					x: this.OrigPos.right.x * cosA - this.OrigPos.right.y * sinA,
					y: this.OrigPos.right.y * cosA + this.OrigPos.right.x * sinA,
					z: this.OrigPos.right.z,
				}
			}
		}
	}

	let SetOrigPos = () => {
		this.OrigPos.rotation = this.Pos.rotation
	}

	this.DrawDots = () => {

		if(this.Pos.rotation !== this.OrigPos.rotation) {
			SetFaces()
			SetOrigPos()
		}

		for (let i = 1; i <= 6; i++) {
			push()
			fill("black")
			translate(this.Faces[i].pos.x, this.Faces[i].pos.y, this.Faces[i].pos.z)
			sphere(20);
			pop()
		}
	}
}












//
