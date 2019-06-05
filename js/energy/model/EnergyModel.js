// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model for the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AverageSpeedModel = require( 'GAS_PROPERTIES/energy/model/AverageSpeedModel' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesModel = require( 'GAS_PROPERTIES/common/model/GasPropertiesModel' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const HistogramsModel = require( 'GAS_PROPERTIES/energy/model/HistogramsModel' );
  const HoldConstant = require( 'GAS_PROPERTIES/common/model/HoldConstant' );
  const Tandem = require( 'TANDEM/Tandem' );

  // constants
  const SAMPLE_PERIOD = GasPropertiesQueryParameters.histogramSamplePeriod; // ps

  class EnergyModel extends GasPropertiesModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      super( tandem, {
        holdConstant: HoldConstant.VOLUME,
        hasCollisionCounter: false
      } );

      // In case clients attempt to use this feature of the base class
      this.holdConstantProperty.lazyLink( holdConstant => {
        throw new Error( 'holdConstant is fixed in the Energy screen' );
      } );

      // In case clients attempt to use this feature of the base class
      this.container.widthProperty.lazyLink( width => {
        throw new Error( 'container width is fixed in the Energy screen' );
      } );

      // @public (read-only)
      this.histogramsModel = new HistogramsModel( this, SAMPLE_PERIOD );

      // @public
      this.averageSpeedModel = new AverageSpeedModel( this, SAMPLE_PERIOD );
    }

    /**
     * Resets the model.
     * @public
     * @override
     */
    reset() {
      super.reset();
      this.averageSpeedModel.reset();
      this.histogramsModel.reset();
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
      this.averageSpeedModel.step( dt );
      this.histogramsModel.step( dt );
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
  }

  /**
   * Gets the speed values for a set of particles, in pm/ps.
   * @param {Particle[]} particles
   * @returns {number[]}
   */
  function getSpeedValues( particles ) {
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );

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
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );

    const values = [];
    for ( let i = 0; i < particles.length; i++ ) {
      values.push( particles[ i ].getKineticEnergy() );
    }
    return values;
  }

  return gasProperties.register( 'EnergyModel', EnergyModel );
} );