const State = {
	cells: [],
	cellSize: 10,
	framesCounted: 0,
	gridW: 600,
	gridH: 600,
	freeze: false,
	lifeSpeed: 5
}

const Cell = {
	position: { x: 0, y: 0 },
	size: State.cellSize,
	hasLife: false,
	age: 1
}

function setup () {

	createCanvas( windowWidth, windowHeight )
	noStroke()

	createGrid()
	startLife()
}

function draw () {
	State.framesCounted ++

	if(State.framesCounted === State.lifeSpeed) {
		lifeHappens()
		State.framesCounted = 0
	}

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
	const {
		gridH,
		gridW,
		cellSize
	} = State

	while(position.y < gridH) {

		const newCell = {
			...Cell,
			position: { ...position }
		}
		State.cells.push(newCell)

		if(position.x < (gridW - cellSize)) {
			position.x += cellSize
		} else {
			position.y += cellSize
			position.x = 0
		}
	}
}

function startLife () {
	const numOfFirstArivals = 1000
	for (let index = 0; index < numOfFirstArivals; index++) {
		let randomIndex = random(500, 800).toFixed(0)
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
		gridW,
		cellSize
	} = State

	const numOfRows = gridW/cellSize

	const left = cells[cellIndex - 1]
	const right = cells[cellIndex + 1]
	const topMiddle = cells[cellIndex - numOfRows]
	const topRight = cells[(cellIndex - numOfRows) + 1]
	const topLeft = cells[(cellIndex - numOfRows) - 1]
	const bottomMiddle = cells[(cellIndex + numOfRows)]
	const bottomRight = cells[(cellIndex + numOfRows) + 1]
	const bottomLeft = cells[(cellIndex + numOfRows) - 1]

	const arrayOfCells = [ 
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

	arrayOfCells.forEach(cell => {
		if(cell && cell.hasLife) {
			numOfAliveNeighbors++
		}
	})

	return numOfAliveNeighbors
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
		const numOfAliveNeighbors = countLivingNeighbors(index)

		if(cell.hasLife) {
			if(numOfAliveNeighbors < 2 || numOfAliveNeighbors > 3) {
				cell.hasLife = false
			} else if (cell.age > 0.1) {
				cell.age -= 0.1
			}
		} else {
			if(numOfAliveNeighbors === 3) {
				cell.hasLife = true
				cell.age = 1
			}
		}
	}
}


