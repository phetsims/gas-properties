// Copyright 2018, University of Colorado Boulder

/**
 * Combo box for choosing pressure units, and displaying pressure values in those units.
 * A combo box typically displays a static list of choices, and is not recommended for displaying
 * dynamic values. But here we are.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ComboBox = require( 'SUN/ComboBox' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PressureUnitsEnum = require( 'GAS_PROPERTIES/common/model/PressureUnitsEnum' );
  const Range = require( 'DOT/Range' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  
  // strings
  const atmospheresString = require( 'string!GAS_PROPERTIES/atmospheres' );
  const kilopascalsString = require( 'string!GAS_PROPERTIES/kilopascals' );
  const pressureUnitsString = require( 'string!GAS_PROPERTIES/pressureUnits' );

  // constants
  const NUMBER_DISPLAY_RANGE = new Range( -9999, 9999 );
  const NUMBER_DISPLAY_OPTIONS = {
    backgroundStroke: null,
    font: new PhetFont( 14 ),
    align: 'right',
    xMargin: 0,
    yMargin: 0
  };

  class PressureComboBox extends ComboBox {

    /**
     * @param {PressureGauge} pressureGauge
     * @param {Node} listParent - parent for the combo box list
     * @param {Object} [options]
     */
    constructor( pressureGauge, listParent, options ) {

      options = _.extend( {
        buttonXMargin: 5,
        buttonYMargin: 2,
        buttonCornerRadius: 5,
        itemXMargin: 2,
        itemYMargin: 2,
        buttonLineWidth: 0.4
      }, options );

      // displays the pressure in kilopascals (kPa)
      const kilopascalsNode = new NumberDisplay( pressureGauge.pressureKilopascalsProperty, NUMBER_DISPLAY_RANGE,
        _.extend( {}, NUMBER_DISPLAY_OPTIONS, {
          decimalPlaces: 1,
          valuePattern: StringUtils.fillIn( pressureUnitsString, {
            pressure: '{0}',
            units: kilopascalsString
          } )
        } ) );

      // displays the pressure in atmospheres (atm)
      const atmospheresNode = new NumberDisplay( pressureGauge.pressureAtmospheresProperty, NUMBER_DISPLAY_RANGE,
        _.extend( {}, NUMBER_DISPLAY_OPTIONS, {
          decimalPlaces: 2,
          valuePattern: StringUtils.fillIn( pressureUnitsString, {
            pressure: '{0}',
            units: atmospheresString
          } )
        } ) );

      // Set the same maxWidth for both item Nodes, since their values will change dynamically. Values outside of
      // NUMBER_DISPLAY_RANGE will cause the NumberDisplay instances (and hence the visible values) to be scaled down.
      const maxWidth = Math.max( kilopascalsNode.width, atmospheresNode.width );
      kilopascalsNode.maxWidth = maxWidth;
      atmospheresNode.maxWidth = maxWidth;

      // Items to be displayed in the combo box
      const items = [
        ComboBox.createItem( kilopascalsNode, PressureUnitsEnum.KILOPASCALS ),
        ComboBox.createItem( atmospheresNode, PressureUnitsEnum.ATMOSPHERES )
      ];

      super( items, pressureGauge.unitsProperty, listParent, options );
    }
  }

  return gasProperties.register( 'PressureComboBox', PressureComboBox );
} );