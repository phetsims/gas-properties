TODO model description

Constraints:
 
* rigid body collision model
* no rotational kinematics
* no gravity

Constants:

* k = Boltzmann constant, 1.38E-23 (m^2 * kg)/(s^2 * K) => 8.316E-3 (nm^2 * AMU)/(ps^2 * K)

Symbols:

* KE = Kinetic Energy
* m = mass
* N = number of gas molecules (aka particles)
* p = momentum
* P = pressure
* t = time
* T = temperature
* v = velocity
* V = volume
 
Equations:

* PV = NkT
* KE = (3/2) * k * T = 0.5 * m * v^2
* v = sqrt( 3 * k * T / m )
* p = m * v

Units:

* distance = nm
* kinetic energy = AMU * nm^2 / ps^2
* location = (nm, nm)
* mass = AMU (unified atomic mass unit, 1 AMU === 1.66E-27 kg)
* momentum = AMU * nm / ps
* pressure = kPa (and atm in view)
* temperature = K (and C in view)
* time = ps
* velocity = nm / ps
* volume = nm^3
