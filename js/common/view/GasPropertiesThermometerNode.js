// Copyright 2018-2022, University of Colorado Boulder

/**
 * ThermometerNode displays a thermometer, temperature value, and control for selecting temperature units.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import ThermometerNode from '../../../../scenery-phet/js/ThermometerNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import Thermometer from '../model/Thermometer.js';
import TemperatureDisplay from './TemperatureDisplay.js';

class GasPropertiesThermometerNode extends VBox {

  /**
   * @param {Thermometer} thermometer
   * @param {Node} listParent - parent for the combo box list
   * @param {Object} [options]
   */
  constructor( thermometer, listParent, options ) {
    assert && assert( thermometer instanceof Thermometer, `invalid thermometer: ${thermometer}` );
    assert && assert( listParent instanceof Node, `invalid listParent: ${listParent}` );

    options = merge( {

      // superclass options
      spacing: 5,
      align: 'center',

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // temperatureProperty is null when there are no particles in the container.
    // Map null to zero, since ThermometerNode doesn't support null values.
    const temperatureNumberProperty = new DerivedProperty(
      [ thermometer.temperatureKelvinProperty ],
      temperature => ( temperature === null ) ? 0 : temperature, {
        valueType: 'number'
      } );

    const thermometerNode = new ThermometerNode( temperatureNumberProperty, thermometer.range.min, thermometer.range.max, {
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
    const comboBox = new TemperatureDisplay( thermometer, listParent, {
      maxWidth: 4 * thermometerNode.width,
      tandem: options.tandem.createTandem( 'comboBox' )
    } );

    assert && assert( !options.children, 'GasPropertiesThermometerNode sets children' );
    options = merge( {
      children: [ comboBox, thermometerNode ]
    }, options );

    super( options );
  }
}

gasProperties.register( 'GasPropertiesThermometerNode', GasPropertiesThermometerNode );
export default GasPropertiesThermometerNode;