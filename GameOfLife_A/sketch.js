const State = {
	cells: [],
	cellSize: 10,
	framesCounted: 0,
	gridSize: 60,
	freeze: false,
	lifeSpeed: 15
}

const Cell = {
	position: { x: 0, y: 0 },
	gridPosition: { x: 1, y: 1 },
	size: State.cellSize,
	hasLife: false,
	age: 1
}

function setup () {

	createCanvas( windowWidth, windowHeight )
	noStroke()

	createGrid()
	startLife()
	drawLife()
}

function draw () {
	State.framesCounted ++
	

	if(State.framesCounted === State.lifeSpeed) {
		lifeHappens()
		drawLife()
		State.framesCounted = 0
	}

	// testCellLogic(17)
}

function drawLife() {
	if(!State.freeze) {
		background("black")
		for (let index = 0; index < State.cells.length; index++) {
			let cell = State.cells[index];
			drawCell(cell)
		}
	}
}

function createGrid () {
	const position = { x: 0, y: 0 }
	const gridPosition = { x: 1, y: 1 }

	const {
		gridSize,
		cellSize
	} = State

	while(gridPosition.y <= gridSize) {
		const newCell = {
			...Cell,
			position: { ...position },
			gridPosition: { ...gridPosition }
		}
		State.cells.push(newCell)

		if(gridPosition.x < gridSize) {
			position.x += cellSize
			gridPosition.x ++
		} else {
			position.y += cellSize
			position.x = 0
			gridPosition.y ++
			gridPosition.x = 1
		}
	}
}

function startLife () {
	const numOfFirstArivals = 300
	for (let index = 0; index < numOfFirstArivals; index++) {
		let randomIndex = random(0, State.cells.length).toFixed(0)
		const cell = State.cells[randomIndex ];
		cell.hasLife = true
	}
}

function drawCell (cell, test) {
	stroke("black")

	if(cell.hasLife) {
		fill(`rgba(0,255,0, ${cell.age})`)
	} else {
		fill("white")
	}

	if(test) {
		fill('red')
	}

	square(cell.position.x, cell.position.y, cell.size)
}

function countLivingNeighbors (cellIndex) {

	const {
		cells,
		gridSize,
		cellSize
	} = State

	const theCell = cells[cellIndex]

	const onTopOfGrid = theCell.gridPosition.y === 1
	const onBottomOfGrid = theCell.gridPosition.y === gridSize
	const onLeftOfGrid = theCell.gridPosition.x === 1
	const onRightOfGrid = theCell.gridPosition.x === gridSize

	const right = !onRightOfGrid ? cells[cellIndex + 1] : undefined
	const left = !onLeftOfGrid ? cells[cellIndex - 1] : undefined

	const topMiddle = !onTopOfGrid ? cells[cellIndex - gridSize] : undefined
	const topRight = !onTopOfGrid && !onRightOfGrid ? cells[(cellIndex - gridSize) + 1] : undefined
	const topLeft = !onTopOfGrid && !onLeftOfGrid ? cells[(cellIndex - gridSize) - 1] : undefined

	const bottomMiddle = !onBottomOfGrid ? cells[(cellIndex + gridSize)] : undefined
	const bottomRight = !onBottomOfGrid && !onRightOfGrid ? cells[(cellIndex + gridSize) + 1] : undefined
	const bottomLeft = !onBottomOfGrid && !onLeftOfGrid ? cells[(cellIndex + gridSize) - 1] : undefined

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

function lifeHappens() {

	//THE RULES

	// Any cell with less than two neighbors dies
	// Any live cell with more than three live neighbours dies 
	// Any live cell with two or three live neighbours lives, unchanged, to the next generation
	// Any dead cell with exactly three live neighbours will come to life

	const {
		cells
	} = State

	for (let index = 0; index < cells.length; index++) {
		const cell = cells[index]
		const { numOfAliveNeighbors } = countLivingNeighbors(index)

		if(cell.hasLife) {
			if(numOfAliveNeighbors < 2 || numOfAliveNeighbors > 3) {
				cell.hasLife = false
			} else if (cell.age > 0.1) {
				cell.age -= 0.1
				cell.age = cell.age.toFixed(1)
			}
		} else {
			if(numOfAliveNeighbors === 3) {
				cell.hasLife = true
				cell.age = 1
			}
		}
	}
}

function testCellLogic(testIndex) {
	State.freeze = true

	State.cells[testIndex].hasLife = true
	drawCell(State.cells[testIndex])

	const { arrayOfNeightbors } = countLivingNeighbors(testIndex)
	arrayOfNeightbors.forEach(cell => {
		if(cell) {
			drawCell(cell, true)
		}
	})
}

