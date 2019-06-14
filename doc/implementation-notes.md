# Gas Properties - implementation notes

This document contains notes related to the implementation of Gas Properties. 
This is not an exhaustive description of the implementation.  The intention is 
to provide a high-level overview, and to supplement the internal documentation 
(source code comments) and external documentation (design documents).  

Before reading this document, you must read:
* [model.md](https://github.com/phetsims/gas-properties/blob/master/doc/model.md), a high-level description of the simulation model

In addition to this document, you are encouraged to be read: 
* [PhET Development Overview](http://bit.ly/phet-html5-development-overview)  
* [PhET Software Design Patterns](https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md)
* [Gas Properties HTML5](https://docs.google.com/document/d/1HOCO6vXfqlHIf3MrdldaiZTPFKYWTzS9Jm8fw-b25EU/edit), the design document

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

**Color Profiles**: This sim has 2 color profiles: "default" and "projector", defined in [GasPropertiesColorProfile](https://github.com/phetsims/gas-properties/blob/master/js/common/GasPropertiesColorProfile.js). The "projector" profile is used when the sim is switched into projector mode via `PhET menu > Options > Projector Mode`.  The majority of colors in this sim are therefore axon `Properties` that are part of `GasPropertiesColorProfile`.  You can experiment with 
different colors in your working copy using [gas-properties-colors.html](https://github.com/phetsims/gas-properties/blob/master/gas-properties-colors.html). 

**Assertions**: The implementation makes heavy use of `assert` to verify pre/post assumptions and perform type checking. 
As an experiment, this sim performs type-checking for almost all function arguments via `assert`.  While this may look like overkill, it did catch quite a few problems during refactoring, and was a net gain.  If you are making modifications to this sim, do so with assertions enabled via the `ea` query parameter.

## _Ideal_, _Explore_, and _Energy_ screens

The _Ideal_, _Explore_, and _Energy_ screens have much in common, as they are all based on application of the Ideal Gas Law. So there is much sharing of model and view components. Code shared by these screens lives in `js/common/`.

### Model

[BaseModel](TODO) is the model base class for all screen (including _Diffusion_). It provides functionality that is NOT related to the Ideal Gas Law, `PV = NkT`. 

[GasPropertiesModel](TODO) is a subclass of `BaseModel` that adds functionality related to the Ideal Gas Law. It delegates some responsibilites to the following sub-models:

* [ParticleSystem](https://github.com/phetsims/gas-properties/blob/master/js/common/model/ParticleSystem.js) - responsible the particle system, including the number of particles `N`
* [BaseContainer](https://github.com/phetsims/gas-properties/blob/master/js/common/model/BaseContainer.js) - responsible for the container, including its volume `V`
* [PressureModel](https://github.com/phetsims/gas-properties/blob/master/js/common/model/PressureModel.js) - responsible for pressure `P`, and the "noise" in the [PressureGauge](https://github.com/phetsims/gas-properties/blob/master/js/common/model/PressureGauge.js)
* [TemperatureModel](https://github.com/phetsims/gas-properties/blob/master/js/common/model/TemperatureModel.js) - responsible for temperature `T` and the [Thermometer](https://github.com/phetsims/gas-properties/blob/master/js/common/model/Thermometer.js) 

Each screen has its own subclass of `GasPropertiesModel`. They are [IdealModel](https://github.com/phetsims/gas-properties/blob/master/js/ideal/model/IdealModel.js), [ExploreMode](https://github.com/phetsims/gas-properties/blob/master/js/explore/model/ExploreModel.js), and [EnergyModel](https://github.com/phetsims/gas-properties/blob/master/js/energy/model/EnergyModel.js).  

While `IdealModel` and `ExploreMode` have no significant differences or minor variations, the _Energy_ screen has additional features that are implemented by these sub-models of `EnergyModel`:

* [AverageSpeedModel](https://github.com/phetsims/gas-properties/blob/master/js/energy/model/AverageSpeedModel.js) - responsible for data in the "Average Speed" accordion box
* [HistogramsModel](https://github.com/phetsims/gas-properties/blob/master/js/energy/model/HistogramsModel.js) - responsible for data on the "Speed" and "Kinetic Energy" histograms

All other model components in these screens are straightforward and will not be described here.

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

All other view components in these screens are straightforward and will not be described here.

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

All other model components in this screen are straightforward and will not be described here.

### View

The main view class is [DiffusionScreenView](https://github.com/phetsims/gas-properties/blob/master/js/diffusion/view/DiffusionScreenView.js). Like the other screens, it is a subclass of [BaseScreenView](https://github.com/phetsims/gas-properties/blob/master/js/common/view/BaseScreenView.js), which
provides view functionality that is common to all screens.

The container view is [DiffusionContainerNode](https://github.com/phetsims/gas-properties/blob/master/js/diffusion/view/DiffusionContainerNode.js). It is unique to this screen, and shares nothing with the previous screens. 

The particle system view is [DiffusionParticleSystemNode](https://github.com/phetsims/gas-properties/blob/master/js/diffusion/view/DiffusionParticleSystemNode.js), a subclass of the same [ParticlesNode](https://github.com/phetsims/gas-properties/blob/master/js/common/view/ParticlesNode.js) used 
by the other screens, and based `Canvas`.  Since all particles are confined to the container, a since `Canvas` is used.

All other view components in this screen are straightforward and will not be described here.

## Related Simulations

**Gases Intro**: This sim consists of 2 screens, both of which are based on the _Ideal_ screen.  The _Intro_ screen
is the _Ideal_ screen with the "Hold Constant" radio buttons removed.  The _Laws_ screen is the _Ideal_ screen with
no modifications.  While _Gas Properties_ has noise turned on for the pressure gauge, the _Gases Intro_ sim has it
turned off by default.  See `PhET menu > Options... > Pressure Noise` or the `pressureNoise` query parameter.

**Diffusion**: This is sim consists of the _Diffusion_ screen with no modifications.
