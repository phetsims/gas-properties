# Gas Properties - implementation notes

This document contains notes related to the implementation of Gas Properties. 
This is not an exhaustive description of the implementation.  The intention is 
to provide a high-level overview, and to supplement the internal documentation 
(source code comments) and external documentation (design documents).  

In addition to this document, you are incouraged to be read: 
* [PhET Development Overview](http://bit.ly/phet-html5-development-overview)  
* [PhET Software Design Patterns](https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md)
* [Gas Properties HTML5](https://docs.google.com/document/d/1HOCO6vXfqlHIf3MrdldaiZTPFKYWTzS9Jm8fw-b25EU/edit), the design document
[model.md](https://github.com/phetsims/gas-properties/blob/master/doc/model.md), a high-level description of the simulation model

## Terminology

This section defines terminology that you'll see used throughout the internal and external documentation. Skim this section once, and refer back to it as you explore the implementation.

Much of the terminology for this sim is identified by labels that are visible in the user interface (Stopwatch, 
Collision Detector, Particle Flow Rate, Divider, ...)  Here's the relatively short list of other terms:

* _container_ - the box that contains the particles
* _resize handle_ - handle on the left wall of the container, used to change the container's volume
* _lid_ - the cover on the top of the container, used to open/close an opening in the top of the container
* _particle_ - a gas molecule
* _particle system_ - the complete collection of particles, inside and outside the container

## Common Patterns

**Coordinate Transforms**: The model coordinate frame is in picometers (pm), with +x right, +y up. The standard (scenery) view coordinate frame has +x right, +y down. The transform is therefore a scaling transform that inverts the y axis. See [BaseModel](https://github.com/phetsims/gas-properties/blob/master/js/common/model/BaseModel.js) for specifics.

**Time Transforms**: Real time (seconds) is scaled to sim time (picoseconds) by [TimeTransform](https://github.com/phetsims/gas-properties/blob/master/js/common/model/TimeTransform.js). Transforms are provided for "normal" and "slow" sim times.  The `dt` for all top-level ScreenView and Model classes is in seconds, because that's 
what is provided by `Sim.js` when it steps the simulation. The `dt` values for all other methods are in picoseconds.
(The units for `dt` are clearly documented throughout the code.)

**Memory Management**: With the exception of [Particle](https://github.com/phetsims/gas-properties/blob/master/js/common/model/Particle.js) instances, all object instances (model and view) persist for the 
lifetime of the sim.  There is no need to call `unlink`, `removeListener`, `dispose`, etc. 

**Query Parameters**: Query parameters are used to enable sim-specific features, mainly for debugging and
testing. Sim-specific query parameters are documented in
[GasPropertiesQueryParameters](https://github.com/phetsims/gas-properties/blob/master/js/common/GasPropertiesQueryParameters.js).

**Color Profiles**: This sim has 2 color profiles: "default" and "projector", defined in [GasPropertiesColorProfile](https://github.com/phetsims/gas-properties/blob/master/js/common/GasPropertiesColorProfile.js). The "projector" profile is used when the sim is switched into projector mode via `PhET menu > Options > Projector Mode`.  

**Assertions**: The implementation makes heavy use of `assert` to verify pre/post assumptions and perform type checking. 
As an experiment, this sim performs type-checking almost all function arguments via `assert`.  In retrospect, this feels like overkill, but it did catch quite a few problems during refactoring, and was a net gain.  If you are making modifications to this sim, do so with assertions enabled via the `ea` query parameter.

## _Ideal_, _Explore_, and _Energy_ screens

The _Ideal_, _Explore_, and _Energy_ screens have much in common, as they are all based on application of 
the Ideal Gas Law. So there is much sharing of model and view components. 

### Model

Collision detection:
* reference: https://en.wikipedia.org/wiki/Collision_detection
* detected after collision occurs (a posteriori, discrete)
* pruning via spatial partitioning (regions)

Collision response:
* reference: https://en.wikipedia.org/wiki/Collision_response
* impulse-based contact model



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

### View
  
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

## _Diffusion_ screen
 
Unlike the other screens, the _Diffusion_ screen is not based on the Ideal Gas Law. So while it shares some 
base-level code, it has less in common with the other screens, and has some components that are unique to it. 

### Model

The main model class is [DiffusionModel](https://github.com/phetsims/gas-properties/blob/master/js/diffusion/model/DiffusionModel.js). Like the model in the other screens, it is a subclass of [BaseModel](https://github.com/phetsims/gas-properties/blob/master/js/common/model/BaseModel.js), which provides
model functionality that is _not_ related to the Ideal Gas Law. `DiffusionModel` delegates some responsibilities
to these sub-models:

* [DiffusionData](https://github.com/phetsims/gas-properties/blob/master/js/diffusion/model/DiffusionData.js) - responsible for the information shown in the "Data" accordion box
* [ParticleFlowRateModel](https://github.com/phetsims/gas-properties/blob/master/js/diffusion/model/ParticleFlowRate.js) - responsible for computing particle flow rates

The container, [DiffusionContainer](https://github.com/phetsims/gas-properties/blob/master/js/diffusion/model/DiffusionContainer.js), has no lid, but adds a removable vertical divider. 

Collision detection is handled in [DiffusionCollisionDetector](https://github.com/phetsims/gas-properties/blob/master/js/diffusion/model/DiffusionCollisionDetector.js), a subclass of the same 
[CollisionDetector](https://github.com/phetsims/gas-properties/blob/master/js/common/model/CollisionDetector.js) used in the other screens. When the divider is in place, `DiffusionCollisionDetector` treats the container as 2 separate containers, with the divider playing the role of a container's wall.  All other aspects of collision detection and response are 
identical.

The two species of particles are (for lack of better names) [DiffusionParticle1](https://github.com/phetsims/gas-properties/blob/master/js/diffusion/model/DiffusionParticle1.js) and [DiffusionParticle2](https://github.com/phetsims/gas-properties/blob/master/js/diffusion/model/DiffusionParticle2.js).  While all `Particles` support mutable mass and radius,  _Diffusion_ is the only screen that exercises this feature.

### View

The main view class is [DiffusionScreenView](https://github.com/phetsims/gas-properties/blob/master/js/diffusion/view/DiffusionScreenView.js). Like the other screens, it is a subclass of [BaseScreenView](https://github.com/phetsims/gas-properties/blob/master/js/common/view/BaseScreenView.js), which
provides view functionality that is common to all screens.

## Related Simulations

**Gases Intro**: This sim consists of 2 screens, both of which are based on the _Ideal_ screen.  The _Intro_ screen
is the _Ideal_ screen with the "Hold Constant" radio buttons removed.  The _Laws_ screen is the _Ideal_ screen with
no modifications.  While _Gas Properties_ has noise turned on for the pressure gauge, the _Gases Intro_ sim has it
turned off by default.  See `PhET menu > Options... > Pressure Noise` or the `pressureNoise` query parameter.

**Diffusion**: This is sim consists of the _Diffusion_ screen with no modifications.
