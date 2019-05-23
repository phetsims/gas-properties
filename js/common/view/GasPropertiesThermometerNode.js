// Copyright 2018-2019, University of Colorado Boulder

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
  const Node = require( 'SCENERY/nodes/Node' );
  const TemperatureDisplay = require( 'GAS_PROPERTIES/common/view/TemperatureDisplay' );
  const Thermometer = require( 'GAS_PROPERTIES/common/model/Thermometer' );
  const ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  class GasPropertiesThermometerNode extends VBox {

    /**
     * @param {Thermometer} thermometer
     * @param {Node} listParent - parent for the combo box list
     * @param {Object} [options]
     */
    constructor( thermometer, listParent, options ) {
      assert && assert( thermometer instanceof Thermometer, `invalid thermometer: ${thermometer}` );
      assert && assert( listParent instanceof Node, `invalid listParent: ${listParent}` );

      options = _.extend( {
        spacing: 5,
        align: 'center'
      }, options );

      // temperatureProperty is null when there are no particles in the container.
      // Map null to zero, since ThermometerNode doesn't support null values.
      const temperatureNumberProperty = new DerivedProperty(
        [ thermometer.temperatureKelvinProperty ],
        temperature => ( temperature === null ) ? 0 : temperature, {
          valueType: 'number'
        } );

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

      // ComboBox that displays dynamic temperature for various units, centered above the thermometer
      const temperatureDisplay = new TemperatureDisplay( thermometer, listParent, {
        maxWidth: 4 * thermometerNode.width
      } );

      assert && assert( !options.children, 'GasPropertiesThermometerNode sets children' );
      options = _.extend( {
        children: [ temperatureDisplay, thermometerNode ]
      }, options );

      super( options );
    }
  }

  return gasProperties.register( 'GasPropertiesThermometerNode', GasPropertiesThermometerNode );
} );