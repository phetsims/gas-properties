# Gas Properties - model description

This is a high-level description of the model used in Gas Property. It's intended for audiences
that are not necessarily technical.

The model is based on the application of the _Ideal Gas Law_ to the state of a particle system. The particle
system is engaged in rigid-body collision behavior between particles and a container.
All quantities (pressure, temperature, kinetic energy) are derived from the statue of the particle system.

## Constants, Symbols, and Units

First, a description of the constants, symbols, and units used in this sim. Use this section as a reference.

#### Constants

* k = Boltzmann constant, 8.316E-3 (pm<sup>2</sup> * AMU)/(ps<sup>2</sup> * K), [click here](https://github.com/phetsims/gas-properties/blob/master/doc/images/boltzmann-conversion.png) for conversion computation

#### Symbols

* KE = Kinetic Energy
* m = mass
* N = number of gas molecules (aka particles)
* P = pressure
* t = time
* T = temperature
* v = velocity
* |v| = velocity magnitude (aka speed)
* V = volume of the container

#### Units

The model does not use typical SI units. Units where chosen so that we would be working with values that have a 
significant integer component, and not working with very small values.  Working with very small values tends to 
result in floating-point errors. So (for example) dimensions are in picometers (pm) rather than meters (m).

The units used in this sim are:
* angle: radians
* distance: pm
* kinetic energy: AMU * pm<sup>2</sup> / ps<sup>2</sup>
* location: (pm, pm)
* mass: AMU (atomic mass unit, 1 AMU = 1.66E-27 kg)
* pressure: kPa (and atm in view)
* temperature: K (and °C in view)
* time: ps
* velocity: pm / ps
* volume: pm<sup>3</sup>

### Equations

* Ideal Gas Law: PV = NkT  
* Pressure: P = NkT/V
* Kinetic Energy: KE = (3/2)kT = (1/2) * m * |v|<sup>2</sup>
* Temperature: T = (2/3)KE/k
* Particle Speed: |v| = sqrt( 3kT / m )
* Container Volume: V = width * height * depth

### Particle System

Particles have mass, radius, location, and velocity.

The particle system has the following qualities:
* rigid body collision model
* perfectly elastic (no net loss of KE)
* particle-particle collisions use an impulse-based contact model
* no rotational kinematics
* no gravity

### Container

work, no work

In the _Explore_ screen, the left (movable) wall does work on particles. After a collision with the left wall
occurs, the new X component of a particle's velocity is `-( particleVelocity.x - leftWallVelocity.x )`.

Speed limit on _Explore_ wall.

### Hold Constant

Describe "Hold Constant" modes for _Ideal_ screen.

### Misc

TODO include calculations for conversions between SI and our units, specifically:
* Boltzmann constant
* pressure in kPa

Temperature and particles added to container, Gaussian distribution




