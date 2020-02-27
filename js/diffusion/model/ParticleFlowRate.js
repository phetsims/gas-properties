// Copyright 2019-2020, University of Colorado Boulder

/**
 * ParticleFlowRate is a sub-model of the 'Diffusion' screen model, responsible for flow rate for one set of particles.
 * Flow rate is the number of particles moving between the two sides of the container, in particles/ps.
 * It uses a running average.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';

// constants
const FLOW_RATE_PROPERTY_OPTIONS = {
  isValidValue: value => ( value >= 0 ),
  units: 'particles/ps',
  phetioReadOnly: true // derived from state of the particle system
};

// number of samples used to compute running average, see https://github.com/phetsims/gas-properties/issues/51
const NUMBER_OF_SAMPLES = 300;

class ParticleFlowRate {

  /**
   * @param {number} dividerX - x position of the container's divider
   * @param {Particle[]} particles - particles to be monitored
   * @param {Object} [options]
   */
  constructor( dividerX, particles, options ) {
    assert && assert( typeof dividerX === 'number', `invalid dividerX: ${dividerX}` );
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options );

    // @private
    this.dividerX = dividerX;
    this.particles = particles;

    // @public flow rate to left side of container, in particles/ps
    this.leftFlowRateProperty = new NumberProperty( 0, merge( {}, FLOW_RATE_PROPERTY_OPTIONS, {
      tandem: options.tandem.createTandem( 'leftFlowRateProperty' ),
      phetioDocumentation: 'flow rate of particles to the left side of the container'
    } ) );

    // @public flow rate to right side of container, in particles/ps
    this.rightFlowRateProperty = new NumberProperty( 0, merge( {}, FLOW_RATE_PROPERTY_OPTIONS, {
      tandem: options.tandem.createTandem( 'rightFlowRateProperty' ),
      phetioDocumentation: 'flow rate of particles to the right side of the container'
    } ) );

    // @private {number[]} samples of number of particles that have crossed the container's divider
    this.leftCounts = []; // particles that crossed from right to left <--
    this.rightCounts = []; // particles that crossed from left to right -->

    // @private {number[]} dt values for each sample
    this.dts = [];
  }

  // @public
  reset() {
    this.leftFlowRateProperty.reset();
    this.rightFlowRateProperty.reset();
    this.leftCounts.length = 0;
    this.rightCounts.length = 0;
    this.dts.length = 0;
  }

  /**
   * @param {number} dt - time delta , in ps
   * @public
   */
  step( dt ) {
    assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

    // Take a sample.
    let leftCount = 0; // <--
    let rightCount = 0; // -->
    for ( let i = this.particles.length - 1; i >= 0; i-- ) {
      const particle = this.particles[ i ];
      if ( particle.previousPosition.x >= this.dividerX && particle.position.x < this.dividerX ) {
        leftCount++;
      }
      else if ( particle.previousPosition.x <= this.dividerX && particle.position.x > this.dividerX ) {
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
}

gasProperties.register( 'ParticleFlowRate', ParticleFlowRate );
export default ParticleFlowRate;