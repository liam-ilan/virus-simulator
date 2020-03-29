// settings
const world = {
  severity: 0.2,
  recoveryTime: 300,
  activity: 10,
  infectionRadius: 15,
  infectionProb: 0.01,
  population: 100
}

// elements
const simulationEl = document.getElementById('simulation') 
const deathEl = document.getElementById('deaths')
const infectedEl = document.getElementById('infected')
const immuneEl = document.getElementById('immune')
const untouchedEl = document.getElementById('untouched')

const severitySlider = document.getElementById('severity')
const recoverySlider = document.getElementById('recovery')
const activitySlider = document.getElementById('activity')
const radiusSlider = document.getElementById('radius')

const restart = document.getElementById('restart')

// list of particles for use later
let particleList = []

// person
class Particle {
  constructor() {
    // id
    this.id = Math.random()

    // add self to particleList
    particleList.push(this)

    // make element
    this.el = document.createElement('div')
    this.el.classList.add('particle')
    simulationEl.appendChild(this.el)

    // get radius
    this.radius = this.el.offsetWidth / 2

    // init velocities
    this.vx = 0
    this.vy = 0

    // init state
    this.setState('susceptible')

    // flag
    this.dead = false

    // init time
    this.infectedTime = Infinity
    this.time = 0

    // init position
    this.goTo(0, 0)

    // begin loop
    this.loop()
  }

  // returns all particles in radius r
  inRadius(r) {

    // filter
    return particleList.filter((particle) => {

      // calculate dist
      let xDist = Math.abs(this.x - particle.x)
      let yDist = Math.abs(this.y - particle.y)

      let dist = Math.sqrt(xDist * xDist + yDist * yDist)

      // if dist < radii, include
      return dist < r + particle.radius && this.id !== particle.id
    })
  }

  // sets state
  setState(state) {
    this.state = state

    if (state === 'infected') {this.infectedTime = this.time}
  }

  // go to x, y
  goTo(x, y) {
    this.x = x
    this.y = y
  }

  // applies force
  force(angle, power) {
    this.vx = Math.cos(angle * Math.PI / 180) * power
    this.vy = Math.sin(angle * Math.PI / 180) * power
  }

  kill() {
    simulationEl.removeChild(this.el)
    particleList = particleList.filter((particle) => particle.id !== this.id)
    delete this
  }

  // one cycle of loop
  loop() {

    // update state
    if (this.time - this.infectedTime > world.recoveryTime && this.dead !== true) {
      // flag
      this.dead = true

      // set immune if enough time passed
      this.setState('immune')

      // kill if severe
      if (Math.random() < world.severity) {this.kill()}
    }

    // update color
    if (this.state === 'susceptible') this.el.style.backgroundColor = 'white'
    if (this.state === 'infected') this.el.style.backgroundColor = 'red'
    if (this.state === 'immune') this.el.style.backgroundColor = 'blue'

    // apply activity
    if (this.vx < 0.1 && this.vy < 0.1) {

      // reset velocity
      this.vx = 0
      this.vy = 0

      // apply force
      this.force(Math.random() * 360, world.activity * Math.random())
    }

    // infect all in infection radius if self is infected and other particle is susceptible, and chance is right
    if (this.state === 'infected') {
      this.inRadius(world.infectionRadius).forEach((particle) => {
        if (particle.state === 'susceptible' && Math.random() < world.infectionProb) particle.setState('infected')
      })
    }

    // apply velocities
    this.x += this.vx
    this.y += this.vy

    // apply friction
    this.vx = this.vx * 0.95
    this.vy = this.vy * 0.95

    // wrap
    this.x = ((this.x % simulationEl.offsetWidth) + simulationEl.offsetWidth) % simulationEl.offsetWidth
    this.y = ((this.y % simulationEl.offsetHeight) + simulationEl.offsetHeight) % simulationEl.offsetHeight

    // update position
    this.el.style.left = `${this.x - this.radius}px`
    this.el.style.top = `${this.y - this.radius}px`

    // update time
    this.time += 1
  }
}

function start () {
  particleList.forEach((item) => item.kill())

  // make 100 particles
  for (let i = 0; i < 100; i++) {

    // particle
    let particle = new Particle()

    // got to random position
    particle.goTo(Math.random() * simulationEl.offsetWidth, Math.random() * simulationEl.offsetHeight)

    // set one particle to infected
    if (i % world.population === 0) {
      particle.setState('infected')
    }
  }
}

// begin loop
setInterval(() => {
  // run loop for every particle
  particleList.forEach((particle) => particle.loop())

  // update counts
  deathEl.innerText = `Deaths: ${world.population - particleList.length}`
  infectedEl.innerText = `Infected: ${particleList.filter((particle) => particle.state === 'infected').length}`
  immuneEl.innerText = `Immune: ${particleList.filter((particle) => particle.state === 'immune').length}`
  untouchedEl.innerText = `Untouched: ${particleList.filter((particle) => particle.state === 'susceptible').length}`
}, 16)

// start
start()

// slider events
severitySlider.addEventListener('change', () => world.severity = parseInt(severitySlider.value));
recoverySlider.addEventListener('change', () => world.recoveryTime = parseInt(recoverySlider.value));
activitySlider.addEventListener('change', () => world.activity = parseInt(activitySlider.value));
radiusSlider.addEventListener('change', () => world.infectionRadius = parseInt(radiusSlider.value));

// restart button
restart.addEventListener('click', start)