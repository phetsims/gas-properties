// Copyright 2024, University of Colorado Boulder

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
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import ParticleFlowRateModel from './ParticleFlowRateModel.js';

const CENTER_OF_MASS_PROPERTY_OPTIONS = {
  units: 'pm',
  valueType: [ 'number', null ],
  phetioValueType: NullableIO( NumberIO ),
  phetioReadOnly: true // derived from the state of the particle system
};

// This should match DIFFUSION_PARTICLE_SYSTEM_SCHEMA, but with JavaScript types.
type DiffusionParticleSystemStateObject = {
  particles1: DiffusionParticle1StateObject[];
  particles2: DiffusionParticle2StateObject[];
};

// This should match DiffusionParticleSystemStateObject, but with IOTypes.
const DIFFUSION_PARTICLE_SYSTEM_SCHEMA = {
  particles1: ArrayIO( DiffusionParticle1.DiffusionParticle1IO ),
  particles2: ArrayIO( DiffusionParticle2.DiffusionParticle2IO )
};

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
      phetioType: DiffusionParticleSystem.DiffusionParticleSystemIO
    } );

    this.container = container;
    this.isPlayingProperty = isPlayingProperty;

    this.particles1 = [];
    this.particles2 = [];

    // Intermediate tandems to provide the desired structure for the Studio tree.
    const particle1Tandem = tandem.createTandem( 'particle1' );
    const particle2Tandem = tandem.createTandem( 'particle2' );

    this.particle1Settings = new DiffusionSettings( particle1Tandem.createTandem( 'settings' ) );
    this.particle2Settings = new DiffusionSettings( particle2Tandem.createTandem( 'settings' ) );

    // Synchronize particle counts and arrays.
    const createDiffusionParticle1 = ( options: CreateParticleOptions ) => new DiffusionParticle1( options );
    this.particle1Settings.numberOfParticlesProperty.link( numberOfParticles => {
      this.updateNumberOfParticles( numberOfParticles,
        container.leftBounds,
        this.particle1Settings,
        this.particles1,
        createDiffusionParticle1 );
    } );
    const createDiffusionParticle2 = ( options: CreateParticleOptions ) => new DiffusionParticle2( options );
    this.particle2Settings.numberOfParticlesProperty.link( numberOfParticles => {
      this.updateNumberOfParticles( numberOfParticles,
        container.rightBounds,
        this.particle2Settings,
        this.particles2,
        createDiffusionParticle2 );
    } );

    this.numberOfParticlesProperty = new DerivedProperty(
      [ this.particle1Settings.numberOfParticlesProperty, this.particle2Settings.numberOfParticlesProperty ],
      ( numberOfParticles1, numberOfParticles2 ) => {

        // Skip these assertions when PhET-iO state is being restored, because at least one of the arrays will
        // definitely not be populated. See https://github.com/phetsims/gas-properties/issues/178
        if ( !isSettingPhetioStateProperty.value ) {

          // Verify that particle arrays have been populated before numberOfParticlesProperty is updated.
          // If you hit these assertions, then you need to add this listener later.  This is a trade-off
          // for using plain old Arrays instead of ObservableArrayDef.
          assert && assert( this.particles1.length === numberOfParticles1, 'particles1 has not been populated yet' );
          assert && assert( this.particles2.length === numberOfParticles2, 'particles2 has not been populated yet' );
        }
        return numberOfParticles1 + numberOfParticles2;
      }, {
        isValidValue: value => ( Number.isInteger( value ) && value >= 0 ),
        phetioValueType: NumberIO,
        tandem: tandem.createTandem( 'numberOfParticlesProperty' ),
        phetioFeatured: true,
        phetioDocumentation: 'Total number of particles in the container.'
      } );

    this.centerOfMass1Property = new Property<number | null>( null,
      combineOptions<PropertyOptions<number | null>>( {}, CENTER_OF_MASS_PROPERTY_OPTIONS, {
        tandem: particle1Tandem.createTandem( 'centerOfMassProperty' ),
        phetioReadOnly: true,
        phetioFeatured: true,
        phetioDocumentation: 'Center of mass for particles of type 1. This is the x offset from the center of the container.'
      } ) );

    this.centerOfMass2Property = new Property<number | null>( null,
      combineOptions<PropertyOptions<number | null>>( {}, CENTER_OF_MASS_PROPERTY_OPTIONS, {
        tandem: particle2Tandem.createTandem( 'centerOfMassProperty' ),
        phetioReadOnly: true,
        phetioFeatured: true,
        phetioDocumentation: 'Center of mass for particles of type 2. This is the x offset from the center of the container.'
      } ) );

    this.particle1FlowRateModel = new ParticleFlowRateModel( this.container.dividerX, this.particles1, particle1Tandem );
    this.particle2FlowRateModel = new ParticleFlowRateModel( this.container.dividerX, this.particles2, particle2Tandem );

    // Update mass and temperature of existing particles. This adjusts speed of the particles.
    Multilink.multilink(
      [ this.particle1Settings.massProperty, this.particle1Settings.initialTemperatureProperty ],
      ( mass, initialTemperature ) => {
        updateMassAndSpeed( mass, initialTemperature, this.particles1 );
      } );
    Multilink.multilink(
      [ this.particle2Settings.massProperty, this.particle2Settings.initialTemperatureProperty ],
      ( mass, initialTemperature ) => {
        updateMassAndSpeed( mass, initialTemperature, this.particles2 );
      } );

    // Update radii of existing particles.
    this.particle1Settings.radiusProperty.link( radius => {
      updateRadius( radius, this.particles1, container.leftBounds, isPlayingProperty.value );
    } );
    this.particle2Settings.radiusProperty.link( radius => {
      updateRadius( radius, this.particles2, container.rightBounds, isPlayingProperty.value );
    } );
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
   * Serializes this instance of DiffusionParticleSystem.
   */
  private toStateObject(): DiffusionParticleSystemStateObject {
    return {
      particles1: this.particles1.map( particle => DiffusionParticle1.DiffusionParticle1IO.toStateObject( particle ) ),
      particles2: this.particles2.map( particle => DiffusionParticle2.DiffusionParticle2IO.toStateObject( particle ) )
    };
  }

  /**
   * Deserializes an instance of DiffusionParticleSystem.
   */
  private static applyState( particleSystem: DiffusionParticleSystem, stateObject: DiffusionParticleSystemStateObject ): void {

    particleSystem.particles1.length = 0;
    stateObject.particles1.forEach( ( stateObject: DiffusionParticle1StateObject ) => {
      particleSystem.particles1.push( DiffusionParticle1.DiffusionParticle1IO.fromStateObject( stateObject ) );
    } );

    particleSystem.particles2.length = 0;
    stateObject.particles2.forEach( ( stateObject: DiffusionParticle2StateObject ) => {
      particleSystem.particles2.push( DiffusionParticle2.DiffusionParticle2IO.fromStateObject( stateObject ) );
    } );
  }

  /**
   * DiffusionParticleSystemIO handles serialization of the particle arrays.
   * TODO https://github.com/phetsims/gas-properties/issues/231 What type of serialization is this?
   */
  private static readonly DiffusionParticleSystemIO = new IOType<DiffusionParticleSystem, DiffusionParticleSystemStateObject>( 'DiffusionParticleSystemIO', {
    valueType: DiffusionParticleSystem,
    defaultDeserializationMethod: 'applyState',
    stateSchema: DIFFUSION_PARTICLE_SYSTEM_SCHEMA,
    toStateObject: particleSystem => particleSystem.toStateObject(),
    applyState: DiffusionParticleSystem.applyState
  } );
}

/**
 * Adds n particles to the end of the specified array. Particles must be inside positionBounds.
 */
function addParticles( n: number, positionBounds: Bounds2, settings: DiffusionSettings, particles: Particle[],
                       createParticle: ( options: CreateParticleOptions ) => Particle ): void {
  assert && assert( n > 0 && Number.isInteger( n ), `invalid n: ${n}` );

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