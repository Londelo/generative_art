function GameOfLife() {
	this.state = {
		cells: [],
		cellSize: 20,
		framesCounted: 0,
		gridSize: 6,
		freeze: false,
		lifeSpeed: 15,
		livingLife: false,
		drawCells: true
	}

	this.createGrid = () => {
		const position = { x: 0, y: 0 }
		const gridPosition = { x: 1, y: 1 }
		let cellIndex = 0
		let {
			gridSize,
			cellSize,
			cells
		} = this.state
	
		while(gridPosition.y <= gridSize) {
			const newCell = new Cell(cellIndex, cellSize, { ...position }, { ...gridPosition })

			cells.push(newCell)
	
			if(gridPosition.x < gridSize) {
				position.x += cellSize
				gridPosition.x ++
			} else {
				position.y += cellSize
				position.x = 0
				gridPosition.y ++
				gridPosition.x = 1
			}
	
			cellIndex ++
		}
	}

	this.startLife = (numOfFirstArivals) => {
		for (let index = 0; index < numOfFirstArivals; index++) {
			let randomIndex = random(0, this.state.cells.length).toFixed(0)
			const cell = this.state.cells[randomIndex];
			cell.hasLife = true
		}
	}
	
	this.drawCells = () => {
		let {
			drawCells,
			cells
		} = this.state 
	
		if(drawCells) {
			background("black")
			for (let index = 0; index < cells.length; index++) {
				let cell = cells[index];
				cell.draw()
			}
			this.state.drawCells = false
		}
	}

	this.lifeHappens = () => {
		//THE RULES
		// Any cell with less than two neighbors dies
		// Any live cell with more than three live neighbours dies 
		// Any live cell with two or three live neighbours lives, unchanged, to the next generation
		// Any dead cell with exactly three live neighbours will come to life
		
		let {
			framesCounted,
			lifeSpeed,
			livingLife,
			cells,
			gridSize
		} = this.state
	
		this.state.framesCounted ++
	
		if(framesCounted >= lifeSpeed && livingLife) {
			framesCounted = 0
	
			for (let index = 0; index < cells.length; index++) {
				const cell = cells[index]
				let { numOfAliveNeighbors, arrayOfNeightbors } = cell.countLivingNeighbors(cells, gridSize)
	
				if(cell.hasLife) {
					if(numOfAliveNeighbors < 2 || numOfAliveNeighbors > 3) {
						cell.hasLife = false
					} else if (cell.age > 0.1) {
						cell.age -= 0.1
						cell.age = cell.age.toFixed(1)
					}
				} else {
					console.log(index, numOfAliveNeighbors, arrayOfNeightbors)
					if(numOfAliveNeighbors === 3) {
						cell.hasLife = true
						cell.age = 1
					}
				}
			}
	
			this.state.livingLife = false
		}
	}

	this.handleMouseControls = () => {
		for (let index = 0; index < this.state.cells.length; index++) {
			let cell = this.state.cells[index];
			// cell.isMouseOverCell = isMouseOverCell(cell)
			if(cell.isMouseOverCell() && mouseIsPressed) {
				this.test(index)
				cell.hasLife = true
			}
		}
	}

	this.test = (testIndex) => {
		
		const cell = this.state.cells[testIndex]
		cell.hasLife = true
		cell.draw()

		let { numOfAliveNeighbors, arrayOfNeightbors } = cell.countLivingNeighbors(this.state.cells, this.state.gridSize)
	
		arrayOfNeightbors.forEach((cell) => {
			if(cell) {
				cell.draw(true)
			}
		})
	}
}

let gameOfLife

function Cell(index, size, position, gridPosition) {
	this.index = index
	this.position = position
	this.gridPosition = gridPosition
	this.size = size
	this.hasLife = false
	this.age = 1

	this.draw = (test) => {
		stroke("black")
	
		if(this.hasLife) {
			fill(`rgba(0,255,0, ${this.age})`)
		} else {
			fill("white")
		}
	
		if(test) {
			stroke('red')
		}
	
		square(this.position.x, this.position.y, this.size)
	
		
		fill('black')
		text(this.index, this.position.x, this.position.y + this.size)
	}

	this.countLivingNeighbors = (potentialNeighbors, gridSize) => {
	
		const onTopOfGrid = this.gridPosition.y === 1
		const onBottomOfGrid = this.gridPosition.y === gridSize
		const onLeftOfGrid = this.gridPosition.x === 1
		const onRightOfGrid = this.gridPosition.x === gridSize
	
		const right = !onRightOfGrid ? potentialNeighbors[this.index + 1] : undefined
		const left = !onLeftOfGrid ? potentialNeighbors[this.index - 1] : undefined
	
		const topMiddle = !onTopOfGrid ? potentialNeighbors[this.index - gridSize] : undefined
		const topRight = !onTopOfGrid && !onRightOfGrid ? potentialNeighbors[(this.index - gridSize) + 1] : undefined
		const topLeft = !onTopOfGrid && !onLeftOfGrid ? potentialNeighbors[(this.index - gridSize) - 1] : undefined
	
		const bottomMiddle = !onBottomOfGrid ? potentialNeighbors[(this.index + gridSize)] : undefined
		const bottomRight = !onBottomOfGrid && !onRightOfGrid ? potentialNeighbors[(this.index + gridSize) + 1] : undefined
		const bottomLeft = !onBottomOfGrid && !onLeftOfGrid ? potentialNeighbors[(this.index + gridSize) - 1] : undefined
	
		const arrayOfNeightbors = [ 
			left,
			right,
			topMiddle,
			topRight,
			topLeft,
			bottomMiddle,
			bottomLeft,
			bottomRight
		]
	
		let numOfAliveNeighbors = 0
	
		arrayOfNeightbors.forEach(cell => {
			if(cell && cell.hasLife) {
				numOfAliveNeighbors++
			}
		})
	
		return { arrayOfNeightbors, numOfAliveNeighbors }
	}

	this.isMouseOverCell = () => {
		let {
			position: {
				x: cellX,
				y: cellY
			},
			size
		} = this
	
		const inXRange = mouseX > cellX && mouseX < (cellX + size)
		const inYRange = mouseY > cellY && mouseY < (cellY + size)
	
		if(inXRange && inYRange) {
			return true
		}
	
		return false
	}
}

function setup () {

	createCanvas( windowWidth, windowHeight )
	noStroke()

	gameOfLife = new GameOfLife()
	gameOfLife.createGrid()
	gameOfLife.startLife(1)
}

function draw () {
	const {
		handleMouseControls,
		drawCells,
		lifeHappens
	} = gameOfLife

	console.log('living life', gameOfLife.state.livingLife)
	
	handleMouseControls()
	drawCells()
	lifeHappens()
}

function keyPressed() {
	if(key == 'p') {
		gameOfLife.state.livingLife = !gameOfLife.state.livingLife
		gameOfLife.state.drawCells = !gameOfLife.state.drawCells
	}
	if(key == 'd') {
		gameOfLife.state.drawCells = !gameOfLife.state.drawCells
	}
}

