	let state
	function State() {
		this.cells = []
	}

	function setup () {

		state = new State()

		createCanvas( windowWidth, windowHeight )
		noStroke()

		let position = { x: 10, y: 10 },
		gridW = 30,
		gridH = 30,
		cell_size = 10

		while(position.y !== gridH * cell_size) {

			let cell = new Cell({...position}, cell_size)
			console.log(cell.position)
			state.cells.push(cell)

			if(position.x === gridW * cell_size) {
				position.y += cell_size
				position.x = 10
			} else {
				position.x += cell_size
			}
		}
	}

	function draw () {
		background("green")

		for (let index = 0; index < state.cells.length; index++) {
			const cell = state.cells[index];

			cell.draw()
		}
	}

	function Cell (position, size) {
		this.position = position
		this.size = size

		this.draw = () => {
			stroke("black")
			square(this.position.x, this.position.y, this.size)
		}
	}

	
