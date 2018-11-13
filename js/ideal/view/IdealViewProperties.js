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
  const StringProperty = require( 'AXON/StringProperty' );

  // constants
  //TODO use Enumeration when https://github.com/phetsims/phet-core/issues/42 is resolved
  const PARTICLE_TYPE_VALUES = [ 'heavy', 'light' ];
  const TEMPERATURE_UNITS_VALUES = [ 'kelvin', 'celsius' ];

  class IdealViewProperties {

    constructor() {

      // @public the particle type that will be dispensed by the bicycle pump
      this.particleTypeProperty = new StringProperty( 'heavy', {
        validValues: PARTICLE_TYPE_VALUES
      } );

      // @public whether dimensional arrows are visible for the width of the container
      this.sizeVisibleProperty = new BooleanProperty( false );

      // @public whether the stopwatch is visible
      this.stopwatchVisibleProperty = new BooleanProperty( false );

      // @public whether the collision counter is visible
      this.collisionCounterVisibleProperty = new BooleanProperty( false );

      // @public whether the 'Particles Counts' accordion box is expaned
      this.particleCountsExpandedProperty = new BooleanProperty( true );

      // @public temperature units displayed by the thermometer
      this.temperatureUnitsProperty = new StringProperty( 'kelvin', {
        validValues: TEMPERATURE_UNITS_VALUES
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