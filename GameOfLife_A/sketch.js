	let state
	function State() {
		this.cells = []
		this.cell_size = 10
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

	function CellSetup () {
		let position = { x: 10, y: 10 },
		gridW = 30,
		gridH = 30,
		cell_size = state.cell_size
		let centerCell = {x: 110, y: 40}
		while(position.y !== gridH * cell_size) {

			let cell = new Cell({...position}, cell_size)
			state.cells.push(cell)

			if(JSON.stringify(cell.position) === JSON.stringify({x: centerCell.x - cell_size, y: centerCell.y + cell_size})) {
				console.log("top left", cell.position, state.cells.length)
			}

			if(JSON.stringify(cell.position) === JSON.stringify({x: centerCell.x, y: centerCell.y + cell_size})) {
				console.log("top center", cell.position, state.cells.length)
			}

			if(JSON.stringify(cell.position) === JSON.stringify({x: centerCell.x + cell_size, y: centerCell.y + cell_size})) {
				console.log("top right", cell.position, state.cells.length)
			}

			if(JSON.stringify(cell.position) === JSON.stringify({x: centerCell.x - cell_size, y: centerCell.y})) {
				console.log("middle left", cell.position, state.cells.length)
			}

			if(JSON.stringify(cell.position) === JSON.stringify(centerCell)) {
				console.log("middle CENTER", cell.position, state.cells.length)
			}

			if(JSON.stringify(cell.position) === JSON.stringify({x: centerCell.x + cell_size, y: centerCell.y})) {
				console.log("middle right", cell.position, state.cells.length)
			}

			if(JSON.stringify(cell.position) === JSON.stringify({x: centerCell.x - cell_size, y: centerCell.y - cell_size})) {
				console.log("bottom left", cell.position, state.cells.length)
			}

			if(JSON.stringify(cell.position) === JSON.stringify({x: centerCell.x, y: centerCell.y - cell_size})) {
				console.log("bottom center", cell.position, state.cells.length)
			}

			if(JSON.stringify(cell.position) === JSON.stringify({x: centerCell.x + cell_size, y: centerCell.y - cell_size})) {
				console.log("bottom right", cell.position, state.cells.length)
			}

			if(position.x === gridW * cell_size) {
				position.y += cell_size
				position.x = 10
			} else {
				position.x += cell_size
			}
		}
	}

	function Life () {
		let numberOfNeighbors = 0

		this.CountNeighbors = () => {
			for (let index = 0; index < State.cells.length; index++) {
				const cell = State.cells[index];
				for (let i = 0; i < State.cells.length; i++) {
					const c = State.cells[i];
					
				}
			}
		}
	}

	
