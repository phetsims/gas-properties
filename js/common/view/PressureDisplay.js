// Copyright 2018-2019, University of Colorado Boulder

/**
 * PressureDisplay displays the pressure value, with the ability to switch units via a combo box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ComboBoxDisplay = require( 'SCENERY_PHET/ComboBoxDisplay' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PressureGauge = require( 'GAS_PROPERTIES/common/model/PressureGauge' );
  const Range = require( 'DOT/Range' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const atmospheresString = require( 'string!GAS_PROPERTIES/atmospheres' );
  const kilopascalsString = require( 'string!GAS_PROPERTIES/kilopascals' );

  // constants
  const NUMBER_DISPLAY_RANGE = new Range( 0, GasPropertiesQueryParameters.maxPressure );

  class PressureDisplay extends ComboBoxDisplay {

    /**
     * @param {PressureGauge} pressureGauge
     * @param {Node} listParent - parent for ComboBox list
     * @param {Object} [options]
     */
    constructor( pressureGauge, listParent, options ) {
      assert && assert( pressureGauge instanceof PressureGauge, `invalid pressureGauge: ${pressureGauge}` );
      assert && assert( listParent instanceof Node, `invalid listParent: ${listParent}` );

      options = merge( {
        tandem: Tandem.REQUIRED
      }, GasPropertiesConstants.COMBO_BOX_DISPLAY_OPTIONS, options );

      const items = [
        {
          choice: PressureGauge.Units.ATMOSPHERES,
          numberProperty: pressureGauge.pressureAtmospheresProperty,
          range: NUMBER_DISPLAY_RANGE,
          units: atmospheresString,
          numberDisplayOptions: {
            decimalPlaces: 1
          }
        },
        {
          choice: PressureGauge.Units.KILOPASCALS,
          numberProperty: pressureGauge.pressureKilopascalsProperty,
          range: NUMBER_DISPLAY_RANGE,
          units: kilopascalsString,
          numberDisplayOptions: {
            decimalPlaces: 0
          }
        }
      ];

      super( items, pressureGauge.unitsProperty, listParent, options );
    }
  }

  return gasProperties.register( 'PressureDisplay', PressureDisplay );
} );