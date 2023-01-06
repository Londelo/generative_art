const particles = [],
groups = [],
particleAmount = 2,
particleColor = "yellow"

function setup () {

	createCanvas( windowWidth, windowHeight)
	noStroke()

	for(let i = 0; i < 100; i++) {
		const particle = new Particle({x: random(0, windowWidth), y: random(0, windowHeight), color: particleColor})
		particles.push(particle)
		groups.push(particle)
	}

}

function draw () {

	background("black")

	for (let index = 0; index < particles.length; index++) {
		const particle = particles[index];
		particle.draw()
	}
}

function Particle ({ x, y, color }) {

	this.params = {
		x, y, 
		color,
		vx: 0,
		vy: 0,
		size: 20
	}

	this.draw = () => {
		fill(this.params.color)
		circle(this.params.x, this.params.y, this.params.size)
	}
}

function rule(part1, part2, g) {

	fx = 0
	fy = 0

	a = part1[0]
	b = part2[1]
	dx = a.x-b.x
	dy = a.y-b.y
	d = Math.sprt( dx*dx + dy*dy )
	
	if(d > 0) {
		F = g * 1/d
		fx += (F * dx)
		fy += (F * dy)
	}

	a.x += fx
	a.y += fy
}