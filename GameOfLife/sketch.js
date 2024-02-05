let gameOfLife
const defaultGameState = {
	cells: [],
	cellSize: 20,
	framesCounted: 0,
	gridSize: 60,
	lifeSpeed: 100,
	livingLife: true
}

function GameOfLife(state = defaultGameState) {
	this.state = state

	const createGrid = () => {
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

	const startLife = (numOfFirstArivals) => {
		const randomCellIndexs = []
		for (let index = 0; index < numOfFirstArivals; index++) {
			let randomIndex = Number( random(0, this.state.cells.length).toFixed(0) )
			randomCellIndexs.push(randomIndex)
		}

		this.state.cells.map((cell, index) => {
			if(randomCellIndexs.includes(index)) {
				cell.hasLife = true
			}
			return cell
		})
	}
	
	const drawCells = () => {
		background("black")
		for (let index = 0; index < this.state.cells.length; index++) {
			this.state.cells[index].draw()
		}
	}

	const identifyLivingNeighbors = () => {
		this.state.cells.forEach(cell => {
			cell.countLivingNeighbors(this.state)
		})
	}

	this.lifeHappens = () => {
		//THE RULES
		// Any cell with less than two neighbors dies
		// Any live cell with more than three live neighbours dies 
		// Any live cell with two or three live neighbours lives, unchanged, to the next generation
		// Any dead cell with exactly three live neighbours will come to life
		
		if(this.state.livingLife) {
			identifyLivingNeighbors()

			this.state.cells.map(cell => {

				if(cell.hasLife) {
					if(cell.numOfAliveNeighbors < 2 || cell.numOfAliveNeighbors > 3) {
						cell.hasLife = false
					} else if (cell.age > 0.1) {
						cell.age -= 0.1
						cell.age = cell.age.toFixed(1)
					}
				} else {
					if(cell.numOfAliveNeighbors === 3) {
						cell.hasLife = true
						cell.age = 1
					}
				}

				return cell
			})

			drawCells()
		}
	}

	this.handleMouseControls = () => {
		this.state.cells.map((cell, index) => {
			if(cell.isMouseOverCell() && mouseIsPressed) {
				this.test(index)
				cell.hasLife = true
			}
			
			return cell
		})
	}

	this.test = (testIndex) => {
		
		const cell = this.state.cells[testIndex]
		cell.hasLife = true
		cell.draw()

		// identifyLivingNeighbors(this.state)
	
		// cell.arrayOfNeightbors.forEach((cell) => {
		// 	if(cell) {
		// 		cell.draw(true)
		// 	}
		// })
	}

	createGrid()
	startLife(1000)
	drawCells()
	setInterval(this.lifeHappens, this.state.lifeSpeed)
	console.log("Living Life", this.state.livingLife)
	console.log("Total Cells", this.state.cells.length)
}

function Cell(index, size, position, gridPosition) {
	this.index = index
	this.position = position
	this.gridPosition = gridPosition
	this.size = size
	this.hasLife = false
	this.age = 1

	this.draw = (test) => {
		// stroke(`rgba(0,255,0,1)`)
	
		if(this.hasLife) {
			fill(`rgba(0,255,0, ${this.age})`)
		} else {
			fill("black")
		}
	
		if(test) {
			stroke('red')
		}
	
		square(this.position.x, this.position.y, this.size)
	
		// fill('black')
		// text(this.index, this.position.x, this.position.y + this.size)
	}

	this.countLivingNeighbors = ({ cells, gridSize }) => {

		const onTopOfGrid = this.gridPosition.y === 1
		const onBottomOfGrid = this.gridPosition.y === gridSize
		const onLeftOfGrid = this.gridPosition.x === 1
		const onRightOfGrid = this.gridPosition.x === gridSize
	
		const right = !onRightOfGrid ? this.index + 1 : undefined
		const left = !onLeftOfGrid ? this.index - 1 : undefined
	
		const topMiddle = !onTopOfGrid ? this.index - gridSize : undefined
		const topRight = !onTopOfGrid && !onRightOfGrid ? (this.index - gridSize) + 1 : undefined
		const topLeft = !onTopOfGrid && !onLeftOfGrid ? (this.index - gridSize) - 1 : undefined
	
		const bottomMiddle = !onBottomOfGrid ? (this.index + gridSize) : undefined
		const bottomRight = !onBottomOfGrid && !onRightOfGrid ? (this.index + gridSize) + 1 : undefined
		const bottomLeft = !onBottomOfGrid && !onLeftOfGrid ? (this.index + gridSize) - 1 : undefined
	
		const neighborIndexs = [ 
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
		
		// console.log('\n -------- \n')
		// console.log(this.index, this.hasLife)
		const arrayOfNeightbors = neighborIndexs.map(neighborsIndex => {
			const cell = cells[neighborsIndex]
			// console.log(cell)
			if(cell && cell.hasLife) {
				numOfAliveNeighbors++
			}
			
			return cell
		})
		
		// console.log(numOfAliveNeighbors, arrayOfNeightbors)
		// console.log('\n -------- \n')

		this.numOfAliveNeighbors = numOfAliveNeighbors
		this.arrayOfNeightbors = arrayOfNeightbors
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
}

function draw () {
	gameOfLife.handleMouseControls()
}

function keyPressed() {
	if(key == 'p') {
		gameOfLife.state.livingLife = !gameOfLife.state.livingLife
		console.log(gameOfLife.state.livingLife)
	}
}

