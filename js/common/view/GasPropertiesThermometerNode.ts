// Copyright 2018-2022, University of Colorado Boulder

/**
 * ThermometerNode displays a thermometer, temperature value, and control for selecting temperature units.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ThermometerNode from '../../../../scenery-phet/js/ThermometerNode.js';
import { Node, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import Thermometer from '../model/Thermometer.js';
import TemperatureDisplay from './TemperatureDisplay.js';

type SelfOptions = EmptySelfOptions;

type GasPropertiesThermometerNodeOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class GasPropertiesThermometerNode extends VBox {

  public constructor( thermometer: Thermometer, listboxParent: Node, providedOptions: GasPropertiesThermometerNodeOptions ) {

    const options = optionize<GasPropertiesThermometerNodeOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      spacing: 5,
      align: 'center'
    }, providedOptions );

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
    const comboBox = new TemperatureDisplay( thermometer, listboxParent, {
      maxWidth: 4 * thermometerNode.width,
      tandem: options.tandem.createTandem( 'comboBox' )
    } );

    options.children = [ comboBox, thermometerNode ];

    super( options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'GasPropertiesThermometerNode', GasPropertiesThermometerNode );