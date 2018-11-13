// Copyright 2018, University of Colorado Boulder

/**
 * ThermometerNode, customized for this sim and decorated with a display for the temperature value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );

  class GasPropertiesThermometerNode extends ThermometerNode {

    /**
     * @param {NumberProperty} temperatureProperty
     * @param {Range} thermometerRange
     * @param {Object} [options]
     */
    constructor( temperatureProperty, thermometerRange, options ) {

      options = _.extend( {
        backgroundFill: 'white',
        bulbDiameter: 30,
        tubeHeight: 100,
        tubeWidth: 20,
        glassThickness: 3,
        tickSpacing: 6,
        majorTickLength: 10,
        minorTickLength: 6,
        lineWidth: 1
      }, options );

      super( thermometerRange.min, thermometerRange.max, temperatureProperty, options );

      //TODO add temperature value display
      //TODO add temperature units combo box
    }
  }

  return gasProperties.register( 'GasPropertiesThermometerNode', GasPropertiesThermometerNode );
} );