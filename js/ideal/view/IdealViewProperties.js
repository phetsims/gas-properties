// Copyright 2018, University of Colorado Boulder

/**
 * Properties that are specific to the view in the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const ParticleTypeEnum = require( 'GAS_PROPERTIES/common/model/ParticleTypeEnum' );
  const Property = require( 'AXON/Property' );
  const TemperatureUnitsEnum = require( 'GAS_PROPERTIES/common/model/TemperatureUnitsEnum' );

  class IdealViewProperties {

    constructor() {

      // @public the particle type that will be dispensed by the bicycle pump
      this.particleTypeProperty = new Property( ParticleTypeEnum.HEAVY, {
        isValidValue: value => ParticleTypeEnum.includes( value )
      } );

      // @public whether dimensional arrows are visible for the width of the container
      this.sizeVisibleProperty = new BooleanProperty( false );

      // @public whether the stopwatch is visible
      this.stopwatchVisibleProperty = new BooleanProperty( false );

      // @public whether the 'Particles Counts' accordion box is expanded
      this.particleCountsExpandedProperty = new BooleanProperty( true );

      // @public temperature units displayed by the thermometer
      this.temperatureUnitsProperty = new Property( TemperatureUnitsEnum.KELVIN, {
        isValidValue: value => TemperatureUnitsEnum.includes( value )
      } );
    }

    reset() {
      this.particleTypeProperty.reset();
      this.sizeVisibleProperty.reset();
      this.stopwatchVisibleProperty.reset();
      this.collisionCounterVisibleProperty.reset();
      this.particleCountsExpandedProperty.reset();
      this.temperatureUnitsProperty.reset();
    }
  }

  return gasProperties.register( 'IdealViewProperties', IdealViewProperties );
} );