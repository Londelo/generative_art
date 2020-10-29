	let state
	function State() {
		this.cells = []
		this.cell_size = 10
		this.framesCounted = 0
		this.importantDifference = 0
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

		if(state.framesCounted === 200) {
			console.log("LIFE BABY")
			Life()
			state.framesCounted = 0
		}

		for (let index = 0; index < state.cells.length; index++) {
			let cell = state.cells[index];

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
				fill(`rgba(0,255,0, ${this.yearsOld})`)
			} else {
				fill("white")
			}
			square(this.position.x, this.position.y, this.size)
		}
	}

	function CellSetup () {
		let position = { x: 0, y: 0 },
		gridW = 300,
		gridH = 300,
		cell_size = state.cell_size

		while(position.y < gridH) {
			let cell = new Cell({...position}, cell_size)
			state.cells.push(cell)

			if(position.x > gridW) {
				position.y += cell_size
				position.x = 0
			} else {
				position.x += cell_size
			}
		}

		for (let index = 0; index < 20; index++) {
			let randomIndex = random(500, 800).toFixed(0)
			const cell = state.cells[randomIndex];
			cell.hasLife = true
		}

		CheckImportantDifference()

		// state.cells[200].hasLife = true
		// state.cells[200 - (state.importantDifference - 1)].hasLife = true
		// state.cells[200 - state.importantDifference].hasLife = true
	}

	function CheckImportantDifference () {
		let centerIndex = 200, topCenterIndex = 0 
		for (let index = 0; index < state.cells.length; index++) {
			let cell = state.cells[index],
			centerCell = state.cells[centerIndex].position

			// if(JSON.stringify(cell.position) === JSON.stringify({x: centerCell.x - state.cell_size, y: centerCell.y + state.cell_size})) {
			// 	console.log("top left", cell.position, index)
			// 	cell.hasLife = true
			// }

			if(JSON.stringify(cell.position) === JSON.stringify({x: centerCell.x, y: centerCell.y + state.cell_size})) {
				console.log("top center", cell.position, index)
				// cell.hasLife = true
				topCenterIndex = index
			}

			// if(JSON.stringify(cell.position) === JSON.stringify({x: centerCell.x + state.cell_size, y: centerCell.y + state.cell_size})) {
			// 	console.log("top right", cell.position, index)
			// 	cell.hasLife = true
			// }

			// if(JSON.stringify(cell.position) === JSON.stringify({x: centerCell.x - state.cell_size, y: centerCell.y})) {
			// 	console.log("middle left", cell.position, index)
			// 	cell.hasLife = true
			// }

			// if(JSON.stringify(cell.position) === JSON.stringify(centerCell)) {
			// 	console.log("middle CENTER", cell.position, index)
			// 	cell.hasLife = true
			// }

			// if(JSON.stringify(cell.position) === JSON.stringify({x: centerCell.x + state.cell_size, y: centerCell.y})) {
			// 	console.log("middle right", cell.position, index)
			// 	cell.hasLife = true
			// }

			// if(JSON.stringify(cell.position) === JSON.stringify({x: centerCell.x - state.cell_size, y: centerCell.y - state.cell_size})) {
			// 	console.log("bottom left", cell.position, index)
			// 	cell.hasLife = true
			// }

			// if(JSON.stringify(cell.position) === JSON.stringify({x: centerCell.x, y: centerCell.y - state.cell_size})) {
			// 	console.log("bottom center", cell.position, index)
			// 	cell.hasLife = true
			// }

			// if(JSON.stringify(cell.position) === JSON.stringify({x: centerCell.x + state.cell_size, y: centerCell.y - state.cell_size})) {
			// 	console.log("bottom right", cell.position, index)
			// 	cell.hasLife = true
			// }

		}
		state.importantDifference = topCenterIndex - centerIndex
		console.log(state.importantDifference, topCenterIndex, centerIndex)
	}

	function Life() {
		for (let index = 0; index < state.cells.length; index++) {
			let numberOfNeightbors = 0

			let topRight = state.cells[index - (state.importantDifference + 1)] ? state.cells[index - (state.importantDifference + 1)] : null,
			topCenter = state.cells[index - state.importantDifference] ? state.cells[index - state.importantDifference] : null,
			topLeft = state.cells[index - (state.importantDifference - 1)] ? state.cells[index - (state.importantDifference - 1)] : null,
			left = state.cells[index - 1] ? state.cells[index - 1] : null,
			center = state.cells[index],
			right = state.cells[index + 1] ? state.cells[index + 1] : null,
			bottomRight = state.cells[index + (state.importantDifference + 1)] ? state.cells[index + (state.importantDifference + 1)] : null,
			bottomCenter = state.cells[index + state.importantDifference] ? state.cells[index + state.importantDifference] : null,
			bottomLeft = state.cells[index + (state.importantDifference - 1)] ? state.cells[index + (state.importantDifference - 1)] : null

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

			if(center.hasLife && numberOfNeightbors < 2) {
				center.hasLife = false
			}

			if(center.hasLife &&numberOfNeightbors > 3) {
				center.hasLife = false
			}

			if(center.hasLife && (numberOfNeightbors === 3 || numberOfNeightbors === 2)) {
				center.yearsOld -= 0.05
				center.yearsOld = center.yearsOld.toFixed(2)
			}

			if(!center.hasLife && numberOfNeightbors === 3) {
				center.hasLife = true
				center.yearsOld = 1
			}
		}
	}

	
