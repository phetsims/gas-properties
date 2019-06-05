// Copyright 2019, University of Colorado Boulder

/**
 * AverageSpeedModel is a sub-model in the Energy screen, responsible for data that is displayed in the
 * Average Speed accordion box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Property = require( 'AXON/Property' );

  // constants
  const AVERAGE_SPEED_PROPERTY_OPTIONS = {
    isValidValue: value => ( value === null || ( typeof value === 'number' && value >= 0 ) ),
    units: 'pm/ps'
  };

  class AverageSpeedModel {

    /**
     * @param {GasPropertiesModel} model
     * @param {number} samplePeriod - data is averaged over this period, in ps
     */
    constructor( model, samplePeriod ) {
      assert && assert( typeof samplePeriod === 'number' && samplePeriod > 0,
              `invalid samplePeriod: ${samplePeriod}` );

      // @private
      this.model = model;
      this.samplePeriod = samplePeriod;

      // @public (read-only) {Property.<number|null>}
      // average speed of heavy particles in the container, in pm/ps, null when the container is empty
      this.heavyAverageSpeedProperty = new Property( null, AVERAGE_SPEED_PROPERTY_OPTIONS );
      this.lightAverageSpeedProperty = new Property( null, AVERAGE_SPEED_PROPERTY_OPTIONS );

      // @private used internally to smooth the average speed computation
      this.dtAccumulator = 0; // accumulated dts while samples were taken
      this.numberOfAverageSpeedSamples = 0; // number of samples we've taken
      this.heavyAverageSpeedSum = 0; // sum of samples for heavy particles
      this.lightAverageSpeedSum = 0; // sum of samples for light particles
    }

    /**
     * @public
     */
    reset() {
      this.resetAccumulators();
    }

    /**
     * Resets dt accumulator and clears samples.
     * @private
     */
    resetAccumulators() {
      this.dtAccumulator = 0;
      this.numberOfAverageSpeedSamples = 0;
      this.heavyAverageSpeedSum = 0;
      this.lightAverageSpeedSum = 0;
    }

    /**
     * Computes the average speed for each particle type, smoothed over an interval.
     * @param {number} dt - time delta, in ps
     * @private
     */
    step( dt ) {

      this.heavyAverageSpeedSum += getAverageSpeed( this.model.heavyParticles );
      this.lightAverageSpeedSum += getAverageSpeed( this.model.lightParticles );
      this.numberOfAverageSpeedSamples++;

      this.dtAccumulator += dt;

      if ( this.dtAccumulator >= this.samplePeriod ) {

        // update the average speed Properties
        this.heavyAverageSpeedProperty.value = this.heavyAverageSpeedSum / this.numberOfAverageSpeedSamples;
        this.lightAverageSpeedProperty.value = this.lightAverageSpeedSum / this.numberOfAverageSpeedSamples;

        // Reset accumulators in preparation for the next sample period.
        this.resetAccumulators();
      }

      //TODO what about accumulators?
      // If particle counts go to zero, update immediately
      if ( this.model.heavyParticles.length === 0 ) {
        this.heavyAverageSpeedProperty.value = null;
      }
      if ( this.model.lightParticles.length === 0 ) {
        this.lightAverageSpeedProperty.value = null;
      }
    }
  }

  /**
   * Gets the average speed for a set of particles, in pm/ps.
   * @param {Particle[]} particles
   * @returns {number|null} null if there are no particles
   */
  function getAverageSpeed( particles ) {
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );

    let averageSpeed = null;
    if ( particles.length > 0 ) {
      let totalSpeed = 0;
      for ( let i = 0; i < particles.length; i++ ) {
        totalSpeed += particles[ i ].velocity.magnitude;
      }
      averageSpeed = totalSpeed / particles.length;
    }
    return averageSpeed;
  }

  return gasProperties.register( 'AverageSpeedModel', AverageSpeedModel );
} );