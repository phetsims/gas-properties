// Copyright 2018, University of Colorado Boulder

/**
 * Model for the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Container = require( 'GAS_PROPERTIES/common/model/Container' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const StringProperty = require( 'AXON/StringProperty' );

  // constants
  const HOLD_CONSTANT_VALUES = [
    'nothing',
    'volume',
    'temperature',
    'pressureT', // change temperature (T) to maintain constant pressure
    'pressureV' // change volume (V) to maintain constant pressure
  ];

  class IdealModel {

    constructor() {

      // @public is the sim playing?
      this.isPlayingProperty = new BooleanProperty( true );

      // @public the quantity to hold constant
      this.holdConstantProperty = new StringProperty( 'nothing', {
        validValues: HOLD_CONSTANT_VALUES
      } );

      // @public the number of heavy particles in the container
      this.numberOfHeavyParticlesProperty = new NumberProperty( GasPropertiesConstants.HEAVY_PARTICLES_RANGE.defaultValue, {
        numberType: 'Integer',
        range: GasPropertiesConstants.HEAVY_PARTICLES_RANGE
      } );

      // @public the number of light particles in the container
      this.numberOfLightParticlesProperty = new NumberProperty( GasPropertiesConstants.LIGHT_PARTICLES_RANGE.defaultValue, {
        numberType: 'Integer',
        range: GasPropertiesConstants.LIGHT_PARTICLES_RANGE
      } );

      // @public the amount to heat (positive value) or cool (negative value) the contents of the container
      this.heatCoolAmountProperty = new NumberProperty( 0, {
        range: new Range( -1, 1 )
      } );

      // @public width of the container, in nm
      this.container = new Container();
    }

    // @public resets the model
    reset() {
      this.isPlayingProperty.reset();
      this.holdConstantProperty.reset();
      this.numberOfHeavyParticlesProperty.reset();
      this.numberOfLightParticlesProperty.reset();
      this.container.reset();
    }

    // @public
    step( dt ) {
      if ( this.isPlayingProperty.value ) {
        //TODO
      }
    }
  }

  return gasProperties.register( 'IdealModel', IdealModel );
} );