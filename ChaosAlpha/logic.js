let ChaosPoints = []

function setup() {

  createCanvas( windowWidth, windowHeight, WEBGL)

  for (let index = 0; index < 10; index++) {
    const ChaosPoint = new _ChaosPoint
    ChaosPoints.push(ChaosPoint)
  }

}

function draw() {
  // background("cream")
  
  for (let index = 0; index < ChaosPoints.length; index++) {
    const ChaosPoint = ChaosPoints[index];
    ChaosPoint.tictoc()
    ChaosPoint.move()
    ChaosPoint.draw()
  }
}

function _ChaosPoint() {
  
  const position = {
    x: random(0, windowWidth),
    y: random(0, windowHeight),
    z: -5000
  }
  const size = 10,
        timeVelocity = 0.001
  let t = -10

  this.draw = () => {
      push()
			fill("white")
			translate(
				position.x,
				position.y,
				position.z)
			sphere(size, 100, 100);
			pop()
  }

  this.move = () => {
    let x = position.x,
        y = position.y
    x = x + t * y * x  / windowWidth
    y = y + t - x * y / windowHeight
    position.x = Number(x.toFixed(3))
    position.y = Number(y.toFixed(3))
    console.log(position.x, t)
  }

  this.tictoc = () => {
    t += timeVelocity
  }

}