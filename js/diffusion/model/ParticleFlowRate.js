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
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const NumberProperty = require( 'AXON/NumberProperty' );

  // constants
  // Properties are updated with this frequency, in ps
  const SAMPLE_PERIOD = GasPropertiesQueryParameters.flowRateSamplePeriod;
  const FLOW_RATE_OPTIONS = {
    units: 'particles/ps'
  };

  class ParticleFlowRate {

    constructor( dividerX, particles ) {

      this.dividerX = dividerX;
      
      // @private
      this.particles = particles;

      // @public flow rate to left side of container, in particles/ps
      this.leftFlowRateProperty = new NumberProperty( 0, FLOW_RATE_OPTIONS );
      
      // @public flow rate to right side of container, in particles/ps
      this.rightFlowRateProperty = new NumberProperty( 0, FLOW_RATE_OPTIONS );

      // @private accumulators
      this.dtAccumulator = 0;
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
      this.dtAccumulator = 0;
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

      this.dtAccumulator += dt;

      if ( this.dtAccumulator >= SAMPLE_PERIOD ) {

        // update flow-rate Properties
        this.leftFlowRateProperty.value = this.numberToLeft / this.dtAccumulator;
        this.rightFlowRateProperty.value = this.numberToRight / this.dtAccumulator;

        this.resetAccumulators();
      }
    }
  }

  return gasProperties.register( 'ParticleFlowRate', ParticleFlowRate );
} );