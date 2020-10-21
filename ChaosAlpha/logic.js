let ChaosPoints = []

function setup() {

  createCanvas( windowWidth, windowHeight, WEBGL)

  for (let index = 0; index < 100; index++) {
    const ChaosPoint = new _ChaosPoint
    ChaosPoints.push(ChaosPoint)
  }

}

function draw() {
  // background("cream")
  
  if(frameCount % 100) {
    for (let index = 0; index < ChaosPoints.length; index++) {
      const ChaosPoint = ChaosPoints[index];
      ChaosPoint.tictoc()
      ChaosPoint.move()
      ChaosPoint.draw()
    }
  }
}

function _ChaosPoint() {
  
  const position = {
    x: random(-5000, 5000),
    y: random(-5000, 5000),
    z: -3000
  }
  const size = 10,
        timeVelocity = 0.1
  let tstart = -3,
      t = tstart,
      tend = 3

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
        y = position.y,
        z = position.z
    x = x * t - y 
    y = y - t * t + x
    position.x = Number(x.toFixed(5))
    position.y = Number(y.toFixed(5))
    // position.z = Number(z.toFixed(5))

    console.log(position, "time",t)
  }

  this.tictoc = () => {
    if(t < tend) {
      t += timeVelocity
      t = Number(t.toFixed(5))
    } else {
      t -= timeVelocity
      t = Number(t.toFixed(5))
    }
  }

}