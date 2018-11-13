// Copyright 2018, University of Colorado Boulder

/**
 * Combo box that shows temperature in the container in Kelvin or Celsius.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ComboBox = require( 'SUN/ComboBox' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Util = require( 'DOT/Util' );

  // strings
  var celsiusString = require( 'string!GAS_PROPERTIES/celsius' );
  var kelvinString = require( 'string!GAS_PROPERTIES/kelvin' );
  var temperatureUnitsString = require( 'string!GAS_PROPERTIES/temperatureUnits' );

  // constants
  var FONT = new PhetFont( 12 );
  var MAX_TEMPERATURE = 9999;
  var MAX_TEMPERATURE_KELVIN = StringUtils.fillIn( temperatureUnitsString, {
    temperature: MAX_TEMPERATURE,
    units: kelvinString
  } );
  var MAX_TEMPERATURE_CELSIUS = StringUtils.fillIn( temperatureUnitsString, {
    temperature: MAX_TEMPERATURE,
    units: celsiusString
  } );

  class TemperatureComboBox extends ComboBox {

    /**
     * @param {NumberProperty} temperatureProperty
     * @param {StringProperty} temperatureUnitsProperty
     * @param {Node} listParent - parent for the combo box list
     * @param {Object} [options]
     */
    constructor( temperatureProperty, temperatureUnitsProperty, listParent, options ) {

      options = _.extend( {
        buttonXMargin: 5,
        buttonYMargin: 2,
        buttonCornerRadius: 5,
        itemXMargin: 2,
        itemYMargin: 2,
        buttonLineWidth: 0.4
      }, options );

      //TODO use NumberDisplay with align:'right'
      // Nodes for combo box items
      const kelvinNode = new Text( MAX_TEMPERATURE_KELVIN, { font: FONT } );
      const celsiusNode = new Text( MAX_TEMPERATURE_CELSIUS, { font: FONT } );

      // Set the same maxWidth for both items, since we'll be changing their text.
      const maxWidth = Math.max( kelvinNode.width, celsiusNode.width );
      kelvinNode.maxWidth = maxWidth;
      celsiusNode.maxWidth = maxWidth;

      const items = [
        ComboBox.createItem( kelvinNode, 'kelvin' ),
        ComboBox.createItem( celsiusNode, 'celsius' )
      ];

      super( items, temperatureUnitsProperty, listParent, options );

      // update temperature in K
      temperatureProperty.link( temperature => {
        kelvinNode.text = StringUtils.fillIn( temperatureUnitsString, {
          temperature: Util.roundSymmetric( temperature ),
          units: kelvinString
        } );
      } );

      // update temperature in C
      const temperatureCelsiusProperty = new DerivedProperty( [ temperatureProperty ],
        temperature => temperature - 273.15 );
      temperatureCelsiusProperty.link( temperature => {
        celsiusNode.text = StringUtils.fillIn( temperatureUnitsString, {
          temperature: Util.roundSymmetric( temperature ),
          units: celsiusString
        } );
      } );
    }
  }

  return gasProperties.register( 'TemperatureComboBox', TemperatureComboBox );
} );