# Virus Playground
## An attempt to simulate the spread of a virus

### About
After watching [3Blue1Brown's video on simulating an epidemic](https://youtu.be/gxAaO2rsdIs), I decided to give a shot at simulating a virus myself. This repository contains an interactive model of a virus. A public version can be found here: https://liam-ilan.github.io/virus-simulator/.

### Rules
Each particle (person) has a set of attributes:
- State: Susceptible (Black), Infected (Red), or Immune (Blue).
- Activity / Movement Speed: This number is multiplied by a random number between 0 and 1 every time the particles velocity reaches 0. Then, it uses this new number as the force, and picks a random direction to apply a vector to the particle.
- Infection Radius: The radius in which a particle can infect another particle.
- Recovery Time: The number of frames it take to recover from a virus. After this time, the particle will either die, or become immune.
- Severity: How likely the virus is to kill the particle (remove the particle).
- Infection Probability: For each frame a particle is in the radius of an infected particle, this is the chance for it to get infected.

The worlds edges can be either wrapping or blocking. In the case of this simulation, I chose wrapping.

In my version the simulation, there are only 4 dynamic variables (Severity, Recovery Time, Movement Speed, Infection Radius). The population is set at 100, and the infection probability is set to 0.01 (1% every frame).

### Running it yourself
First, clone this repository:
``` bash
  git clone https://github.com/liam-ilan/virus-simulator.git
```

Then, run with PHP localhost on port 8000:
``` bash
  php -S localhost:8000
```

### Credit
- Thanks to 3Blue1Brown for inspiration
- All software written by [Liam Ilan](https://liamilan.surge.sh)