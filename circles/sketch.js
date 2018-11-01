	var things = []
	var color = {"r": 215, "g": 95, "b": 114}

	function setup () {

		createCanvas( windowWidth, windowHeight)
		noStroke()

		for(let i = 0; i < 100; i++) {
			things.push(new circ_anim())
		}

	}

	function draw () {

		if(frameCount % 10 === 0){

			color = {"r": random(0, 230), "g": random(72, 245), "b": random(67, 247)}

			background(230, 245, 247)
			fill(color.r, color.g, color.b)

			for(let i = 0; i < things.length; i++) {

				if(mouseIsPressed){
					things[i].moveTo(mouseX, mouseY)
					things[i].jidder()
				}
				else{
					things[i].jidder()
				}

				things[i].sizeChange()
				things[i].display()
			}
		}

	}



	function circ_anim () {

		this.x = random(1234)
		this.y = random(636)
		this.size = random(5, 40)
		this.sizeCheck = this.size
		this.otherSize = random(5, 40)

	  this.jidder = function() {

	    this.x += random(-10, 10)
	    this.y += random(-10, 10)
	  }

		this.moveTo = function (x, y) {

			if(this.x !== x && this.y !== y) {
				this.x -= (this.x - x)/10
	 	    this.y -= (this.y - y)/10
			}
		}

		this.display = function() {

			ellipse(this.x, this.y, this.size, this.size)
		}

		this.sizeChange = function () {

			if(mouseIsPressed && this.size > 0){
				this.size -= 10
			}
			else if (!mouseIsPressed && this.size !== this.sizeCheck && this.size !== this.otherSize){
				this.size += 2
			}

		}
	}
