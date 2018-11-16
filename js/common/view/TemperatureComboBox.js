// Copyright 2018, University of Colorado Boulder

//TODO show '-' for temperature value when container is empty, e.g. '- K'
/**
 * Combo box for choosing temperature units, and displaying temperature values in those units.
 * A combo box typically displays a static list of choices, and is not recommended for displaying
 * dynamic values. But here we are.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ComboBox = require( 'SUN/ComboBox' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Range = require( 'DOT/Range' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const TemperatureUnitsEnum = require( 'GAS_PROPERTIES/common/model/TemperatureUnitsEnum' );

  // strings
  var celsiusString = require( 'string!GAS_PROPERTIES/celsius' );
  var kelvinString = require( 'string!GAS_PROPERTIES/kelvin' );
  var temperatureUnitsString = require( 'string!GAS_PROPERTIES/temperatureUnits' );

  // constants
  const NUMBER_DISPLAY_RANGE = new Range( -9999, 9999 );
  const NUMBER_DISPLAY_OPTIONS = {
    backgroundStroke: null,
    font: new PhetFont( 14 ),
    align: 'right',
    xMargin: 0,
    yMargin: 0
  };

  class TemperatureComboBox extends ComboBox {

    /**
     * @param {NumberProperty} temperatureKelvinProperty
     * @param {StringProperty} temperatureUnitsProperty
     * @param {Node} listParent - parent for the combo box list
     * @param {Object} [options]
     */
    constructor( temperatureKelvinProperty, temperatureUnitsProperty, listParent, options ) {

      options = _.extend( {
        buttonXMargin: 5,
        buttonYMargin: 2,
        buttonCornerRadius: 5,
        itemXMargin: 2,
        itemYMargin: 2,
        buttonLineWidth: 0.4
      }, options );

      // displays the temperature in K
      const kelvinNode = new NumberDisplay( temperatureKelvinProperty, NUMBER_DISPLAY_RANGE,
        _.extend( {}, NUMBER_DISPLAY_OPTIONS, {
          valuePattern: StringUtils.fillIn( temperatureUnitsString, {
            temperature: '{0}',
            units: kelvinString
          } )
        } ) );

      // temperature in C
      const temperatureCelsiusProperty = new DerivedProperty( [ temperatureKelvinProperty ],
        temperature => temperature - 273.15 );

      // displays the temperature in C
      const celsiusNode = new NumberDisplay( temperatureCelsiusProperty, NUMBER_DISPLAY_RANGE,
        _.extend( {}, NUMBER_DISPLAY_OPTIONS, {
          valuePattern: StringUtils.fillIn( temperatureUnitsString, {
            temperature: '{0}',
            units: celsiusString
          } )
        } ) );

      // Set the same maxWidth for both item Nodes, since their values will change dynamically. Values outside of
      // NUMBER_DISPLAY_RANGE will cause the NumberDisplay instances (and hence the visible values) to be scaled down.
      const maxWidth = Math.max( kelvinNode.width, celsiusNode.width );
      kelvinNode.maxWidth = maxWidth;
      celsiusNode.maxWidth = maxWidth;

      // Items to be displayed in the combo box
      const items = [
        ComboBox.createItem( kelvinNode, TemperatureUnitsEnum.KELVIN ),
        ComboBox.createItem( celsiusNode, TemperatureUnitsEnum.CELSIUS )
      ];

      super( items, temperatureUnitsProperty, listParent, options );
    }
  }

  return gasProperties.register( 'TemperatureComboBox', TemperatureComboBox );
} );