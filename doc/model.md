TODO model description

Constraints:
 
* rigid body collision model
* perfectly elastic (no net loss of KE)
* particle-particle collisions use an impulse-based contact model
* no rotational kinematics
* no gravity

Constants:

* k = Boltzmann constant, 1.38E-23 (m<sup>2</sup> * kg)/(s<sup>2</sup> * K) === 8.316E-3 (pm<sup>2</sup> * AMU)/(ps<sup>2</sup> * K)

Symbols:

* KE = Kinetic Energy
* m = mass
* N = number of gas molecules (aka particles)
* P = pressure
* t = time
* T = temperature
* v = velocity
* |v| = velocity magnitude (aka speed)
* V = volume
 
Equations:

* PV = NkT  (Ideal Gas Law)
* KE = (3/2)kT = (1/2) * m * |v|<sup>2</sup>
* T = (2/3)KE/k
* |v| = sqrt( 3kT / m )

Units:

* angle: radians
* distance: pm
* kinetic energy: AMU * pm<sup>2</sup> / ps<sup>2</sup>
* location: (pm, pm)
* mass: AMU (unified mass unit, 1 AMU === 1.66E-27 kg)
* pressure: kPa (and atm in view)
* temperature: K (and °C in view)
* time: ps
* velocity: pm / ps
* volume: pm<sup>3</sup>


TODO include calculations for conversions between SI and our units

In the _Explore_ screen, the left (movable) wall does work on particles. After a collision with the left wall
occurs, the new X component of a particle's velocity is `-( particleVelocity.x - leftWallVelocity.x )`.

Speed limit on _Explore_ wall.

PressureV and PressureT modes