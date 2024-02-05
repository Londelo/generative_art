	var squares = []
	var trails = []
	var color = {"r": 215, "g": 95, "b": 114}

	function setup () {

		createCanvas( windowWidth, windowHeight)
		// noLoop()

		let squaresOut = 0, amountAloud = 1
		while(squaresOut < amountAloud) {

			squares.push( new crazy_square())
			squaresOut++
		}
	}

function draw () {

		background(235, 237, 243)

		//Things in slowMow
		if(frameCount % 10 === 0){

			squares.forEach( (square, i) => {

				square.changeColor()
				square.moveLR(i)
				square.moveUD(i)
				square.checkInView(i)
			})
		}
		//----------------

		// squares.forEach( (square, i) => {
		// 	console.log(square, frameCount, "-[--------------]");
		// 	square.moveLR(i)
		// 	square.moveUD(i)
		// })

		squares.forEach( (square) => {

			square.display()
		})

		//spawn all trails
		trails.forEach( (trail) => {

			stroke(217, 55, 50)
			line(trail.x1, trail.y1, trail.x2, trail.y2)
		})

	}

function crazy_square () {

		this.multiplierA = random(800, 2000)
		this.multiplierB = random(500, 1000)

		this.xPosition = windowWidth - random(windowWidth)
		this.yPosition = windowHeight - random(windowHeight)

		this.display = () => {

			this.width = 20
			this.height = 20

			noStroke()
			rect(this.xPosition, this.yPosition, this.width, this.height)
		}

		this.moveLR = (thisIndex) => {

			let LorR = ceil(random(-2, 1))

			if(LorR === -0) {
				this.moveLR(thisIndex)
				return null
			}
			else if(LorR > 0) {

				let movesMade = 0, movesAloud = random(10, 35)
				while(movesMade < movesAloud) {

					let newX = 1
					this.xPosition += newX
					this.leaveTrail(thisIndex, this.xPosition + newX, this.yPosition)
					movesMade++
				}
			}
			else {

				let movesMade = 0, movesAloud = random(5, 15)
				while(movesMade < movesAloud) {

					let newX = 1
					this.xPosition -= newX
					this.leaveTrail(thisIndex, this.xPosition - newX, this.yPosition)
					movesMade++
				}

				return
			}

		}

		this.moveUD = (thisIndex) => {

			let UorD = ceil(random(-2, 1))

			if(UorD === -0) {
				this.moveUD(thisIndex)
				return null
			}
			else if(UorD > 0) {

				let movesMade = 0, movesAloud = random(10, 35)
				while(movesMade < movesAloud) {

					let newY = 1
					this.yPosition += newY
					this.leaveTrail(thisIndex, this.xPosition, this.yPosition + newY)
					movesMade++
				}
			}
			else {

				let movesMade = 0, movesAloud = random(5, 15)
				while(movesMade < movesAloud) {

					let newY = 1
					this.yPosition -= newY
					this.leaveTrail(thisIndex, this.xPosition, this.yPosition - newY)
					movesMade++
				}

				return
			}

		}

		this.changeColor = () => {
			fill(44, 51, 57)
			// fill(random(41, 231), random(41, 231), random(41, 231))
		}

		this.checkInView = (thisIndex) => {

			if(this.xPosition > windowWidth || this.yPosition > windowHeight){
				squares.splice(thisIndex, 1)
				this.deleteSquareTrail(thisIndex)
				squares.push( new crazy_square())
			}
			else if (this.xPosition < 0 || this.yPosition < 0) {
				squares.splice(thisIndex, 1)
				this.deleteSquareTrail(thisIndex)
				squares.push( new crazy_square())
			}
		}

		//this gets called in moveLR and moveUD
		this.leaveTrail = (thisIndex, xNext, yNext) => {

			trails.push({"thisIndex": thisIndex, "x1": this.xPosition, "y1": this.yPosition, "x2": xNext, "y2": yNext})
		}

		//this gets call in checkInView
		this.deleteSquareTrail = (thisIndex) => {
			console.log("hit");
			trails = trails.filter( (trail) => trail.thisIndex !== thisIndex )
		}
	}

	function mousePressed () {
		noLoop()
	}











	//
