// Copyright 2019, University of Colorado Boulder

/**
 * ParticleSystem is a sub-model of IdealGasModel. It is responsible for the particle system, including
 * the N (number of particles) component of the Ideal Gas Law, PV = NkT.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesUtils = require( 'GAS_PROPERTIES/common/GasPropertiesUtils' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const IdealGasLawContainer = require( 'GAS_PROPERTIES/common/model/IdealGasLawContainer' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ParticleUtils = require( 'GAS_PROPERTIES/common/model/ParticleUtils' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants

  // used to compute the initial velocity angle for particles, in radians
  const PARTICLE_DISPERSION_ANGLE = Math.PI / 2;

  class ParticleSystem {

    /**
     * @param {function:number} getInitialTemperature - gets the temperature used to compute initial velocity magnitude
     * @param {BooleanProperty} collisionsEnabledProperty - where particle-particle collisions are enabled
     * @param {Vector2} particleEntryLocation - point where the particles enter the container
     * @param {Object} [options]
     */
    constructor( getInitialTemperature, collisionsEnabledProperty, particleEntryLocation, options ) {
      assert && assert( typeof getInitialTemperature === 'function',
        `invalid getInitialTemperature: ${getInitialTemperature}` );
      assert && assert( collisionsEnabledProperty instanceof BooleanProperty,
        `invalid collisionsEnabledProperty: ${collisionsEnabledProperty}` );
      assert && assert( particleEntryLocation instanceof Vector2,
        `invalid particleEntryLocation: ${particleEntryLocation}` );

      options = merge( {

        // phet-io
        tandem: Tandem.required
      }, options );

      // @private
      this.getInitialTemperature = getInitialTemperature;
      this.collisionsEnabledProperty = collisionsEnabledProperty;
      this.particleEntryLocation = particleEntryLocation;

      // @public (read-only) together these arrays make up the 'particle system'
      // Separate arrays are kept to optimize performance.
      this.heavyParticles = []; // {HeavyParticle[]} heavy particles inside the container
      this.lightParticles = []; // {LightParticle[]} light particles inside the container
      this.heavyParticlesOutside = []; // {HeavyParticle[]} heavy particles outside the container
      this.lightParticlesOutside = []; // {LightParticle[]} light particles outside the container

      // @public performance optimization, for iterating over all particles inside the container
      this.insideParticleArrays = [ this.heavyParticles, this.lightParticles ];

      // @public the number of heavy particles inside the container
      this.numberOfHeavyParticlesProperty = new NumberProperty( GasPropertiesConstants.HEAVY_PARTICLES_RANGE.defaultValue, {
        numberType: 'Integer',
        range: GasPropertiesConstants.HEAVY_PARTICLES_RANGE,
        tandem: options.tandem.createTandem( 'numberOfHeavyParticlesProperty' ),
        phetioDocumentation: 'the number of heavy particles in the container'
      } );

      // @public the number of light particles inside the container
      this.numberOfLightParticlesProperty = new NumberProperty( GasPropertiesConstants.LIGHT_PARTICLES_RANGE.defaultValue, {
        numberType: 'Integer',
        range: GasPropertiesConstants.LIGHT_PARTICLES_RANGE,
        tandem: options.tandem.createTandem( 'numberOfLightParticlesProperty' ),
        phetioDocumentation: 'the number of light particles in the container'
      } );

      // Synchronize particle counts and arrays.
      const createHeavyParticle = () => new HeavyParticle();
      this.numberOfHeavyParticlesProperty.link( ( newValue, oldValue ) => {
        this.updateNumberOfParticles( newValue, oldValue, this.heavyParticles, createHeavyParticle );
        assert && assert( GasPropertiesUtils.isArrayOf( this.heavyParticles, HeavyParticle ),
          'heavyParticles should contain only HeavyParticle' );
      } );
      const createLightParticle = () => new LightParticle();
      this.numberOfLightParticlesProperty.link( ( newValue, oldValue ) => {
        this.updateNumberOfParticles( newValue, oldValue, this.lightParticles, createLightParticle );
        assert && assert( GasPropertiesUtils.isArrayOf( this.lightParticles, LightParticle ),
          'lightParticles should contain only LightParticle' );
      } );

      // @public N, the total number of particles in the container.
      this.numberOfParticlesProperty = new DerivedProperty(
        [ this.numberOfHeavyParticlesProperty, this.numberOfLightParticlesProperty ],
        ( numberOfHeavyParticles, numberOfLightParticles ) => {

          // Verify that particle arrays have been populated before numberOfParticlesProperty is updated.
          // If you hit these assertions, then you need to add this listener later.  This is a trade-off
          // for using plain old Arrays instead of ObservableArray.
          assert && assert( this.heavyParticles.length === numberOfHeavyParticles,
            'heavyParticles has not been populated yet' );
          assert && assert( this.lightParticles.length === numberOfLightParticles,
            'lightParticles not been populated yet' );
          return numberOfHeavyParticles + numberOfLightParticles;
        }, {
          phetioType: DerivedPropertyIO( NumberIO ),
          valueType: 'number',
          isValidValue: value => value >= 0,
          tandem: options.tandem.createTandem( 'numberOfParticlesProperty' ),
          phetioDocumentation: 'the total number of particles in the container'
        }
      );
    }

    /**
     * Resets the particle system.
     * @public
     */
    reset() {
      this.removeAllParticles();
    }

    /**
     * Removes and disposes of all particles.
     * @public
     */
    removeAllParticles() {
      this.numberOfHeavyParticlesProperty.reset();
      assert && assert( this.heavyParticles.length === 0, 'there should be no heavyParticles' );

      this.numberOfLightParticlesProperty.reset();
      assert && assert( this.lightParticles.length === 0, 'there should be no lightParticles' );

      ParticleUtils.removeAllParticles( this.heavyParticlesOutside );
      assert && assert( this.heavyParticlesOutside.length === 0, 'there should be no heavyParticlesOutside' );

      ParticleUtils.removeAllParticles( this.lightParticlesOutside );
      assert && assert( this.lightParticlesOutside.length === 0, 'there should be no lightParticlesOutside' );
    }

    /**
     * Steps the particle system.
     * @param {number} dt - time delta, in ps
     * @public
     */
    step( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

      ParticleUtils.stepParticles( this.heavyParticles, dt );
      ParticleUtils.stepParticles( this.lightParticles, dt );
      ParticleUtils.stepParticles( this.heavyParticlesOutside, dt );
      ParticleUtils.stepParticles( this.lightParticlesOutside, dt );
    }

    /**
     * Heats or cools the particle system.
     * @param {number} heatCoolFactor - [-1,1] see HeaterCoolerNode heatCoolAmountProperty
     * @public
     */
    heatCool( heatCoolFactor ) {
      assert && assert( typeof heatCoolFactor === 'number' && heatCoolFactor >= -1 && heatCoolFactor <= 1,
        `invalid heatCoolFactor: ${heatCoolFactor}` );

      if ( heatCoolFactor !== 0 ) {
        ParticleUtils.heatCoolParticles( this.heavyParticles, heatCoolFactor );
        ParticleUtils.heatCoolParticles( this.lightParticles, heatCoolFactor );
      }
    }

    /**
     * Allows particles to escape from the opening in the top of the container.
     * @param {IdealGasLawContainer} container
     * @public
     */
    escapeParticles( container ) {
      assert && assert( container instanceof IdealGasLawContainer, `invalid container: ${container}` );

      if ( container.isOpenProperty.value ) {

        ParticleUtils.escapeParticles( container, this.numberOfHeavyParticlesProperty,
          this.heavyParticles, this.heavyParticlesOutside, );
        assert && assert( GasPropertiesUtils.isArrayOf( this.heavyParticlesOutside, HeavyParticle ),
          'heavyParticlesOutside should contain only HeavyParticle' );

        ParticleUtils.escapeParticles( container, this.numberOfLightParticlesProperty,
          this.lightParticles, this.lightParticlesOutside );
        assert && assert( GasPropertiesUtils.isArrayOf( this.lightParticlesOutside, LightParticle ),
          'lightParticlesOutside should contain only LightParticle' );
      }
    }

    /**
     * Removes particles that are outside the specified bounds. This is used to dispose of particles once they
     * are outside the visible bounds of the sim.
     * @param {Bounds2} bounds
     * @public
     */
    removeParticlesOutOfBounds( bounds ) {
      assert && assert( bounds instanceof Bounds2, `invalid bounds: ${bounds}` );

      ParticleUtils.removeParticlesOutOfBounds( this.heavyParticlesOutside, bounds );
      ParticleUtils.removeParticlesOutOfBounds( this.lightParticlesOutside, bounds );
    }

    /**
     * Adjusts an array of particles to have the desired number of elements.
     * @param {number} newValue - new number of particles
     * @param {number} oldValue - old number of particles
     * @param {Particle[]} particles - array of particles that corresponds to newValue and oldValue
     * @param {function(options:*):Particle} createParticle - creates a Particle instance
     * @private
     */
    updateNumberOfParticles( newValue, oldValue, particles, createParticle ) {
      assert && assert( typeof newValue === 'number', `invalid newValue: ${newValue}` );
      assert && assert( oldValue === null || typeof oldValue === 'number', `invalid oldValue: ${oldValue}` );
      assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
      assert && assert( typeof createParticle === 'function', `invalid createParticle: ${createParticle}` );

      if ( particles.length !== newValue ) {
        const delta = newValue - oldValue;
        if ( delta > 0 ) {
          this.addParticles( delta, particles, createParticle );
        }
        else if ( delta < 0 ) {
          ParticleUtils.removeLastParticles( -delta, particles );
        }
        assert && assert( particles.length === newValue, 'particles array is out of sync' );
      }
    }

    /**
     * Adds n particles to the end of the specified array.
     * @param {number} n
     * @param {Particle[]} particles
     * @param {function(options:*):Particle} createParticle - creates a Particle instance
     * @private
     */
    addParticles( n, particles, createParticle ) {
      assert && assert( typeof n === 'number' && n > 0, `invalid n: ${n}` );
      assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
      assert && assert( typeof createParticle === 'function', `invalid createParticle: ${createParticle}` );

      // Get the mean temperature that will be used to compute initial speed.
      const meanTemperature = this.getInitialTemperature();
      assert && assert( meanTemperature > 0, `invalid meanTemperature: ${meanTemperature}` );

      // Create n temperature values that will be used to compute initial speed.
      let temperatures = null;
      if ( n === 1 || !this.collisionsEnabledProperty.value ) {

        // For single particles, or if particle-particle collisions are disabled, use the mean temperature
        // for all particles. For groups of particles, this yields wave-like motion.
        temperatures = [];
        for ( let i = 0; i < n; i++ ) {
          temperatures[ i ] = meanTemperature;
        }
      }
      else {

        // For groups of particles with particle-particle collisions enabled, create some deviation in the
        // temperature used to compute speed, but maintain the desired mean.  This makes the motion of a group
        // of particles look less wave-like. We do this for temperature instead of speed because temperature
        // in the container is T = (2/3)KE/k, and KE is a function of |v|^2, so deviation in speed would
        // change the desired temperature.
        temperatures = GasPropertiesUtils.getGaussianValues( n, meanTemperature, 0.2 * meanTemperature, 1E-3 );
      }

      assert && assert( temperatures.length === n,
        `incorrect number of temperature values ${temperatures.length}, expected ${n}` );

      // Verify that all temperature values are > 0 Kelvin.
      assert && assert( _.every( temperatures, temperature => temperature > 0 ),
        'invalid temperature: ' +
        _.find( temperatures, temperature => temperature <= 0 ) +
        `n=${n}, meanTemperature=${meanTemperature}, collisionsEnabled=${this.collisionsEnabledProperty.value}` );

      // Create n particles
      for ( let i = 0; i < n; i++ ) {

        const particle = createParticle();

        // Position the particle just inside the container, accounting for radius.
        particle.setLocationXY( this.particleEntryLocation.x - particle.radius, this.particleEntryLocation.y );

        // Initial speed, |v| = sqrt( 3kT / m )
        const speed = Math.sqrt( 3 * GasPropertiesConstants.BOLTZMANN * temperatures[ i ] / particle.mass );

        // Angle is randomly chosen from pump's dispersion angle, perpendicular to right wall of container.
        const angle = Math.PI - PARTICLE_DISPERSION_ANGLE / 2 + phet.joist.random.nextDouble() * PARTICLE_DISPERSION_ANGLE;

        particle.setVelocityPolar( speed, angle );

        particles.push( particle );
      }
    }

    /**
     * Redistributes the particles horizontally in the container.  This is used in the Ideal screen, where resizing
     * the container results in the particles being redistributed in the new container width.
     * @param {number} scaleX - amount to scale each particle's x location
     * @public
     */
    redistributeParticles( scaleX ) {
      assert && assert( typeof scaleX === 'number' && scaleX > 0, `invalid scaleX: ${scaleX}` );

      ParticleUtils.redistributeParticles( this.heavyParticles, scaleX );
      ParticleUtils.redistributeParticles( this.lightParticles, scaleX );
    }

    /**
     * Adjusts velocities of particle inside the container so that the resulting temperature matches
     * a specified temperature.
     * @param {number} temperature - in K
     * @public
     */
    setTemperature( temperature ) {
      assert && assert( typeof temperature === 'number', `invalid temperature: ${temperature}` );

      const desiredAverageKE = ( 3 / 2 ) * temperature * GasPropertiesConstants.BOLTZMANN; // KE = (3/2)Tk
      const actualAverageKE = this.getAverageKineticEnergy();
      const ratio = desiredAverageKE / actualAverageKE;

      for ( let i = this.insideParticleArrays.length - 1; i >= 0; i-- ) {
        const particles = this.insideParticleArrays[ i ];
        for ( let j = particles.length - 1; j >= 0; j-- ) {
          const particle = particles[ j ];
          const actualParticleKE = particle.getKineticEnergy();
          const desiredParticleKE = ratio * actualParticleKE;
          const desiredSpeed = Math.sqrt( 2 * desiredParticleKE / particle.mass ); // |v| = Math.sqrt( 2 * KE / m )
          particle.setVelocityMagnitude( desiredSpeed );
        }
      }
    }

    /**
     * Gets the average kinetic energy of the particles in the container.
     * @returns {number} in AMU * pm^2 / ps^2
     * @public
     */
    getAverageKineticEnergy() {
      return this.getTotalKineticEnergy() / this.numberOfParticlesProperty.value;
    }

    /**
     * Gets the total kinetic energy of the particles in the container.
     * @returns {number} in AMU * pm^2 / ps^2
     * @private
     */
    getTotalKineticEnergy() {
      return ParticleUtils.getTotalKineticEnergy( this.heavyParticles ) +
             ParticleUtils.getTotalKineticEnergy( this.lightParticles );
    }
  }

  return gasProperties.register( 'ParticleSystem', ParticleSystem );
} );