// Copyright 2019, University of Colorado Boulder

/**
 * Sub-component of the 'Diffusion' screen model that deals with flow rate for one set of particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const NumberProperty = require( 'AXON/NumberProperty' );

  // constants
  const SAMPLE_PERIOD = 1; // Properties are updated with this frequency, in ps

  class ParticleFlowRate {

    constructor( dividerX, particles ) {

      this.dividerX = dividerX;
      
      // @private
      this.particles = particles;

      // @public flow rate to left side of container, in particles/ps
      this.leftFlowRateProperty = new NumberProperty( 0 );
      
      // @public flow rate to right side of container, in particles/ps
      this.rightFlowRateProperty = new NumberProperty( 0 );

      // @private accumulators
      this.flowRateDtAccumulator = 0;
      this.numberToLeft = 0;
      this.numberToRight = 0;
    }

    // @public
    reset() {
      this.leftFlowRateProperty.reset();
      this.rightFlowRateProperty.reset();
      this.resetAccumulators();
    }

    // @private
    resetAccumulators() {
      this.flowRateDtAccumulator = 0;
      this.numberToLeft = 0;
      this.numberToRight = 0;
    }

    /**
     * @param {number} dt - time delta, in ps
     * @private
     */
    step( dt ) {

      // Record the number of particles that crossed between left and right sides on this time step.
      for ( let i = 0; i < this.particles.length; i++ ) {
        const particle = this.particles[ i ];
        if ( particle.previousLocation.x >= this.dividerX && particle.location.x < this.dividerX ) {
          this.numberToLeft++;
        }
        else if ( particle.previousLocation.x <= this.dividerX && particle.location.x > this.dividerX ) {
          this.numberToRight++;
        }
      }

      this.flowRateDtAccumulator += dt;

      if ( this.flowRateDtAccumulator >= SAMPLE_PERIOD ) {

        // update flow-rate Properties
        this.leftFlowRateProperty.value = this.numberToLeft / this.flowRateDtAccumulator;
        this.rightFlowRateProperty.value = this.numberToRight / this.flowRateDtAccumulator;

        this.resetAccumulators();
      }
    }
  }

  return gasProperties.register( 'ParticleFlowRate', ParticleFlowRate );
} );