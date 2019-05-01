// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model for the 'Energy' screen, an extension of the 'Ideal' model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const HoldConstantEnum = require( 'GAS_PROPERTIES/common/model/HoldConstantEnum' );
  const IdealModel = require( 'GAS_PROPERTIES/common/model/IdealModel' );
  const Property = require( 'AXON/Property' );

  // constants
  const AVERAGE_SPEED_PROPERTY_OPTIONS = {
    isValidValue: value => ( value === null || typeof value === 'number' ),
    units: 'nm/ps'
  };
  const SAMPLE_PERIOD = GasPropertiesQueryParameters.averageSpeedSamplePeriod; // ps

  class EnergyModel extends IdealModel {

    constructor() {

      super( {
        holdConstant: HoldConstantEnum.VOLUME,
        hasCollisionCounter: false
      } );

      this.holdConstantProperty.lazyLink( holdConstant => {
        throw new Error( 'holdConstant is fixed in this screen' );
      } );

      //TODO should Average Speed and Speed Histogram both use get get*ParticleSpeedValues, to reduce iterations?
      // @public (read-only) {Property.<number|null>}
      // average speed of heavy particles in the container, null when container is empty, nm/s
      this.heavyAverageSpeedProperty = new Property( null, AVERAGE_SPEED_PROPERTY_OPTIONS );
      this.lightAverageSpeedProperty = new Property( null, AVERAGE_SPEED_PROPERTY_OPTIONS );

      // @private used internally to smooth the average speed computation
      this.dtAccumulator = 0; // accumulated dts while samples were taken
      this.numberOfAverageSpeedSamples = 0; // number of samples we've taken
      this.heavyAverageSpeedSum = 0; // sum of samples for heavy particles
      this.lightAverageSpeedSum = 0; // sum of samples for light particles
    }

    /**
     * Resets the model.
     * @public
     * @override
     */
    reset() {

      // Properties
      this.heavyAverageSpeedProperty.reset();
      this.lightAverageSpeedProperty.reset();

      // accumulators
      this.dtAccumulator = 0;
      this.numberOfAverageSpeedSamples = 0;
      this.heavyAverageSpeedSum = 0;
      this.lightAverageSpeedSum = 0;

      super.reset();
    }

    /**
     * Steps the model using model time units.
     * @param {number} dt - time delta, in ps
     * @protected
     * @override
     */
    stepModelTime( dt ) {

      super.stepModelTime( dt );

      // compute the average speed for each particle type, smooth the values over an interval
      this.heavyAverageSpeedSum += getAverageSpeed( this.heavyParticles );
      this.lightAverageSpeedSum += getAverageSpeed( this.lightParticles );
      this.numberOfAverageSpeedSamples++;

      this.dtAccumulator += dt;

      if ( this.dtAccumulator >= SAMPLE_PERIOD ) {

        // update the average speed Properties
        this.heavyAverageSpeedProperty.value = this.heavyAverageSpeedSum / this.numberOfAverageSpeedSamples;
        this.lightAverageSpeedProperty.value = this.lightAverageSpeedSum / this.numberOfAverageSpeedSamples;

        // reset the smoothing variables
        this.dtAccumulator = 0;
        this.numberOfAverageSpeedSamples = 0;
        this.heavyAverageSpeedSum = 0;
        this.lightAverageSpeedSum = 0;
      }

      if ( this.heavyParticles.length === 0 ) {
        this.heavyAverageSpeedProperty.value = null;
      }
      if ( this.lightParticles.length === 0 ) {
        this.lightAverageSpeedProperty.value = null;
      }
    }

    /**
     * Gets kinetic energy values for all heavy particles in the container. Used by the Kinetic Energy histogram.
     * @returns {number[]} in AMU * nm^2 / ps^2
     * @public
     */
    getHeavyParticleKineticEnergyValues() {
      const values = [];
      for ( let i = 0; i < this.heavyParticles.length; i++ ) {
        values.push( this.heavyParticles[ i ].kineticEnergy );
      }
      return values;
    }

    /**
     * Gets kinetic energy values for all light particles in the container. Used by the Kinetic Energy histogram.
     * @returns {number[]} in AMU * nm^2 / ps^2
     * @public
     */
    getLightParticleKineticEnergyValues() {
      const values = [];
      for ( let i = 0; i < this.lightParticles.length; i++ ) {
        values.push( this.lightParticles[ i ].kineticEnergy );
      }
      return values;
    }

    /**
     * Gets speed values for all heavy particles in the container. Used by the Speed histogram.
     * @returns {number[]} in nm/ps
     * @public
     */
    getHeavyParticleSpeedValues() {
      const values = [];
      for ( let i = 0; i < this.heavyParticles.length; i++ ) {
        values.push( this.heavyParticles[ i ].velocity.magnitude );
      }
      return values;
    }

    /**
     * Gets speed values for all light particles in the container. Used by the Speed histogram.
     * @returns {number[]} in nm/ps
     * @public
     */
    getLightParticleSpeedValues() {
      const values = [];
      for ( let i = 0; i < this.lightParticles.length; i++ ) {
        values.push( this.lightParticles[ i ].velocity.magnitude );
      }
      return values;
    }
  }

  /**
   * Gets the average speed of a set of particles, in nm/ps.
   * @param {Particle[]} particles
   * @returns {number|null} null if there are no particles
   */
  function getAverageSpeed( particles ) {
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

  return gasProperties.register( 'EnergyModel', EnergyModel );
} );