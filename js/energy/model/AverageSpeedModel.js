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
  const GasPropertiesModel = require( 'GAS_PROPERTIES/common/model/GasPropertiesModel' );
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
      assert && assert( model instanceof GasPropertiesModel, `invalid model: ${model}` );
      assert && assert( typeof samplePeriod === 'number' && samplePeriod > 0,
        `invalid samplePeriod: ${samplePeriod}` );

      // @private
      this.model = model;
      this.samplePeriod = samplePeriod;

      // @public (read-only) {Property.<number|null>}
      // average speed of particle species in the container, in pm/ps, null when the container is empty
      this.heavyAverageSpeedProperty = new Property( null, AVERAGE_SPEED_PROPERTY_OPTIONS );
      this.lightAverageSpeedProperty = new Property( null, AVERAGE_SPEED_PROPERTY_OPTIONS );

      // @private used internally to smooth the average speed computation
      this.dtAccumulator = 0; // accumulated dts while samples were taken
      this.numberOfSamples = 0; // number of samples we've taken
      this.heavyAverageSpeedSum = 0; // sum of samples for heavy particles
      this.lightAverageSpeedSum = 0; // sum of samples for light particles

      // Reset sample data when the play state changes, so that we can update immediately if manually stepping.
      model.isPlayingProperty.link( isPlaying => {
        this.clearSamples();
      } );

      // If the number of particles changes while paused, sample the current state and update immediately.
      model.totalNumberOfParticlesProperty.link( totalNumberOfParticles => {
        if ( !model.isPlayingProperty.value ) {
          this.sample();
          this.update();
        }
      } );
    }

    /**
     * @public
     */
    reset() {
      this.heavyAverageSpeedProperty.reset();
      this.lightAverageSpeedProperty.reset();
      this.clearSamples();
    }

    /**
     * Clears the sample data.
     * @private
     */
    clearSamples() {
      this.dtAccumulator = 0;
      this.numberOfSamples = 0;
      this.heavyAverageSpeedSum = 0;
      this.lightAverageSpeedSum = 0;
    }

    /**
     * Computes the average speed for each particle type, smoothed over an interval.
     * @param {number} dt - time delta, in ps
     * @private
     */
    step( dt ) {

      // Accumulate dt
      this.dtAccumulator += dt;

      // Takes data samples
      this.sample();

      // Update now if we've reached the end of the sample period, or if we're manually stepping
      if ( this.dtAccumulator >= this.samplePeriod || !this.model.isPlayingProperty.value ) {
        this.update();
      }
    }

    /**
     * Takes a data sample.
     * @private
     */
    sample() {
      assert && assert( !( this.numberOfSamples !== 0 && !this.model.isPlayingProperty.value ),
        'numberOfSamples should be 0 if called while the sim is paused' );
      
      this.heavyAverageSpeedSum += getAverageSpeed( this.model.heavyParticles );
      this.lightAverageSpeedSum += getAverageSpeed( this.model.lightParticles );
      this.numberOfSamples++;
    }

    /**
     * Updates Properties using the current sample data.
     * @private
     */
    update() {
      assert && assert( !( this.numberOfSamples !== 1 && !this.model.isPlayingProperty.value ), 
        'numberOfSamples should be 1 if called while the sim is paused' );

      // heavy particles
      if ( this.model.heavyParticles.length === 0 ) {
        this.heavyAverageSpeedProperty.value = null;
      }
      else {
        this.heavyAverageSpeedProperty.value = this.heavyAverageSpeedSum / this.numberOfSamples;
      }
      
      // light particles
      if ( this.model.lightParticles.length === 0 ) {
        this.lightAverageSpeedProperty.value = null;
      }
      else {
        this.lightAverageSpeedProperty.value = this.lightAverageSpeedSum / this.numberOfSamples;
      }

      // Clear sample data in preparation for the next sample period.
      this.clearSamples();
    }
  }

  /**
   * Gets the average speed for a set of particles, in pm/ps.
   * @param {Particle[]} particles
   * @returns {number} 0 if there are no particles
   */
  function getAverageSpeed( particles ) {
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );

    let averageSpeed = 0;
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