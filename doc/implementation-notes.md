# Gas Properties - implementation notes

This document contains notes related to the implementation of Gas Properties. 
This is not an exhaustive description of the implementation.  The intention is 
to provide a high-level overview, and to supplement the internal documentation 
(source code comments) and external documentation (design documents).  

Before reading this document, you must read:
* [model.md](https://github.com/phetsims/gas-properties/blob/master/doc/model.md), a high-level description of the simulation model

In addition to this document, you are encouraged to read: 
* [PhET Development Overview](https://github.com/phetsims/phet-info/blob/master/doc/phet-development-overview.md)  
* [PhET Software Design Patterns](https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md)
* [Gas Properties HTML5](https://docs.google.com/document/d/1HOCO6vXfqlHIf3MrdldaiZTPFKYWTzS9Jm8fw-b25EU/edit), the design document

## Terminology

This section defines terminology that you'll see used throughout the internal and external documentation. Skim this section once, and refer back to it as you explore the implementation.

Much of the terminology for this sim is identified by labels that are visible in the user interface (Stopwatch, 
Collision Detector, Particle Flow Rate, Separator, ...) and those terms are not included here.

Here's the (relatively short) list of terms that might be unclear:

* _container_ - the box that contains the particles
* _resize handle_ - handle on the left wall of the container, used to change the container's volume
* _lid_ - the cover on the top of the container, used to open/close an opening in the top of the container
* _particle_ - a gas molecule
* _particle system_ - the complete collection of particles, inside and outside the container

## General Considerations

This section describes how this simulation addresses implementation considerations that are typically encountered in PhET simulations.

**Coordinate Transforms**: The model coordinate frame is in picometers (pm), with +x right, +y up. The standard (scenery) view coordinate frame has +x right, +y down. The transform is therefore a scaling transform that inverts the y axis. See `BaseModel` for specifics.

**Time Transforms**: Real time (seconds) is scaled to sim time (picoseconds) by `TimeTransform`. Transforms are provided
for "normal" and "slow" sim times. The `dt` for all top-level ScreenView and Model classes is in seconds, because that's
what is provided by `Sim.js` when it steps the simulation. The `dt` values for all other methods are in picoseconds.
(The units for `dt` are clearly documented throughout the code.)

**Memory Management**: With the exception of `Particle` instances, all object instances (model and
view) persist for the
lifetime of the sim. There is no need to call `unlink`, `removeListener`, `dispose`, etc.

**Query Parameters**: Query parameters are used to enable sim-specific features, mainly for debugging and testing.
Sim-specific query parameters are documented in `GasPropertiesQueryParameters`.

**Color Profiles**: This sim has 2 color profiles, "default" and "projector", defined
in `GasPropertiesColors`.
The "projector" profile is used when the sim is switched into projector mode via the Preferences dialog.

**Assertions**: The implementation makes heavy use of `assert` to verify pre/post assumptions and perform type checking.
As an experiment, this sim performs type-checking for almost all function arguments via `assert`. While this may look
like overkill, it did catch quite a few problems during refactoring, and was a net gain. If you are making modifications
to this sim, do so with assertions enabled via the `ea` query parameter.

## Common to all screens

This section describes base classes that are common to all screens.  You'll find these classes in `js/common/`.

### Model

`BaseModel` is the model base class for all screens. It provides functionality that is unrelated to `PV = NkT`, the Ideal Gas Law. 

`BaseContainer` is the base class for the container in all screens.

`Particle` is the base class for particles.  While mass and radius are mutable, only the _Diffusion_ screen uses this feature.

`CollisionDetector` implements collision detection and response for all screens. See [model.md](https://github.com/phetsims/gas-properties/blob/master/doc/model.md) and code comments for more details.

### View

`BaseScreenView` is the base `ScreenView` for all screens. As you can see, there are relatively few components that are shared by all screens.

`ParticlesNode` renders a collection of particles using the `Canvas` API.

## _Ideal_, _Explore_, and _Energy_ screens

The _Ideal_, _Explore_, and _Energy_ screens are all based on application of the Ideal Gas Law, and their base class names therefore have the prefix "IdealGasLaw". (The _Diffusion_ screen is _not_ based on the Ideal Gas Law.) Code shared by these screens lives in `js/common/`.  

### Model

`IdealGasLawModel` is a subclass of `BaseModel` that adds functionality related to the Ideal Gas Law. It delegates some responsibilities to the following sub-models:

* `ParticleSystem` - responsible for the particle system, including the number of particles `N`
* `BaseContainer` - responsible for the container, including its volume `V`
* `PressureModel` - responsible for pressure `P`, and the "noise" in the `PressureGauge`
* `TemperatureModel` - responsible for temperature `T`, and the `Thermometer` 

Each screen has its own subclass of `IdealGasLawModel`. They are `IdealModel`, `ExploreMode`, and `EnergyModel`.
While `IdealModel` and `ExploreModel` have no significant differences or minor variations, the _Energy_ screen has additional features that are implemented by these sub-models of `EnergyModel`:

* `AverageSpeedModel` - responsible for data in the "Average Speed" accordion box
* `HistogramsModel` - responsible for data on the "Speed" and "Kinetic Energy" histograms

The two species of particles are `HeavyParticle` and `LightParticle`, subclasses of `Particle`, with fixed mass and radius.

All other model components in these screens are straightforward and will not be described here.

### View
  
`IdealGasLawScreenView` is the base `ScreenView` for these screens, a subclass of `BaseScreenView`.  Each screen has its own subclass of `IdealGasLawScreenView`.

`IdealGasLawContainerNode` is the container view for these screens.

`IdealGasLawParticleSystemNode` renders the particles system for these screens. To minimize `Canvas` size, it uses two `ParticleNode` instances, one for particles inside the container, one for particles outside the container.  If you're interested in visualizing the `Canvas` bounds, see the `canvasBounds` query parameter.

`IdealGasLawViewProperties` is the base class for view-specific axon Properties. Each screen has its own subclass of `IdealGasLawViewProperties`.

All other view components in these screens are straightforward and will not be described here.

## _Diffusion_ screen
 
Unlike the other screens, the _Diffusion_ screen is not based on the Ideal Gas Law. So while it shares some 
base classes, it has less in common with the other screens, and it has some components that are unique to it. 

### Model

The main model class is `DiffusionModel`. Like the models for the other screens, it is a subclass of `BaseModel`, which provides
model functionality that is _not_ related to the Ideal Gas Law. `DiffusionModel` delegates some responsibilities
to these sub-models:

* `DiffusionData` - responsible for the information shown in the "Data" accordion box
* `ParticleFlowRateModel` - responsible for computing particle flow rates

The container, `DiffusionContainer`, has no lid, but adds a removable vertical divider. 

Collision detection is handled in `DiffusionCollisionDetector`, a subclass of the same `CollisionDetector` used in the 
other screens. When the divider is in place, `DiffusionCollisionDetector` treats the container as 2 separate containers,
with the divider playing the role of a container's wall.  All other aspects of collision detection and response are 
identical.

The two species of particles are (for lack of better names) `DiffusionParticle1` and `DiffusionParticle2`, subclasses of
`Particle`, with mutable mass and radius.

All other model components in this screen are straightforward and will not be described here.

### View

The main view class is `DiffusionScreenView`. Like the other screens, it is a subclass of `BaseScreenView`, which
provides view functionality that is common to all screens.

View-specific axon Properties are found in `DiffusionViewProperties`.

The container view is `DiffusionContainerNode`. It is unique to this screen, and shares nothing with the previous screens. 

The particle system view is `DiffusionParticleSystemNode`, a subclass `ParticlesNode`, and based `Canvas`.
Since all particles are confined to the container, a since `Canvas` is used.

All other view components in this screen are straightforward and will not be described here.

## Related Simulations

**Gases Intro**: This sim consists of 2 screens, both of which are based on the _Ideal_ screen. The _Intro_ screen
is the _Ideal_ screen with the "Hold Constant" radio buttons removed. The _Laws_ screen is the _Ideal_ screen with
no modifications. While _Gas Properties_ has noise turned on for the pressure gauge, the _Gases Intro_ sim has it
turned off by default. See the "Pressure Noise" checkbox in the Preferences dialog, or the `pressureNoise` query
parameter.

**Diffusion**: This is sim consists of the _Diffusion_ screen with no modifications.
