// Copyright 2018, University of Colorado Boulder

/**
 * ThermometerNode, customized for this sim and decorated with a display for the temperature value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const TemperatureComboDisplay = require( 'GAS_PROPERTIES/common/view/TemperatureComboDisplay' );
  const ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  class GasPropertiesThermometerNode extends VBox {

    /**
     * @param {Thermometer} thermometer
     * @param {Node} comboDisplayListParent - parent for the combo box list
     * @param {Object} [options]
     */
    constructor( thermometer, comboDisplayListParent, options ) {

      options = _.extend( {
        spacing: 5,
        align: 'center'
      }, options );

      // ComboBox that displays dynamic temperature for various units, centered above the thermometer
      const comboDisplay = new TemperatureComboDisplay( thermometer, comboDisplayListParent );

      // temperatureProperty is null when there are no particles in the container.
      // Map null to zero, since ThermometerNode doesn't support null values.
      const temperatureNumberProperty = new DerivedProperty( [ thermometer.temperatureKelvinProperty ],
        temperature => ( temperature === null ) ? 0 : temperature );

      const thermometerNode = new ThermometerNode(
        thermometer.range.min, thermometer.range.max, temperatureNumberProperty, {
          backgroundFill: 'white',
          bulbDiameter: 30,
          tubeHeight: 100,
          tubeWidth: 20,
          glassThickness: 3,
          tickSpacing: 6,
          majorTickLength: 10,
          minorTickLength: 6,
          lineWidth: 1
        } );

      options.children = [ comboDisplay, thermometerNode ];

      super( options );
    }
  }

  return gasProperties.register( 'GasPropertiesThermometerNode', GasPropertiesThermometerNode );
} );