TODO model description

Constraints:
 
* rigid body collision model
* perfectly elastic (no net loss of KE)
* particle-particle collisions use an impulse-based contact model
* no rotational kinematics
* no gravity

Constants:

* k = Boltzmann constant, 1.38E-23 (m<sup>2</sup> * kg)/(s<sup>2</sup> * K) === 8.316E-3 (nm<sup>2</sup> * AMU)/(ps<sup>2</sup> * K)

Symbols:

* KE = Kinetic Energy
* m = mass
* N = number of gas molecules (aka particles)
* p = momentum
* P = pressure
* t = time
* T = temperature
* v = velocity
* |v| = velocity magnitude
* V = volume
 
Equations:

* PV = NkT
* KE = (3/2)kT = (1/2) * m * |v|<sup>2</sup>
* |v| = sqrt( 3kT / m )
* p = m * v

Units:

* angle: radians
* distance: nm
* kinetic energy: AMU * nm<sup>2</sup> / ps<sup>2</sup>
* location: (nm, nm)
* mass: AMU (unified atomic mass unit, 1 AMU === 1.66E-27 kg)
* momentum: AMU * nm / ps
* pressure: kPa (and atm in view)
* temperature: K (and C in view)
* time: ps
* velocity: nm / ps
* volume: nm<sup>3</sup>
