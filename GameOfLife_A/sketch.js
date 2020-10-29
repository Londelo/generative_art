	let state
	function State() {
		this.cells = []
		this.cell_size = 10
		this.framesCounted = 0
	}

	//THE RULES

	// Any cell with less than two neighbors dies
	// Any live cell with more than three live neighbours dies 
	// Any live cell with two or three live neighbours lives, unchanged, to the next generation
	// Any dead cell with exactly three live neighbours will come to life

	function setup () {

		state = new State()

		createCanvas( windowWidth, windowHeight )
		noStroke()

		CellSetup()
	}

	function draw () {
		background("black")
		state.framesCounted ++

		if(state.framesCounted === 5) {
			Life()
			state.framesCounted = 0
		}

		for (let index = 0; index < state.cells.length; index++) {
			const cell = state.cells[index];
			cell.draw()
		}
	}

	function Cell (position, size) {
		this.position = position
		this.size = size
		this.hasLife = false
		this.yearsOld = 1

		this.draw = () => {
			stroke("black")

			if(this.hasLife) {
				console.log(this.yearsOld)
				fill(`rgba(0,255,0, ${this.yearsOld})`)
			} else {
				fill("white")
			}
			square(this.position.x, this.position.y, this.size)
		}
	}

	function CellSetup () {
		let position = { x: 10, y: 10 },
		gridW = 30,
		gridH = 30,
		cell_size = state.cell_size

		while(position.y !== gridH * cell_size) {

			let cell = new Cell({...position}, cell_size)
			state.cells.push(cell)

			if(position.x === gridW * cell_size) {
				position.y += cell_size
				position.x = 10
			} else {
				position.x += cell_size
			}
		}

		for (let index = 0; index < 100; index++) {
			let randomIndex = random(0, state.cells.length - 1).toFixed(0)
			const cell = state.cells[randomIndex];
			cell.hasLife = true
		}
	}

	function Life () {
		for (let index = 0; index < state.cells.length; index++) {
			let numberOfNeightbors = 0

			let topRight = state.cells[index - 31] ? state.cells[index - 31] : null,
			topCenter = state.cells[index - 30] ? state.cells[index - 30] : null,
			topLeft = state.cells[index - 29] ? state.cells[index - 29] : null,
			left = state.cells[index - 1] ? state.cells[index - 1] : null,
			center = state.cells[index],
			right = state.cells[index + 1] ? state.cells[index + 1] : null,
			bottomRight = state.cells[index + 31] ? state.cells[index + 31] : null,
			bottomCenter = state.cells[index + 30] ? state.cells[index + 30] : null,
			bottomLeft = state.cells[index + 29] ? state.cells[index + 29] : null

			let arrayOfCells = [ 
				topRight, topCenter, topLeft,
				left, center, right,
				bottomLeft, bottomCenter, bottomRight
			]

			for (let index = 0; index < arrayOfCells.length; index++) {
				const cell = arrayOfCells[index];
				
				if(cell) {
					if(cell.hasLife && JSON.stringify(cell.position) !== JSON.stringify(center.position)) {
						numberOfNeightbors++
					}
				}
			}

			if(numberOfNeightbors < 2) {
				center.hasLife = false
			}

			if(numberOfNeightbors > 3) {
				center.hasLife = false
			}

			if((numberOfNeightbors === 3 || numberOfNeightbors === 2) && center.hasLife) {
				center.yearsOld -= 0.05
				center.yearsOld = center.yearsOld.toFixed(2)
			}

			if(!center.hasLife && numberOfNeightbors === 3) {
				center.hasLife = true
			}
		}
	}

	
