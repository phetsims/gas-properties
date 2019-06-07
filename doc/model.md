# Gas Properties - model description

This is a high-level description of the model used in Gas Property.

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

## Equations

* Ideal Gas Law: PV = NkT  
* Pressure: P = NkT/V
* Kinetic Energy: KE = (3/2)kT = (1/2) * m * |v|<sup>2</sup>
* Temperature: T = (2/3)KE/k
* Particle Speed: |v| = sqrt( 3kT / m )
* Container Volume: V = width * height * depth

##  Particle System

Particles have mass, radius, location, and velocity.

The particle system has the following qualities:
* rigid-body collision model
* perfectly elastic (no net loss of KE)
* particle-particle collisions use an impulse-based contact model
* no rotational kinematics
* no gravity

TODO: Describe how initial velocity of particles is determined. Angle is randomly chosen from a "dispersion" range.
Speed is based on a Gaussian distribution of mean temperature. Mean temperature is 300K for an empty container, the temperature in the container for a non-empty container, or settable by the user in the _Energy_ screen.

## Container

The left wall of the container is movable in the _Ideal_ and _Explore_ screens. Use it to resize the container,
which changes volume `V`.

In the _Ideal_ screen, the movable wall does no work. While the container is being resized, the sim is paused. 
After completing the resize, particles are redistributed in the new volume.

In the _Explore_ screen, the movable wall does work on particles. It changes the kinetic energy of particles
by changing their speed. After a collision with the left wall occurs, the new X component of a particle's 
velocity is `-( particleVelocity.x - leftWallVelocity.x )`.

When resizing the container in the _Explore_ screen, there is a speed limit on the wall when making
the container smaller.  This speed limit prevents pressure from changing too dramatically, which would 
make it too easy to blow the lid off of the container.

## Collision Detection and Response

TODO

Collision detection occurs only within the container. There is no collision detection performed for particles
that have escaped the container through the open lid.

## Pressure

When particles are added to an empty container, pressure remains zero until 1 particle has collided with
the container. Then all particles `N` contribute to the pressure `P` via `P = NkT/V`.

On each time step, pressure is computed precisely as `P = NkT/V`.  The pressure gauge is given a bit of 
"noise" to make it look more realistic.  The noise is a function of pressure and temperaure. More noise 
is added at lower pressures, but the noise is surpressed as temperature decreases. Noise is disabled 
when pressure is being held constant.
See [PressureGauge](https://github.com/phetsims/gas-properties/blob/master/js/common/model/PressureGauge.js)
if you'd like more specifics. If desired, the noise can be disabled via the `pressureNoise` query paramter.

## Hold Constant

TODO: Describe the "Hold Constant" modes for _Ideal_ screen, which determines which quantity is held constant.






