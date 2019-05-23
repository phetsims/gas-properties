// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model for the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesModel = require( 'GAS_PROPERTIES/common/model/GasPropertiesModel' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const HoldConstantEnum = require( 'GAS_PROPERTIES/common/model/HoldConstantEnum' );
  const Property = require( 'AXON/Property' );
  const Tandem = require( 'TANDEM/Tandem' );

  // constants
  const AVERAGE_SPEED_PROPERTY_OPTIONS = {
    isValidValue: value => ( value === null || ( typeof value === 'number' && value >= 0 ) ),
    units: 'pm/ps'
  };
  const SAMPLE_PERIOD = GasPropertiesQueryParameters.histogramSamplePeriod; // ps

  class EnergyModel extends GasPropertiesModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( tandem, {
        holdConstant: HoldConstantEnum.VOLUME,
        hasCollisionCounter: false
      } );

      // In case clients attempt to exercise this feature of the base class
      this.holdConstantProperty.lazyLink( holdConstant => {
        throw new Error( 'holdConstant is fixed in this screen' );
      } );

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
     * Resets the model.
     * @public
     * @override
     */
    reset() {
      super.reset();

      // Properties
      this.heavyAverageSpeedProperty.reset();
      this.lightAverageSpeedProperty.reset();

      // accumulators
      this.dtAccumulator = 0;
      this.numberOfAverageSpeedSamples = 0;
      this.heavyAverageSpeedSum = 0;
      this.lightAverageSpeedSum = 0;
    }

    /**
     * Steps the model using model time units.
     * @param {number} dt - time delta, in ps
     * @protected
     * @override
     */
    stepModelTime( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

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
     * Gets kinetic energy values for all heavy particles in the container, in AMU * pm^2 / ps^2.
     * Used by the Kinetic Energy histogram.
     * @returns {number[]}
     * @public
     */
    getHeavyParticleKineticEnergyValues() {
      return getKineticEnergyValues( this.heavyParticles );
    }

    /**
     * Gets kinetic energy values for all light particles in the container, in AMU * pm^2 / ps^2.
     * Used by the Kinetic Energy histogram.
     * @returns {number[]}
     * @public
     */
    getLightParticleKineticEnergyValues() {
      return getKineticEnergyValues( this.lightParticles );
    }

    /**
     * Gets speed values for all heavy particles in the container, in pm/ps. Used by the Speed histogram.
     * @returns {number[]}
     * @public
     */
    getHeavyParticleSpeedValues() {
      return getSpeedValues( this.heavyParticles );
    }

    /**
     * Gets speed values for all light particles in the container, in pm/ps. Used by the Speed histogram.
     * @returns {number[]}
     * @public
     */
    getLightParticleSpeedValues() {
      return getSpeedValues( this.lightParticles );
    }
  }

  /**
   * Gets the average speed for a set of particles, in pm/ps.
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

  /**
   * Gets the speed values for a set of particles, in pm/ps.
   * @param {Particle[]} particles
   * @returns {number[]}
   */
  function getSpeedValues( particles ) {
    const values = [];
    for ( let i = 0; i < particles.length; i++ ) {
      values.push( particles[ i ].velocity.magnitude );
    }
    return values;
  }

  /**
   * Gets the kinetic energy values for a set of particles, in in AMU * pm^2 / ps^2.
   * @param {Particle[]} particles
   * @returns {number[]}
   */
  function getKineticEnergyValues( particles ) {
    const values = [];
    for ( let i = 0; i < particles.length; i++ ) {
      values.push( particles[ i ].getKineticEnergy() );
    }
    return values;
  }

  return gasProperties.register( 'EnergyModel', EnergyModel );
} );