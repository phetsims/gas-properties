// Copyright 2018, University of Colorado Boulder

/**
 * Combo box for choosing dynamic pressure values in specific units.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ComboDisplay = require( 'GAS_PROPERTIES/common/view/ComboDisplay' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const PressureUnitsEnum = require( 'GAS_PROPERTIES/common/model/PressureUnitsEnum' );
  const Range = require( 'DOT/Range' );

  // strings
  const atmospheresString = require( 'string!GAS_PROPERTIES/atmospheres' );
  const kilopascalsString = require( 'string!GAS_PROPERTIES/kilopascals' );

  // constants
  const NUMBER_DISPLAY_RANGE = new Range( 0, 99 ); // determines how wide items in the ComboDisplay will be

  class PressureComboDisplay extends ComboDisplay {

    /**
     * @param {PressureGauge} pressureGauge
     * @param {Node} listParent - parent for ComboBox list
     * @param {Object} [options]
     */
    constructor( pressureGauge, listParent, options ) {

      const items = [
        {
          choice: PressureUnitsEnum.KILOPASCALS,
          numberProperty: pressureGauge.pressureKilopascalsProperty,
          range: NUMBER_DISPLAY_RANGE,
          units: kilopascalsString,
          numberDisplayOptions: {
            decimalPlaces: 1
          }
        },
        {
          choice: PressureUnitsEnum.ATMOSPHERES,
          numberProperty: pressureGauge.pressureAtmospheresProperty,
          range: NUMBER_DISPLAY_RANGE,
          units: atmospheresString,
          numberDisplayOptions: {
            decimalPlaces: 2
          }
        }
      ];

      super( items, pressureGauge.unitsProperty, listParent, options );
    }
  }

  return gasProperties.register( 'PressureComboDisplay', PressureComboDisplay );
} );