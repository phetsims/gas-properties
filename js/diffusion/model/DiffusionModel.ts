// Copyright 2018-2022, University of Colorado Boulder

/**
 * DiffusionModel is the top-level model for the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property, { PropertyOptions } from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import BaseModel from '../../common/model/BaseModel.js';
import ParticleUtils from '../../common/model/ParticleUtils.js';
import gasProperties from '../../gasProperties.js';
import DiffusionCollisionDetector from './DiffusionCollisionDetector.js';
import DiffusionContainer from './DiffusionContainer.js';
import DiffusionData from './DiffusionData.js';
import DiffusionParticle1 from './DiffusionParticle1.js';
import DiffusionParticle2 from './DiffusionParticle2.js';
import DiffusionSettings from './DiffusionSettings.js';
import ParticleFlowRate from './ParticleFlowRate.js';
import Particle, { ParticleOptions } from '../../common/model/Particle.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

// constants
const CENTER_OF_MASS_PROPERTY_OPTIONS = {
  units: 'pm',
  valueType: [ 'number', null ],
  phetioValueType: NullableIO( NumberIO ),
  phetioReadOnly: true // derived from the state of the particle system
};

// Options to createParticle functions
type CreateParticleOptions = PickRequired<ParticleOptions, 'mass' | 'radius'>;

export default class DiffusionModel extends BaseModel {

  // particles of each species, together these make up the 'particle system'
  public readonly particles1: DiffusionParticle1[];
  public readonly particles2: DiffusionParticle2[];

  public readonly container: DiffusionContainer;

  // settings for the left and right sides of the container, before the divider is removed
  public readonly leftSettings: DiffusionSettings;
  public readonly rightSettings: DiffusionSettings;

  // N, the total number of particles in the container
  public readonly numberOfParticlesProperty: TReadOnlyProperty<number>;

  // data for the left and right sides of the container, appears in Data accordion box
  public readonly leftData: DiffusionData;
  public readonly rightData: DiffusionData;

  // centerX of mass for each particle species, in pm. null when there are no particles in the container.
  public readonly centerOfMass1Property: Property<number | null>;
  public readonly centerOfMass2Property: Property<number | null>;

  // flow rate model for each particle species
  public readonly particleFlowRate1: ParticleFlowRate;
  public readonly particleFlowRate2: ParticleFlowRate;

  public readonly collisionDetector: DiffusionCollisionDetector;

  public constructor( tandem: Tandem ) {

    super( tandem, {

      // Offset of the model's origin, in view coordinates. Determines where the container's bottom-right corner is.
      modelOriginOffset: new Vector2( 670, 520 ),

      // Stopwatch initial position (in view coordinates!), determined empirically.
      stopwatchPosition: new Vector2( 60, 50 )
    } );

    this.particles1 = []; // {DiffusionParticle1[]}
    this.particles2 = []; // {DiffusionParticle2[]}

    this.container = new DiffusionContainer( tandem.createTandem( 'container' ) );

    this.leftSettings = new DiffusionSettings( tandem.createTandem( 'leftSettings' ) );
    this.rightSettings = new DiffusionSettings( tandem.createTandem( 'rightSettings' ) );

    // Synchronize particle counts and arrays.
    const createDiffusionParticle1 = ( options: CreateParticleOptions ) => new DiffusionParticle1( options );
    this.leftSettings.numberOfParticlesProperty.link( numberOfParticles => {
      this.updateNumberOfParticles( numberOfParticles,
        this.container.leftBounds,
        this.leftSettings,
        this.particles1,
        createDiffusionParticle1 );
    } );
    const createDiffusionParticle2 = ( options: CreateParticleOptions ) => new DiffusionParticle2( options );
    this.rightSettings.numberOfParticlesProperty.link( numberOfParticles => {
      this.updateNumberOfParticles( numberOfParticles,
        this.container.rightBounds,
        this.rightSettings,
        this.particles2,
        createDiffusionParticle2 );
    } );

    this.numberOfParticlesProperty = new DerivedProperty(
      [ this.leftSettings.numberOfParticlesProperty, this.rightSettings.numberOfParticlesProperty ],
      ( leftNumberOfParticles, rightNumberOfParticles ) => {

        // Skip these assertions when PhET-iO state is being restored, because at least one of the arrays will
        // definitely not be populated. See https://github.com/phetsims/gas-properties/issues/178
        if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {

          // Verify that particle arrays have been populated before numberOfParticlesProperty is updated.
          // If you hit these assertions, then you need to add this listener later.  This is a trade-off
          // for using plain old Arrays instead of ObservableArrayDef.
          assert && assert( this.particles1.length === leftNumberOfParticles, 'particles1 has not been populated yet' );
          assert && assert( this.particles2.length === rightNumberOfParticles, 'particles2 has not been populated yet' );
        }
        return leftNumberOfParticles + rightNumberOfParticles;
      }, {
        isValidValue: value => ( Number.isInteger( value ) && value >= 0 ),
        phetioValueType: NumberIO,
        tandem: tandem.createTandem( 'numberOfParticlesProperty' ),
        phetioDocumentation: 'total number of particles in the container'
      } );

    this.leftData = new DiffusionData( this.container.leftBounds, this.particles1, this.particles2, tandem.createTandem( 'leftData' ) );
    this.rightData = new DiffusionData( this.container.rightBounds, this.particles1, this.particles2, tandem.createTandem( 'rightData' ) );

    this.centerOfMass1Property = new Property<number | null>( null,
      combineOptions<PropertyOptions<number | null>>( {}, CENTER_OF_MASS_PROPERTY_OPTIONS, {
        tandem: tandem.createTandem( 'centerOfMass1Property' ),
        phetioDocumentation: 'center of mass for particles of type 1'
      } ) );

    this.centerOfMass2Property = new Property<number | null>( null,
      combineOptions<PropertyOptions<number | null>>( {}, CENTER_OF_MASS_PROPERTY_OPTIONS, {
        tandem: tandem.createTandem( 'centerOfMass2Property' ),
        phetioDocumentation: 'center of mass for particles of type 2'
      } ) );

    this.particleFlowRate1 = new ParticleFlowRate( this.container.dividerX, this.particles1, tandem.createTandem( 'particleFlowRate1' ) );
    this.particleFlowRate2 = new ParticleFlowRate( this.container.dividerX, this.particles2, tandem.createTandem( 'particleFlowRate2' ) );

    this.collisionDetector = new DiffusionCollisionDetector( this.container, this.particles1, this.particles2 );

    // Update mass and temperature of existing particles. This adjusts speed of the particles.
    Multilink.multilink(
      [ this.leftSettings.massProperty, this.leftSettings.initialTemperatureProperty ],
      ( mass, initialTemperature ) => {
        updateMassAndTemperature( mass, initialTemperature, this.particles1 );
      } );
    Multilink.multilink(
      [ this.rightSettings.massProperty, this.rightSettings.initialTemperatureProperty ],
      ( mass, initialTemperature ) => {
        updateMassAndTemperature( mass, initialTemperature, this.particles2 );
      } );

    // Update data if initial temperature settings are changed while the sim is paused.
    Multilink.multilink(
      [ this.leftSettings.initialTemperatureProperty, this.rightSettings.initialTemperatureProperty ],
      () => {
        if ( !this.isPlayingProperty.value ) {
          this.updateData();
        }
      } );

    // Update radii of existing particles.
    this.leftSettings.radiusProperty.link( radius => {
      updateRadius( radius, this.particles1, this.container.leftBounds, this.isPlayingProperty.value );
    } );
    this.rightSettings.radiusProperty.link( radius => {
      updateRadius( radius, this.particles2, this.container.rightBounds, this.isPlayingProperty.value );
    } );

    // When the divider is restored, create a new initial state with same numbers of particles.
    this.container.hasDividerProperty.link( hasDivider => {
      if ( hasDivider ) {

        // Restarts the experiment with the same settings.
        // This causes the current sets of particles to be deleted, and new sets of particles to be created.
        this.leftSettings.restart();
        this.rightSettings.restart();

        // Reset flow-rate models
        this.particleFlowRate1.reset();
        this.particleFlowRate2.reset();
      }
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public override reset(): void {
    super.reset();

    this.container.reset();
    this.leftSettings.reset();
    this.rightSettings.reset();
    this.centerOfMass1Property.reset();
    this.centerOfMass2Property.reset();
    this.particleFlowRate1.reset();
    this.particleFlowRate2.reset();

    assert && assert( this.particles1.length === 0, 'there should be no DiffusionParticle1 particles' );
    assert && assert( this.particles2.length === 0, 'there should be no DiffusionParticle2 particles' );
  }

  /**
   * Steps the model using model time units. Order is very important here!
   * @param dt - time delta, in ps
   */
  protected override stepModelTime( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );

    super.stepModelTime( dt );

    // Step particles
    ParticleUtils.stepParticles( this.particles1, dt );
    ParticleUtils.stepParticles( this.particles2, dt );

    // Particle Flow Rate model
    if ( !this.container.hasDividerProperty.value ) {
      this.particleFlowRate1.step( dt );
      this.particleFlowRate2.step( dt );
    }

    // Collision detection and response
    this.collisionDetector.update();

    // Update other things that are based on the current state of the particle system.
    this.updateCenterOfMass();
    this.updateData();
  }

  /**
   * Adjusts an array of particles to have the desired number of elements.
   * @param numberOfParticles - desired number of particles
   * @param positionBounds - initial position will be inside this bounds
   * @param settings
   * @param particles - array of particles that corresponds to newValue and oldValue
   * @param createParticle - creates a Particle instance
   */
  private updateNumberOfParticles( numberOfParticles: number, positionBounds: Bounds2, settings: DiffusionSettings,
                                   particles: Particle[], createParticle: ( options: CreateParticleOptions ) => Particle ): void {

    const delta = numberOfParticles - particles.length;
    if ( delta !== 0 ) {
      if ( delta > 0 ) {
        addParticles( delta, positionBounds, settings, particles, createParticle );
      }
      else {
        ParticleUtils.removeLastParticles( -delta, particles );
      }

      // If paused, update things that would normally be handled by step.
      if ( !this.isPlayingProperty.value ) {
        this.updateCenterOfMass();
        this.updateData();
      }
    }
  }

  /**
   * Updates the center of mass, as shown by the center-of-mass indicators.
   */
  private updateCenterOfMass(): void {
    this.centerOfMass1Property.value = ParticleUtils.getCenterXOfMass( this.particles1 );
    this.centerOfMass2Property.value = ParticleUtils.getCenterXOfMass( this.particles2 );
  }

  /**
   * Updates the Data displayed for the left and right sides of the container.
   */
  private updateData(): void {
    this.leftData.update( this.particles1, this.particles2 );
    this.rightData.update( this.particles1, this.particles2 );
  }
}

/**
 * Adds n particles to the end of the specified array. Particles must be inside positionBounds.
 */
function addParticles( n: number, positionBounds: Bounds2, settings: DiffusionSettings, particles: Particle[],
                       createParticle: ( options: CreateParticleOptions ) => Particle ): void {
  assert && assert( n > 0, `invalid n: ${n}` );

  // Create n particles
  for ( let i = 0; i < n; i++ ) {

    const particle = createParticle( {
      mass: settings.massProperty.value,
      radius: settings.radiusProperty.value
    } );

    // Position the particle at a random position within positionBounds, accounting for particle radius.
    const x = dotRandom.nextDoubleBetween( positionBounds.minX + particle.radius, positionBounds.maxX - particle.radius );
    const y = dotRandom.nextDoubleBetween( positionBounds.minY + particle.radius, positionBounds.maxY - particle.radius );
    particle.setPositionXY( x, y );
    assert && assert( positionBounds.containsPoint( particle.position ), 'particle is outside of positionBounds' );

    // Set the initial velocity, based on initial temperature and mass.
    particle.setVelocityPolar(
      // |v| = sqrt( 3kT / m )
      Math.sqrt( 3 * GasPropertiesConstants.BOLTZMANN * settings.initialTemperatureProperty.value / particle.mass ),

      // Random angle
      dotRandom.nextDouble() * 2 * Math.PI
    );

    particles.push( particle );
  }
}

/**
 * When mass or initial temperature changes, update particles and adjust their speed accordingly.
 */
function updateMassAndTemperature( mass: number, temperature: number, particles: Particle[] ): void {
  assert && assert( mass > 0, `invalid mass: ${mass}` );
  assert && assert( temperature >= 0, `invalid temperature: ${temperature}` );
  assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );

  for ( let i = particles.length - 1; i >= 0; i-- ) {
    particles[ i ].mass = mass;

    // |v| = sqrt( 3kT / m )
    particles[ i ].setVelocityMagnitude( Math.sqrt( 3 * GasPropertiesConstants.BOLTZMANN * temperature / mass ) );
  }
}

/**
 * Updates the radius for a set of particles.
 * @param radius
 * @param particles
 * @param bounds - particles should be inside these bounds
 * @param isPlaying
 */
function updateRadius( radius: number, particles: Particle[], bounds: Bounds2, isPlaying: boolean ): void {
  assert && assert( radius > 0, `invalid radius: ${radius}` );

  for ( let i = particles.length - 1; i >= 0; i-- ) {

    const particle = particles[ i ];
    particle.radius = radius;

    // If the sim is paused, then adjust the position of any particles are not fully inside the bounds.
    // While the sim is playing, this adjustment will be handled by collision detection.
    if ( !isPlaying ) {

      // constrain horizontally
      if ( particle.left < bounds.minX ) {
        particle.left = bounds.minX;
      }
      else if ( particle.right > bounds.maxX ) {
        particle.right = bounds.maxX;
      }

      // constrain vertically
      if ( particle.bottom < bounds.minY ) {
        particle.bottom = bounds.minY;
      }
      else if ( particle.top > bounds.maxY ) {
        particle.top = bounds.maxY;
      }
    }
  }
}

gasProperties.register( 'DiffusionModel', DiffusionModel );