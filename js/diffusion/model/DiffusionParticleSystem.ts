// Copyright 2018-2024, University of Colorado Boulder

/**
 * DiffusionParticleSystem is the particle system for the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import gasProperties from '../../gasProperties.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import DiffusionParticle1, { DiffusionParticle1StateObject } from './DiffusionParticle1.js';
import DiffusionParticle2, { DiffusionParticle2StateObject } from './DiffusionParticle2.js';
import DiffusionSettings from './DiffusionSettings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ParticleUtils from '../../common/model/ParticleUtils.js';
import Multilink from '../../../../axon/js/Multilink.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import DiffusionParticle from './DiffusionParticle.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import DiffusionContainer from './DiffusionContainer.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Particle, { ParticleOptions } from '../../common/model/Particle.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Property, { PropertyOptions } from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ParticleFlowRateModel from './ParticleFlowRateModel.js';
import ReferenceArrayIO from '../../../../tandem/js/types/ReferenceArrayIO.js';

const CENTER_OF_MASS_PROPERTY_OPTIONS: PropertyOptions<number | null> = {
  units: 'pm',
  valueType: [ 'number', null ],
  phetioValueType: NullableIO( NumberIO ),
  phetioFeatured: true,
  phetioReadOnly: true // derived from the state of the particle system
};

// This should match STATE_SCHEMA, but with JavaScript types.
type DiffusionParticleSystemStateObject = {
  particles1: DiffusionParticle1StateObject[];
  particles2: DiffusionParticle2StateObject[];
};

// This should match DiffusionParticleSystemStateObject, but with IOTypes.
const STATE_SCHEMA = {
  particles1: ReferenceArrayIO( DiffusionParticle1.DiffusionParticle1IO ),
  particles2: ReferenceArrayIO( DiffusionParticle2.DiffusionParticle2IO )
};

// This is the documentation that appears for DiffusionParticleSystemIO in Studio.
// Each field in STATE_SCHEMA should be described, in the same order as STATE_SCHEMA.
const IO_TYPE_DOCUMENTATION =
  'PhET-iO Type for the particle system. Fields include:<br>' +
  '<ul>' +
  '<li>particles1: particles of type 1 that are inside the container<br>' +
  '<li>particles2: particles of type 2 that are inside the container<br>' +
  '</ul>';

// Options to createParticle functions
type CreateParticleOptions = PickRequired<ParticleOptions, 'mass' | 'radius'>;

export default class DiffusionParticleSystem extends PhetioObject {

  private readonly container: DiffusionContainer;
  private readonly isPlayingProperty: TReadOnlyProperty<boolean>;

  // Particles of each species, together these make up the 'particle system'.
  public readonly particles1: DiffusionParticle1[];
  public readonly particles2: DiffusionParticle2[];

  // Settings for the particle types 1 and 2, before the divider is removed.
  public readonly particle1Settings: DiffusionSettings;
  public readonly particle2Settings: DiffusionSettings;

  // N, the total number of particles in the container
  public readonly numberOfParticlesProperty: TReadOnlyProperty<number>;

  // Center of mass for each particle species, in pm, relative to the center (divider) of the container.
  // null when there are no particles in the container. This is actually an x offset, not a 'center' Vector2.
  // But we decided to keep these Property names so that they match the associated checkbox labels.
  // See https://github.com/phetsims/gas-properties/issues/228
  public readonly centerOfMass1Property: Property<number | null>;
  public readonly centerOfMass2Property: Property<number | null>;

  // Flow rate model for each particle species.
  public readonly particle1FlowRateModel: ParticleFlowRateModel;
  public readonly particle2FlowRateModel: ParticleFlowRateModel;

  public constructor( container: DiffusionContainer, isPlayingProperty: TReadOnlyProperty<boolean>, tandem: Tandem ) {

    super( {
      isDisposable: true,
      tandem: tandem,
      phetioType: DiffusionParticleSystem.DiffusionParticleSystemIO,
      phetioFeatured: true
    } );

    this.container = container;
    this.isPlayingProperty = isPlayingProperty;

    this.particles1 = [];
    this.particles2 = [];

    this.particle1Settings = new DiffusionSettings( tandem.createTandem( 'particle1Settings' ) );
    this.particle2Settings = new DiffusionSettings( tandem.createTandem( 'particle2Settings' ) );

    // Synchronize particle counts and arrays.
    this.particle1Settings.numberOfParticlesProperty.link( numberOfParticles => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.updateNumberOfParticles( numberOfParticles, this.particles1, this.particle1Settings, container.leftBounds,
          ( options: CreateParticleOptions ) => new DiffusionParticle1( options ) );
      }
    } );
    this.particle2Settings.numberOfParticlesProperty.link( numberOfParticles => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.updateNumberOfParticles( numberOfParticles, this.particles2, this.particle2Settings, container.rightBounds,
          ( options: CreateParticleOptions ) => new DiffusionParticle2( options ) );
      }
    } );

    this.numberOfParticlesProperty = new DerivedProperty(
      [ this.particle1Settings.numberOfParticlesProperty, this.particle2Settings.numberOfParticlesProperty ],
      ( numberOfParticles1, numberOfParticles2 ) => numberOfParticles1 + numberOfParticles2, {
        isValidValue: value => ( Number.isInteger( value ) && value >= 0 ),
        phetioValueType: NumberIO,
        tandem: tandem.createTandem( 'numberOfParticlesProperty' ),
        phetioFeatured: true,
        phetioDocumentation: 'Total number of particles in the container.'
      } );

    // After PhET-iO state has been restored, verify the sanity of the particle system.
    if ( assert && Tandem.PHET_IO_ENABLED ) {
      phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( () => {
        assert && assert( this.particles1.length === this.particle1Settings.numberOfParticlesProperty.value, 'incorrect number of particles1' );
        assert && assert( this.particles2.length === this.particle2Settings.numberOfParticlesProperty.value, 'incorrect number of particles2' );
      } );
    }

    this.centerOfMass1Property = new Property<number | null>( null,
      combineOptions<PropertyOptions<number | null>>( {}, CENTER_OF_MASS_PROPERTY_OPTIONS, {
        tandem: tandem.createTandem( 'centerOfMass1Property' ),
        phetioDocumentation: 'Center of mass for particles of type 1. This is the x offset from the center of the container.'
      } ) );

    this.centerOfMass2Property = new Property<number | null>( null,
      combineOptions<PropertyOptions<number | null>>( {}, CENTER_OF_MASS_PROPERTY_OPTIONS, {
        tandem: tandem.createTandem( 'centerOfMass2Property' ),
        phetioDocumentation: 'Center of mass for particles of type 2. This is the x offset from the center of the container.'
      } ) );

    this.particle1FlowRateModel = new ParticleFlowRateModel( this.container.dividerX, this.particles1, tandem.createTandem( 'particle1FlowRateModel' ) );
    this.particle2FlowRateModel = new ParticleFlowRateModel( this.container.dividerX, this.particles2, tandem.createTandem( 'particle2FlowRateModel' ) );

    // Update mass and temperature of existing particles. This adjusts speed of the particles.
    Multilink.multilink(
      [ this.particle1Settings.massProperty, this.particle1Settings.initialTemperatureProperty ],
      ( mass, initialTemperature ) => updateMassAndSpeed( mass, initialTemperature, this.particles1 ) );
    Multilink.multilink(
      [ this.particle2Settings.massProperty, this.particle2Settings.initialTemperatureProperty ],
      ( mass, initialTemperature ) => updateMassAndSpeed( mass, initialTemperature, this.particles2 ) );

    // Update radii of existing particles.
    this.particle1Settings.radiusProperty.link( radius =>
      updateRadius( radius, this.particles1, container.leftBounds, isPlayingProperty.value ) );
    this.particle2Settings.radiusProperty.link( radius =>
      updateRadius( radius, this.particles2, container.rightBounds, isPlayingProperty.value ) );
  }

  public reset(): void {
    this.particle1Settings.reset();
    this.particle2Settings.reset();
    assert && assert( this.particles1.length === 0, 'there should be no DiffusionParticle1 particles' );
    assert && assert( this.particles2.length === 0, 'there should be no DiffusionParticle2 particles' );

    this.centerOfMass1Property.reset();
    this.centerOfMass2Property.reset();
    this.particle1FlowRateModel.reset();
    this.particle2FlowRateModel.reset();
  }

  public restart(): void {

    this.particle1Settings.restart();
    this.particle2Settings.restart();

    this.particle1FlowRateModel.reset();
    this.particle2FlowRateModel.reset();
  }

  public step( dt: number ): void {

    // Step particles
    ParticleUtils.stepParticles( this.particles1, dt );
    ParticleUtils.stepParticles( this.particles2, dt );

    // Particle Flow Rate model
    if ( !this.container.isDividedProperty.value ) {
      this.particle1FlowRateModel.step( dt );
      this.particle2FlowRateModel.step( dt );
    }
  }

  /**
   * Adjusts an array of particles to have the desired number of elements.
   * @param numberOfParticles - desired number of particles
   * @param particles - array of particles that corresponds to newValue and oldValue
   * @param settings
   * @param positionBounds - initial position will be inside this bounds
   * @param createParticle - creates a Particle instance
   */
  private updateNumberOfParticles( numberOfParticles: number,
                                   particles: Particle[],
                                   settings: DiffusionSettings,
                                   positionBounds: Bounds2,
                                   createParticle: ( options: CreateParticleOptions ) => Particle ): void {
    assert && assert( !isSettingPhetioStateProperty.value, 'updateNumberOfParticles should not be called while setting state.' );

    const delta = numberOfParticles - particles.length;
    if ( delta !== 0 ) {
      if ( delta > 0 ) {
        addParticles( delta, particles, settings, positionBounds, createParticle );
      }
      else {
        ParticleUtils.removeLastParticles( -delta, particles );
      }

      // If paused, update things that would normally be handled by step.
      if ( !this.isPlayingProperty.value ) {
        this.updateCenterOfMass();
      }
    }
  }

  /**
   * Updates the center of mass, as shown by the center-of-mass indicators.
   */
  public updateCenterOfMass(): void {
    this.centerOfMass1Property.value = ParticleUtils.getCenterXOfMass( this.particles1, this.container.width / 2 );
    this.centerOfMass2Property.value = ParticleUtils.getCenterXOfMass( this.particles2, this.container.width / 2 );
  }

  /**
   * DiffusionParticleSystemIO handles serialization of the particle arrays. It implements reference-type serialization,
   * as described in https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization.
   */
  private static readonly DiffusionParticleSystemIO = new IOType<DiffusionParticleSystem, DiffusionParticleSystemStateObject>( 'DiffusionParticleSystemIO', {
    valueType: DiffusionParticleSystem,
    stateSchema: STATE_SCHEMA,
    documentation: IO_TYPE_DOCUMENTATION
    // toStateObject: Use the default, which is derived from stateSchema.
    // applyState: Use the default, which is derived from stateSchema.
  } );
}

/**
 * Adds n particles to the end of the specified array. Particles must be inside positionBounds.
 */
function addParticles( n: number,
                       particles: Particle[],
                       settings: DiffusionSettings,
                       positionBounds: Bounds2,
                       createParticle: ( options: CreateParticleOptions ) => Particle ): void {
  assert && assert( n > 0 && Number.isInteger( n ), `invalid n: ${n}` );
  assert && assert( !isSettingPhetioStateProperty.value, 'addParticles should not be called while setting state.' );

  // Create n particles
  for ( let i = 0; i < n; i++ ) {

    const particle = createParticle( {
      mass: settings.massProperty.value,
      radius: settings.radiusProperty.value
    } );

    // Position the particle at a random position within positionBounds, accounting for particle radius.
    const x = dotRandom.nextDoubleBetween( positionBounds.minX + particle.radius, positionBounds.maxX - particle.radius );
    const y = dotRandom.nextDoubleBetween( positionBounds.minY + particle.radius, positionBounds.maxY - particle.radius );
    particle.setXY( x, y );
    assert && assert( positionBounds.containsCoordinates( particle.x, particle.y ), 'particle is outside of positionBounds' );

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
 * Update the mass and speed for a set of particles. Speed is based on temperature and mass.
 */
function updateMassAndSpeed( mass: number, temperature: number, particles: DiffusionParticle[] ): void {
  assert && assert( mass > 0, `invalid mass: ${mass}` );
  assert && assert( temperature >= 0, `invalid temperature: ${temperature}` );
  assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
  assert && assert( !isSettingPhetioStateProperty.value, 'updateMassAndSpeed should not be called while setting state.' );

  for ( let i = particles.length - 1; i >= 0; i-- ) {
    particles[ i ].setMass( mass );

    // |v| = sqrt( 3kT / m )
    particles[ i ].setSpeed( Math.sqrt( 3 * GasPropertiesConstants.BOLTZMANN * temperature / mass ) );
  }
}

/**
 * Updates the radius for a set of particles. Particles will be inside the specified bounds.
 */
function updateRadius( radius: number, particles: DiffusionParticle[], bounds: Bounds2, isPlaying: boolean ): void {
  assert && assert( radius > 0, `invalid radius: ${radius}` );
  assert && assert( !isSettingPhetioStateProperty.value, 'updateRadius should not be called while setting state.' );

  for ( let i = particles.length - 1; i >= 0; i-- ) {

    const particle = particles[ i ];
    particle.setRadius( radius );

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

gasProperties.register( 'DiffusionParticleSystem', DiffusionParticleSystem );