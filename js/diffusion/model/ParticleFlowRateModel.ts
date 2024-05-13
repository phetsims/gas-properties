// Copyright 2019-2024, University of Colorado Boulder

/**
 * ParticleFlowRateModel is a sub-model of the 'Diffusion' screen model, responsible for flow rate for one set of particles.
 * Flow rate is the number of particles moving between the two sides of the container, in particles/ps.
 * It uses a running average.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property, { PropertyOptions } from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Particle from '../../common/model/Particle.js';
import gasProperties from '../../gasProperties.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';

const FLOW_RATE_PROPERTY_OPTIONS: PropertyOptions<number> = {
  isValidValue: value => ( value >= 0 ),
  units: 'particles/ps',
  phetioReadOnly: true // derived from state of the particle system
};

// number of samples used to compute running average, see https://github.com/phetsims/gas-properties/issues/51
const NUMBER_OF_SAMPLES = 300;

// This should match PARTICLE_FLOW_RATE_MODEL_STATE_SCHEMA, but with JavaScript types.
type ParticleFlowRateModelStateObject = {
  dts: number[];
  leftCounts: number[];
  rightCounts: number[];
};

// This should match ParticleFlowRateModelStateObject, but with IOTypes.
const PARTICLE_FLOW_RATE_MODEL_STATE_SCHEMA = {
  dts: ArrayIO( NumberIO ),
  leftCounts: ArrayIO( NumberIO ),
  rightCounts: ArrayIO( NumberIO )
};

export default class ParticleFlowRateModel extends PhetioObject {

  private readonly dividerX: number;
  private readonly particles: Particle[];

  // flow rate to left side of container, in particles/ps
  public readonly leftFlowRateProperty: Property<number>;

  // flow rate to right side of container, in particles/ps
  public readonly rightFlowRateProperty: Property<number>;

  // samples of number of particles that have crossed the container's divider
  private readonly leftCounts: number[]; // Number of particles that crossed from right to left <--
  private readonly rightCounts: number[]; // Number of particles that crossed from left to right -->

  // dt values for each sample
  private readonly dts: number[];

  /**
   * @param dividerX - x position of the container's divider
   * @param particles - particles to be monitored
   * @param tandem
   */
  public constructor( dividerX: number, particles: Particle[], tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem,
      phetioType: ParticleFlowRateModel.ParticleFlowRateModelIO
    } );

    this.dividerX = dividerX;
    this.particles = particles;

    this.leftFlowRateProperty = new NumberProperty( 0,
      combineOptions<PropertyOptions<number>>( {}, FLOW_RATE_PROPERTY_OPTIONS, {
        tandem: tandem.createTandem( 'leftFlowRateProperty' ),
        phetioFeatured: true,
        phetioReadOnly: true,
        phetioDocumentation: 'Flow rate of particles to the left side of the container (time averaged).'
      } ) );

    this.rightFlowRateProperty = new NumberProperty( 0,
      combineOptions<PropertyOptions<number>>( {}, FLOW_RATE_PROPERTY_OPTIONS, {
        tandem: tandem.createTandem( 'rightFlowRateProperty' ),
        phetioFeatured: true,
        phetioReadOnly: true,
        phetioDocumentation: 'Flow rate of particles to the right side of the container (time averaged).'
      } ) );

    this.leftCounts = [];
    this.rightCounts = [];

    this.dts = [];

    // After PhET-iO state has been restored, verify the sanity of the model.
    if ( assert && Tandem.PHET_IO_ENABLED ) {
      phet.phetio.phetioEngine.phetioStateEngine.stateSetEmitter.addListener( () => {
        assert && assert( this.dts.length === this.leftCounts.length, 'incorrect number of leftCounts' );
        assert && assert( this.leftCounts.length === this.rightCounts.length, 'incorrect number of rightCounts' );
      } );
    }
  }

  public reset(): void {
    this.leftFlowRateProperty.reset();
    this.rightFlowRateProperty.reset();
    this.leftCounts.length = 0;
    this.rightCounts.length = 0;
    this.dts.length = 0;
  }

  /**
   * @param dt - time delta , in ps
   */
  public step( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );

    // Take a sample.
    let leftCount = 0; // <--
    let rightCount = 0; // -->
    for ( let i = this.particles.length - 1; i >= 0; i-- ) {
      const particle = this.particles[ i ];
      if ( particle.previousX >= this.dividerX && particle.x < this.dividerX ) {
        leftCount++;
      }
      else if ( particle.previousX <= this.dividerX && particle.x > this.dividerX ) {
        rightCount++;
      }
    }
    this.leftCounts.push( leftCount );
    this.rightCounts.push( rightCount );
    this.dts.push( dt );

    // Drop the oldest sample.
    if ( this.leftCounts.length > NUMBER_OF_SAMPLES ) {
      this.leftCounts.shift();
      this.rightCounts.shift();
      this.dts.shift();
    }

    // All sample arrays should have the same length
    assert && assert( this.leftCounts.length === this.rightCounts.length && this.leftCounts.length === this.dts.length,
      'all arrays should have the same length' );

    // Update flow-rate Properties with an average of the current samples.
    const leftAverage = _.sum( this.leftCounts ) / this.leftCounts.length;
    const rightAverage = _.sum( this.rightCounts ) / this.rightCounts.length;
    const dtAverage = _.sum( this.dts ) / this.dts.length;
    this.leftFlowRateProperty.value = leftAverage / dtAverage;
    this.rightFlowRateProperty.value = rightAverage / dtAverage;
  }

  /**
   * Deserializes an instance of ParticleFlowRateModel.
   */
  private static applyState( particleFlowRateModel: ParticleFlowRateModel, stateObject: ParticleFlowRateModelStateObject ): void {

    particleFlowRateModel.dts.length = 0;
    particleFlowRateModel.dts.push( ...stateObject.dts );

    particleFlowRateModel.leftCounts.length = 0;
    particleFlowRateModel.leftCounts.push( ...stateObject.leftCounts );

    particleFlowRateModel.rightCounts.length = 0;
    particleFlowRateModel.rightCounts.push( ...stateObject.rightCounts );
  }

  /**
   * ParticleFlowRateModelIO handles serialization of the particle flow rate model. It implements reference-type serialization,
   * as described in https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization.
   */
  private static readonly ParticleFlowRateModelIO = new IOType<ParticleFlowRateModel, ParticleFlowRateModelStateObject>( 'ParticleFlowRateModelIO', {
    valueType: ParticleFlowRateModel,
    stateSchema: PARTICLE_FLOW_RATE_MODEL_STATE_SCHEMA,
    // toStateObject: Use the default, which is derived from stateSchema.
    applyState: ParticleFlowRateModel.applyState
  } );
}

gasProperties.register( 'ParticleFlowRateModel', ParticleFlowRateModel );