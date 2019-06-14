# Gas Properties - implementation notes

This document contains notes related to the implementation of Gas Properties. 
This is not an exhaustive description of the implementation.  The intention is 
to provide a high-level overview, and to supplement the internal documentation 
(source code comments) and external documentation (design documents).  

The audience for this document is software developers who are familiar with JavaScript 
and PhET simulation development, as described in 
[PhET Development Overview](http://bit.ly/phet-html5-development-overview).  The reader should also be familiar with [design patterns](https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md) used in PhET simulations.

Before reading this document, see [model.md](https://github.com/phetsims/gas-properties/blob/master/doc/model.md), 
which provides a high-level description of the simulation model.

The design document for this sim is [Gas Properties HTML5](https://docs.google.com/document/d/1HOCO6vXfqlHIf3MrdldaiZTPFKYWTzS9Jm8fw-b25EU/edit).

Terminology TODO

Memory management: With the exception of Particle instances, all object instances persist for the 
lifetime of the sim.  There is no need to `unlink`, `removeListener`, `dispose`, etc. 

Collision detection:
* reference: https://en.wikipedia.org/wiki/Collision_detection
* detected after collision occurs (a posteriori, discrete)
* pruning via spatial partitioning (regions)

Collision response:
* reference: https://en.wikipedia.org/wiki/Collision_response
* impulse-based contact model

The `dt` for all top-level ScreenView and Model classes is in seconds, because that's what is 
provided by `Sim` when it steps the simulation. All other `dt` values are in picoseconds.

To avoid working with very small numbers and encountering potential 
float-point errors, we are not using SI units in the model.  For example,
KE (Kinetic Energy) is typically in J, which is _kg * m<sup>2</sup> / s<sup>2</sup>_.
We're using _AMU * pm<sup>2</sup> / ps<sup>2</sup>_.  
See [model.md](https://github.com/phetsims/gas-properties/blob/master/doc/model.md) 
for the full list of units used in the model.

Diffusion screen vs the other 3 screens

Most important classes are [GasPropertiesModel](TODO), [DiffusionModel](TODO) and [CollisionDetector](TODO)

Important class hierarchies, note symmetry:

Model:
```
BaseModel
  GasPropertiesModel
    IdealModel
    ExploreModel
    EnergyModel
  DiffusionModel
  
BaseContainer
  GasPropertiesContainer
  DiffusionContainer
```
  
View:
```
BaseScreenView
  GasPropertiesScreenView( GasPropertiesModel )
    IdealScreenView( IdealModel ), IdealViewProperties
    ExploreScreenView( ExploreModel ), ExploreViewProperties
    EnergyScreenView( EnergyModel ), EnergyViewProperties
  DiffusionScreenView( DiffusionModel ), DiffusionViewProperties
  
GasPropertiesViewProperties
  IdealViewProperties
  ExploreViewProperties
  EnergyViewProperties
DiffusionViewProperties
```

I experimented with type-checking all function arguments via `assert`.  Feels like
overkill, but it did catch quite a few things during refactoring, so probably was 
a net gain.
