// Copyright 2019-2023, University of Colorado Boulder

/**
 * ParticleSystem is a sub-model of IdealGasModel. It is responsible for the particle system, including
 * the N (number of particles) component of the Ideal Gas Law, PV = NkT.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import propertyStateHandlerSingleton from '../../../../axon/js/propertyStateHandlerSingleton.js';
import PropertyStatePhase from '../../../../axon/js/PropertyStatePhase.js';
import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import GasPropertiesUtils from '../GasPropertiesUtils.js';
import HeavyParticle from './HeavyParticle.js';
import IdealGasLawContainer from './IdealGasLawContainer.js';
import LightParticle from './LightParticle.js';
import Particle, { ParticleOptions } from './Particle.js';
import ParticleUtils from './ParticleUtils.js';

// constants

// used to compute the initial velocity angle for particles, in radians
const PARTICLE_DISPERSION_ANGLE = Math.PI / 2;

type CreateParticleFunction = ( options?: ParticleOptions ) => Particle;

export default class ParticleSystem {

  // gets the temperature used to compute initial velocity magnitude
  private readonly getInitialTemperature: () => number;

  // where particle-particle collisions are enabled
  private readonly collisionsEnabledProperty: Property<boolean>;

  // point where the particles enter the container
  private readonly particleEntryPosition: Vector2;

  // Together these arrays make up the 'particle system'. Separate arrays are kept to optimize performance.
  public readonly heavyParticles: HeavyParticle[]; // heavy particles inside the container
  public readonly lightParticles: LightParticle[]; // light particles inside the container
  public readonly heavyParticlesOutside: HeavyParticle[]; // heavy particles outside the container
  public readonly lightParticlesOutside: LightParticle[]; // light particles outside the container

  // performance optimization, for iterating over all particles inside the container
  public readonly insideParticleArrays: [ HeavyParticle[], LightParticle[] ];

  // the number of heavy particles inside the container
  public readonly numberOfHeavyParticlesProperty: NumberProperty;

  // the number of light particles inside the container
  public readonly numberOfLightParticlesProperty: NumberProperty;

  // N, the total number of particles in the container
  public readonly numberOfParticlesProperty: ReadOnlyProperty<number>;

  public constructor( getInitialTemperature: () => number,
                      collisionsEnabledProperty: Property<boolean>,
                      particleEntryPosition: Vector2,
                      tandem: Tandem ) {

    this.getInitialTemperature = getInitialTemperature;
    this.collisionsEnabledProperty = collisionsEnabledProperty;
    this.particleEntryPosition = particleEntryPosition;

    this.heavyParticles = [];
    this.lightParticles = [];
    this.heavyParticlesOutside = [];
    this.lightParticlesOutside = [];

    this.insideParticleArrays = [ this.heavyParticles, this.lightParticles ];

    this.numberOfHeavyParticlesProperty = new NumberProperty( GasPropertiesConstants.HEAVY_PARTICLES_RANGE.defaultValue, {
      numberType: 'Integer',
      range: GasPropertiesConstants.HEAVY_PARTICLES_RANGE,
      tandem: tandem.createTandem( 'numberOfHeavyParticlesProperty' ),
      phetioDocumentation: 'the number of heavy particles in the container',
      hasListenerOrderDependencies: true // TODO: https://github.com/phetsims/gas-properties/issues/186
    } );

    this.numberOfLightParticlesProperty = new NumberProperty( GasPropertiesConstants.LIGHT_PARTICLES_RANGE.defaultValue, {
      numberType: 'Integer',
      range: GasPropertiesConstants.LIGHT_PARTICLES_RANGE,
      tandem: tandem.createTandem( 'numberOfLightParticlesProperty' ),
      phetioDocumentation: 'the number of light particles in the container',
      hasListenerOrderDependencies: true // TODO: https://github.com/phetsims/gas-properties/issues/186
    } );

    // Synchronize particle counts and arrays.
    const createHeavyParticle = () => new HeavyParticle();
    this.numberOfHeavyParticlesProperty.link( ( newValue, oldValue ) => {
      this.updateNumberOfParticles( newValue, oldValue, this.heavyParticles, createHeavyParticle );
    } );
    const createLightParticle = () => new LightParticle();
    this.numberOfLightParticlesProperty.link( ( newValue, oldValue ) => {
      this.updateNumberOfParticles( newValue, oldValue, this.lightParticles, createLightParticle );
    } );

    this.numberOfParticlesProperty = new DerivedProperty(
      [ this.numberOfHeavyParticlesProperty, this.numberOfLightParticlesProperty ],
      ( numberOfHeavyParticles, numberOfLightParticles ) => {

        // Verify that particle arrays have been populated before numberOfParticlesProperty is updated.
        // If you hit these assertions, then you need to add this listener later.  This is a trade-off
        // for using plain old Arrays instead of ObservableArrayDefs.
        assert && assert( this.heavyParticles.length === numberOfHeavyParticles,
          'heavyParticles has not been populated yet' );
        assert && assert( this.lightParticles.length === numberOfLightParticles,
          'lightParticles has not been populated yet' );
        return numberOfHeavyParticles + numberOfLightParticles;
      }, {
        phetioValueType: NumberIO,
        valueType: 'number',
        isValidValue: value => value >= 0,
        tandem: tandem.createTandem( 'numberOfParticlesProperty' ),
        phetioDocumentation: 'the total number of particles in the container'
      }
    );

    // Properties for the number of heavy and light particles need to notify listeners to update their associated
    // particle arrays. This occurs in the "notification" step when updateNumberOfParticles is called.
    // During PhET-iO restore state, this must occur before numberOfParticlesProperty is re-derived.
    // See https://github.com/phetsims/gas-properties/issues/178
    propertyStateHandlerSingleton.registerPhetioOrderDependency( this.numberOfHeavyParticlesProperty, PropertyStatePhase.NOTIFY, this.numberOfParticlesProperty, PropertyStatePhase.UNDEFER );
    propertyStateHandlerSingleton.registerPhetioOrderDependency( this.numberOfLightParticlesProperty, PropertyStatePhase.NOTIFY, this.numberOfParticlesProperty, PropertyStatePhase.UNDEFER );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }


  public reset(): void {
    this.removeAllParticles();
  }

  /**
   * Removes and disposes of all particles.
   */
  public removeAllParticles(): void {
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
   * @param dt - time delta, in ps
   */
  public step( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );

    ParticleUtils.stepParticles( this.heavyParticles, dt );
    ParticleUtils.stepParticles( this.lightParticles, dt );
    ParticleUtils.stepParticles( this.heavyParticlesOutside, dt );
    ParticleUtils.stepParticles( this.lightParticlesOutside, dt );
  }

  /**
   * Heats or cools the particle system.
   * @param heatCoolFactor - [-1,1] see HeaterCoolerNode heatCoolAmountProperty
   */
  public heatCool( heatCoolFactor: number ): void {
    assert && assert( heatCoolFactor >= -1 && heatCoolFactor <= 1, `invalid heatCoolFactor: ${heatCoolFactor}` );

    if ( heatCoolFactor !== 0 ) {
      ParticleUtils.heatCoolParticles( this.heavyParticles, heatCoolFactor );
      ParticleUtils.heatCoolParticles( this.lightParticles, heatCoolFactor );
    }
  }

  /**
   * Allows particles to escape from the opening in the top of the container.
   */
  public escapeParticles( container: IdealGasLawContainer ): void {

    if ( container.isOpenProperty.value ) {

      ParticleUtils.escapeParticles( container, this.numberOfHeavyParticlesProperty,
        this.heavyParticles, this.heavyParticlesOutside );

      ParticleUtils.escapeParticles( container, this.numberOfLightParticlesProperty,
        this.lightParticles, this.lightParticlesOutside );
    }
  }

  /**
   * Removes particles that are outside the specified bounds. This is used to dispose of particles once they
   * are outside the visible bounds of the sim.
   */
  public removeParticlesOutOfBounds( bounds: Bounds2 ): void {
    ParticleUtils.removeParticlesOutOfBounds( this.heavyParticlesOutside, bounds );
    ParticleUtils.removeParticlesOutOfBounds( this.lightParticlesOutside, bounds );
  }

  /**
   * Adjusts an array of particles to have the desired number of elements.
   * @param newValue - new number of particles
   * @param oldValue - old number of particles
   * @param particles - array of particles that corresponds to newValue and oldValue
   * @param createParticle - creates a Particle instance
   */
  private updateNumberOfParticles( newValue: number, oldValue: number | null, particles: Particle[],
                                   createParticle: CreateParticleFunction ): void {

    if ( particles.length !== newValue ) {
      const delta = newValue - ( oldValue || 0 );
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
   */
  private addParticles( n: number, particles: Particle[], createParticle: CreateParticleFunction ): void {
    assert && assert( n > 0, `invalid n: ${n}` );

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
      `invalid temperature: ${
        _.find( temperatures, temperature => temperature <= 0 )
      }, n=${n}, meanTemperature=${meanTemperature}, collisionsEnabled=${this.collisionsEnabledProperty.value}` );

    // Create n particles
    for ( let i = 0; i < n; i++ ) {

      const particle = createParticle();

      // Position the particle just inside the container, accounting for radius.
      particle.setPositionXY( this.particleEntryPosition.x - particle.radius, this.particleEntryPosition.y );

      // Initial speed, |v| = sqrt( 3kT / m )
      const speed = Math.sqrt( 3 * GasPropertiesConstants.BOLTZMANN * temperatures[ i ] / particle.mass );

      // Angle is randomly chosen from pump's dispersion angle, perpendicular to right wall of container.
      const angle = Math.PI - PARTICLE_DISPERSION_ANGLE / 2 + dotRandom.nextDouble() * PARTICLE_DISPERSION_ANGLE;

      particle.setVelocityPolar( speed, angle );

      particles.push( particle );
    }
  }

  /**
   * Redistributes the particles horizontally in the container.  This is used in the Ideal screen, where resizing
   * the container results in the particles being redistributed in the new container width.
   * @param scaleX - amount to scale each particle's x position
   */
  public redistributeParticles( scaleX: number ): void {
    assert && assert( scaleX > 0, `invalid scaleX: ${scaleX}` );

    ParticleUtils.redistributeParticles( this.heavyParticles, scaleX );
    ParticleUtils.redistributeParticles( this.lightParticles, scaleX );
  }

  /**
   * Adjusts velocities of particle inside the container so that the resulting temperature matches
   * a specified temperature, in K.
   */
  public setTemperature( temperature: number ): void {

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
   * Gets the average kinetic energy of the particles in the container, in AMU * pm^2 / ps^2.
   */
  public getAverageKineticEnergy(): number {
    return this.getTotalKineticEnergy() / this.numberOfParticlesProperty.value;
  }

  /**
   * Gets the total kinetic energy of the particles in the container, in AMU * pm^2 / ps^2.
   */
  private getTotalKineticEnergy(): number {
    return ParticleUtils.getTotalKineticEnergy( this.heavyParticles ) +
           ParticleUtils.getTotalKineticEnergy( this.lightParticles );
  }
}

gasProperties.register( 'ParticleSystem', ParticleSystem );