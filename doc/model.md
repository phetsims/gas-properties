# Gas Properties - model description

This document is a high-level description of the model used in PhET's _Gas Properties_, _Gases Intro_, and _Diffusion_
simulations.

The model consists of a particle system and a container, engaged in rigid-body collisions.  All quantities (pressure, 
temperature, volume, speed, kinetic energy) are derived from the state of the particle system and the container, using 
the _Ideal Gas Law_.  The model also supports holding one quantity constant while the other quantities are varied.

This description pertains mostly to the _Ideal_, _Explore_, and _Energy_ screens. The _Diffusion_ screen has a simpler
model that does not involve the Ideal Gas Law.

## Units, Constants, and Symbols

First, a description of the units, constants, and symbols used in this sim. Use this section as a reference.

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

#### Constants

* k = Boltzmann constant = 8.316E3 (pm<sup>2</sup> * AMU)/(ps<sup>2</sup> * K), 
[click here](https://github.com/phetsims/gas-properties/blob/master/doc/images/boltzmann-conversion.png) 
for conversion computation

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

## Equations

This section enumerates the primary equations used in the sim. Use this section as a reference.

* Ideal Gas Law: PV = NkT  
* Pressure: P = NkT/V
* Temperature: T = (PV)/(Nk) = (2/3)KE/k
* Volume: V = NkT/P = width * height * depth
* Kinetic Energy: KE = (3/2)kT = (1/2)m|v|<sup>2</sup>
* Particle Speed: |v| = sqrt( 3kT/m ) = sqrt( 2KE/m )

##  Particle System

Particles represent gas molecules. They are rigid bodies that have mass,
radius, location, and velocity. Radius and mass may be modified in the
_Diffusion_ screen, and are fixed in the other screens. Location and
velocity are modified indirectly, as a result of heating/cooling,
changing volume, collisions, etc.
   
The collection of all particles is referred to as the particle system. It has the following qualities:
* `N` is the number of particles in the container
* no rotational kinematics (particles do not rotate)
* no gravity (so no acceleration)

All quantities (`P`, `T`, `V`, `v`, `KE`) are derived from the state of the particle system and the container.

There is a limited inventory of particles (limited `N`), as indicated by the "Number of Particles" spinners and 
the gauge on the bicycle pump. When particles escape the container through its open lid, they are immediately 
returned to the inventory. Since there is no gravity, particles that escape the container float upwards, and 
are deleted from the sim when they disappear from view.

When a particle is added to the container:
* Initial angle is randomly chosen from the dispersion
range of the bicycle pump, which is `MATH.PI/2`.  
* Initial speed is based on a desired amount of kinetic energy that will result in a desired
temperature. By default, the current temperature of the container is used.  If the container is empty (and thus has 
no temperarture) then `300K` is used. On the _Energy_ screen, the user may optionally set this temperature. When multiple particles are added to the container simultaneously, this temperature is treated as a mean temperature, and individual particle speeds are based on a Gaussian distribution of the mean temperature.  Temperature is used to compute kinetic energy via `KE = (3/2)Tk`, and speed is then computed via `|v| = Math.sqrt( 2KE/m )`.

## Container

The container is a 3-dimensional box. In the _Ideal_ and _Explore_ screen, the width (and thus volume `V`) 
can be changed by moving the container's left wall.

In the _Ideal_ screen, the left wall does no work. While the container is being resized, the sim is paused. 
After completing the resize, particles are redistributed in the new volume.

In the _Explore_ screen, the left wall does work on particles. It changes the kinetic energy of particles
by changing their speed. After a collision with the left wall occurs, the new x-component of a particle's 
velocity is `-( particleVelocity.x - leftWallVelocity.x )`.

When resizing the container in the _Explore_ screen, there is a speed limit on the wall when making
the container smaller.  This speed limit prevents pressure from changing too dramatically, 
which would make it too easy to blow the lid off of the container.

## Collision Detection and Response

This sim uses a rigid-body, perfectly-elastic (no net loss of kinetic
energy) collision model. _Collision detection_ identifies when two
objects in motion intersect. When a collision has been detected between
two objects, _collision response_ determines what affect that collision
has on their motion.

Collision detection occurs only within the container. There is no collision detection performed for particles
that have escaped the container through the open lid. Collision detection is a posteriori (detected after a
collision occurs).

Collision detection is optimized using a technique called [spatial partitioning](https://en.wikipedia.org/wiki/Space_partitioning). The collision detection
space is partitioned into a 2D grid of cells that we refer to as regions. Rather than having to consider 
collisions between every object in the system, only objects within the same region need to be considered.
This greatly reduces the number of tests required.

Two types of collisions are supported: particle-particle, and particle-container. 
* Particle-particle collisions
occur between 2 particles, and use an [impulse-based contact model](https://en.wikipedia.org/wiki/Collision_response#Impulse-based_contact_model). Particle-particle
collision are based solely whether they intersect at their current locations. Is is possible (and acceptable)
for two particles to pass through the same point on the way to those location and not collide. 
Particle-particle may be disabled in the _Energy_ screen.  
* Particle-container collisions occur between a particle and a wall of the container, 
and are counted for display by the Collision Counter.  These collisions occur if a particle contacted a wall
on its way to its current location.

The _Diffusion_ screen adds a removable vertical divider to the container.  When the divider is in place,
collision detection treats the container as 2 separate containers, where the divider functions as 
a container wall.

## Pressure

When particles are added to an empty container, pressure remains zero until 1 particle has collided with
the container. Then all `N` particles contribute to the pressure `P` via `P = NkT/V`.

On each time step, pressure is computed precisely as `P = NkT/V`. The
pressure gauge is given a bit of "noise" to make it look more realistic.
The noise is a function of pressure and temperature. More noise is added
at lower pressures, but the noise is suppressed as temperature
decreases. Noise is disabled when pressure is being held constant. See
`PressureGauge` if you'd like more specifics. If desired, noise can be disabled via
query parameter `pressureNoise=false`.

## Hold Constant

In the _Ideal_ screen, the user may specify which quantity in `PV = NkT` is to be held 
constant.  The table below summarizes the behavior.  

| Hold Constant | change N | change T  | change V |
| --- | --- | --- | --- |
| Nothing | P changes | P changes | P changes |
| Volume (V) | P changes | P changes | - |
| Temperature (T) | P changes | - | P changes |
| Pressure ↕V | V changes | V changes | - |
| Pressure ↕T | T changes | - | T changes |

The _Ideal_ screen has a default setting of "Nothing". The _Explore_ screen has a fixed setting of "Nothing". The _Energy_ screen has a fixed setting of "Volume".  (This feature is irrelevant in the _Diffusion_ screen.) 

If a change would result in a situation that is nonsensical (e.g.
holding temperature constant with no particles) or violates the
constraints of the simulation (e.g. requires a larger container volume
than supported), the sim automatically switches to "Nothing" and
notifies the user via a dialog.
