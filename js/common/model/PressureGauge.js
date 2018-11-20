// Copyright 2018, University of Colorado Boulder

/**
 * Model of the pressure gauge
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );

  class PressureGauge {

    constructor() {

      // @public TODO units, probably should be DerivedProperty
      this.pressureProperty = new NumberProperty( 0, {
        isValidValue: value => ( value >= 0 )
      } );

      // @public (read-only)
      this.pressureRange = new Range( 0, 1000 ); //TODO values, units
    }

    // @public
    reset() {
      this.pressureProperty.reset();
    }
  }

  return gasProperties.register( 'PressureGauge', PressureGauge );
} );
 