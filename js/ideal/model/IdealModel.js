// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model for the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const CollisionCounter = require( 'GAS_PROPERTIES/common/model/CollisionCounter' );
  const CollisionDetector = require( 'GAS_PROPERTIES/common/model/CollisionDetector' );
  const Container = require( 'GAS_PROPERTIES/common/model/Container' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const LinearFunction = require( 'DOT/LinearFunction' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );
  const PressureGauge = require( 'GAS_PROPERTIES/common/model/PressureGauge' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Stopwatch = require( 'GAS_PROPERTIES/common/model/Stopwatch' );
  const Thermometer = require( 'GAS_PROPERTIES/common/model/Thermometer' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const PUMP_DISPERSION_ANGLE = Math.PI / 2; // radians, used to compute initial velocity angle for particles
  const EMPTY_INITIAL_TEMPERATURE = 300; // K, uses to compute velocity magnitude for particles added to empty container

  // Enumeration for which quantity to hold constant
  const HoldConstantEnum = new Enumeration( [
      'NOTHING',
      'VOLUME',
      'TEMPERATURE',
      'PRESSURE_T', // change temperature (T) to maintain constant pressure
      'PRESSURE_V' // change volume (V) to maintain constant pressure
    ]
  );

  class IdealModel {

    constructor() {

      // @public bounds of the entire space that the model knows about.
      // This corresponds to the browser window, and doesn't have a valid value until the view is created.
      this.modelBoundsProperty = new Property( new Bounds2( 0, 0, 1, 1 ) );
      phet.log && this.modelBoundsProperty.link( modelBounds => {
        phet.log( `modelBounds: ${modelBounds.toString()} nm` );
      } );

      // @public transform between real time and sim time
      // 1 second of real time is 2.5 picoseconds of sim time.
      this.timeTransform = new LinearFunction( 0, 1, 0, 2.5 );

      // @public transform between model and view coordinate frames
      const modelViewScale = 40; // number of pixels per nm
      this.modelViewTransform = ModelViewTransform2.createOffsetXYScaleMapping(
        new Vector2( 645, 475  ), // offset of the model's origin, in view coordinates
        modelViewScale,
        -modelViewScale // y is inverted
      );

      // @public is the sim playing?
      this.isPlayingProperty = new BooleanProperty( true );

      // @public are the time controls (play, pause, step) enabled?
      this.isTimeControlsEnabledProperty = new BooleanProperty( true );

      // @public the quantity to hold constant
      this.holdConstantProperty = new EnumerationProperty( HoldConstantEnum, HoldConstantEnum.NOTHING );

      this.heavyParticles = []; // {HeavyParticle[]} inside the container
      this.lightParticles = []; // {LightParticle[]} inside the container
      this.heavyParticlesOutside = []; // {HeavyParticle[]} outside the container
      this.lightParticlesOutside = []; // {LightParticle[]} outside the container

      // @public the number of heavy particles inside the container
      this.numberOfHeavyParticlesProperty = new NumberProperty( GasPropertiesConstants.HEAVY_PARTICLES_RANGE.defaultValue, {
        numberType: 'Integer',
        range: GasPropertiesConstants.HEAVY_PARTICLES_RANGE
      } );

      // @public the number of light particles inside the container
      this.numberOfLightParticlesProperty = new NumberProperty( GasPropertiesConstants.LIGHT_PARTICLES_RANGE.defaultValue, {
        numberType: 'Integer',
        range: GasPropertiesConstants.LIGHT_PARTICLES_RANGE
      } );

      // Synchronize particle counts and arrays
      this.numberOfHeavyParticlesProperty.link( ( newValue, oldValue ) => {
        this.numberOfParticlesListener( newValue, oldValue, this.heavyParticles, HeavyParticle );
      } );
      this.numberOfLightParticlesProperty.link( ( newValue, oldValue ) => {
        this.numberOfParticlesListener( newValue, oldValue, this.lightParticles, LightParticle );
      } );

      // @public (read-only)
      this.container = new Container();
      
      // @public (read-only)
      this.collisionDetector = new CollisionDetector( this );

      // @public the factor to heat (positive value) or cool (negative value) the contents of the container
      this.heatCoolFactorProperty = new NumberProperty( 0, {
        range: new Range( -1, 1 )
      } );

      // @public (read-only)
      this.thermometer = new Thermometer();

      // @public (read-only)
      this.pressureGauge = new PressureGauge();

      // @public (read-only)
      this.collisionCounter = new CollisionCounter( this.collisionDetector, {
        location: new Vector2( 20, 20 ) // view coordinates! determined empirically
      } );

      // @public (read-only)
      this.stopwatch = new Stopwatch( {
        location: new Vector2( 200, 20 ) // view coordinates! determined empirically
      } );

      // Redistribute particles as the container width changes.
      if ( GasPropertiesQueryParameters.redistribute === 'drag' ) {
        this.container.widthProperty.link( ( newWidth, oldWidth ) => {
          this.redistributeParticles( newWidth / oldWidth );
        } );
      }
    }

    /**
     * Adjusts an array of particles to have the desired number of elements.
     * @param {number} newValue - new number of particles
     * @param {number} oldValue - old number of particles
     * @param {Particle[]} particles - array of particles that corresponds to newValue and oldValue
     * @param particleConstructor - constructor for elements in particles array
     * @private
     */
    numberOfParticlesListener( newValue, oldValue, particles, particleConstructor ) {
      if ( particles.length !== newValue ) {
        const delta = newValue - oldValue;
        if ( delta > 0 ) {
          this.addParticles( delta, particles, particleConstructor );
        }
        else if ( delta < 0 ) {
          removeParticles( -delta, particles );
        }
        assert && assert( particles.length === newValue, 'particles array is out of sync' );
      }
    }

    /**
     * Adds n particles to the end of the specified array.
     * @param {number} n
     * @param {Particle[]} particles
     * @param {constructor} Constructor - a Particle subclass constructor
     * @private
     */
    addParticles( n, particles, Constructor ) {

      // Initial velocity is based on temperature in the container.
      let temperature = this.thermometer.temperatureKelvinProperty.value;
      if ( temperature === null ) {
        temperature = EMPTY_INITIAL_TEMPERATURE;
      }

      for ( let i = 0; i < n; i++ ) {

        // Create a particle, just inside the container where the bicycle pump hose attaches.
        const particle = new Constructor();
        particle.setLocationXY(
          this.container.hoseLocation.x - this.container.wallThickness - particle.radius,
          this.container.hoseLocation.y
        );

        // Set the particle's velocity.
        particle.setVelocityPolar(

          // KE = (3/2)kT = (1/2) * m * |v|^2, so v = sqrt( 3kT / m )
          Math.sqrt( 3 * GasPropertiesConstants.BOLTZMANN * temperature / particle.mass ),

          // Velocity angle is randomly chosen from pump's dispersion angle, perpendicular to right wall of container.
          Math.PI - PUMP_DISPERSION_ANGLE / 2 + phet.joist.random.nextDouble() * PUMP_DISPERSION_ANGLE
        );

        particles.push( particle );
      }
    }

    /**
     * Redistributes the particles in the container, called in response to changing the container width.
     * @param {number} ratio
     * @public
     */
    redistributeParticles( ratio ) {
      redistributeParticles( this.heavyParticles, ratio );
      redistributeParticles( this.lightParticles, ratio );
    }

    // @public resets the model
    reset() {

      // model elements
      this.container.reset();
      this.collisionCounter.reset();
      this.stopwatch.reset();
      this.thermometer.reset();
      this.pressureGauge.reset();

      // Properties
      this.isPlayingProperty.reset();
      this.isTimeControlsEnabledProperty.reset();
      this.holdConstantProperty.reset();
      this.numberOfHeavyParticlesProperty.reset(); // clears this.heavyParticles
      this.numberOfLightParticlesProperty.reset(); // clears this.lightParticles
      this.heatCoolFactorProperty.reset();

      assert && assert( this.heavyParticles.length === 0, 'there should be no heavyParticles' );
      assert && assert( this.lightParticles.length === 0, 'there should be no lightParticles' );

      // Dispose of particles that are outside the container
      removeParticles( this.heavyParticlesOutside.length, this.heavyParticlesOutside );
      removeParticles( this.lightParticlesOutside.length, this.lightParticlesOutside );
    }

    /**
     * Steps the model using real time units.
     * @param {number} dt - time delta in seconds
     * @public
     */
    step( dt ) {
      this.stepModelTime( this.timeTransform( dt ) );
    }

    /**
     * Steps the model using model time units.
     * @param {number} dt - time delta in ps
     * @public
     */
    stepModelTime( dt ) {
      if ( this.isPlayingProperty.value ) {

        // advance the stopwatch
        this.stopwatch.step( dt );

        // apply heat/cool
        if ( this.heatCoolFactorProperty.value !== 0 ) {
          heatCoolParticles( this.heavyParticles, this.heatCoolFactorProperty.value );
          heatCoolParticles( this.lightParticles, this.heatCoolFactorProperty.value );
        }

        // step particles
        stepParticles( this.heavyParticles, dt );
        stepParticles( this.lightParticles, dt );
        stepParticles( this.heavyParticlesOutside, dt );
        stepParticles( this.lightParticlesOutside, dt );

        // collision detection and response
        this.collisionDetector.step( dt );

        // remove particles that have left the model bounds
        removeParticlesOutOfBounds( this.heavyParticlesOutside, this.modelBoundsProperty.value );
        removeParticlesOutOfBounds( this.lightParticlesOutside, this.modelBoundsProperty.value );

        // verify that these particles are fully enclosed in the container
        assert && assertContainerEnclosesParticles( this.container, this.heavyParticles );
        assert && assertContainerEnclosesParticles( this.container, this.lightParticles );

        this.updateTemperature();

        // Do this after collision detection, so that the number of collisions detected is recorded.
        this.collisionCounter.step( dt );
      }
    }

    //TODO is temperature computation correct?
    /**
     * Updates the thermometer's temperature.
     * @private
     */
    updateTemperature() {
      const numberOfParticles = this.heavyParticles.length + this.lightParticles.length;
      if ( numberOfParticles === 0 ) {
        this.thermometer.temperatureKelvinProperty.value = null;
      }
      else {

        // Compute the average kinetic energy
        let averageKineticEnergy = 0;
        for ( let i = 0; i < this.heavyParticles.length; i++ ) {
          averageKineticEnergy += this.heavyParticles[ i ].kineticEnergy;
        }
        for ( let i = 0; i < this.lightParticles.length; i++ ) {
          averageKineticEnergy += this.lightParticles[ i ].kineticEnergy;
        }
        averageKineticEnergy /= numberOfParticles;

        // T = (2/3)KE/k
        this.thermometer.temperatureKelvinProperty.value = (2/3) * averageKineticEnergy / GasPropertiesConstants.BOLTZMANN;
      }
    }
  }

  /**
   * Steps a collection of particles.
   * @param {Particle[]} particles
   * @param {number} dt - time step in ps
   */
  function stepParticles( particles, dt ) {
    for ( let i = 0; i < particles.length; i++ ) {
      particles[ i ].step( dt );
    }
  }

  /**
   * Heats or cools a collection of particles.
   * @param {Particle[]} particles
   * @param {number} heatCoolFactor - (-1,1), heat=[0,1), cool=(-1,0]
   */
  function heatCoolParticles( particles, heatCoolFactor ) {
    assert && assert( heatCoolFactor >= -1 && heatCoolFactor <= 1, 'invalid heatCoolFactor: ' + heatCoolFactor );
    const velocityScale = 1 + heatCoolFactor / GasPropertiesQueryParameters.heatCool;
    for ( let i = 0; i < particles.length; i++ ) {
      particles[i].scaleVelocity( velocityScale );
    }
  }

  /**
   * Removes a particle from an array.
   * @param {Particle} particle
   * @param {Particle[]} particles
   */
  function removeParticle( particle, particles ) {
    assert && assert( particle instanceof Particle, 'not a Particle: ' + particle );
    const index = particles.indexOf( particle );
    assert && assert( index !== -1, 'particle not found' );
    particles.splice( index, 1 );
    particle.dispose();
  }

  /**
   * Removes the last n particles from an array.
   * @param {number} n
   * @param {Particle[]} particles
   */
  function removeParticles( n, particles ) {
    assert && assert( n <= particles.length,
      `attempted to remove ${n} particles, but we only have ${particles.length} particles` );
    const particlesToRemove = particles.slice( particles.length - n, particles.length );
    for ( let i = 0; i < particlesToRemove.length; i++ ) {
      removeParticle( particlesToRemove[ i ], particles );
    }
  }

  /**
   * Removes particles that are out of bounds.
   * @param {Particle[]} particles
   * @param {Bounds2} bounds
   */
  function removeParticlesOutOfBounds( particles, bounds ) {
    for ( let i = 0; i < particles.length; i++ ) {
      if ( !particles[ i ].intersectsBounds( bounds ) ) {
        removeParticle( particles[ i ], particles );
      }
    }
  }

  /**
   * Redistributes particles in the horizontal dimension
   * @param {Particle[]} particles
   * @param {number} ratio
   */
  function redistributeParticles( particles, ratio ) {
    assert && assert( ratio > 0, 'invalid ration: ' + ratio );
    for ( let i = 0; i < particles.length; i++ ) {
      particles[ i ].location.setX( ratio * particles[ i ].location.x );
    }
  }

  /**
   * Verifies that the container encloses all particles, surrounding them on all sides.
   * @param {Particle[]} particles
   * @param {Container} container
   */
  function assertContainerEnclosesParticles( container, particles ) {
    for ( let i = 0; i < particles.length; i++ ) {
      assert && assert( container.enclosesParticle( particles[ i ] ),
        `container does not enclose particle: ${particles[ i ].toString()}` );
    }
  }

  return gasProperties.register( 'IdealModel', IdealModel );
} );