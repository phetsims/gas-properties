// Copyright 2018-2024, University of Colorado Boulder

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
import TemperatureDisplay from './TemperatureDisplay.js';
import TemperatureModel from '../model/TemperatureModel.js';

type SelfOptions = EmptySelfOptions;

type GasPropertiesThermometerNodeOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class GasPropertiesThermometerNode extends VBox {

  public constructor( temperatureModel: TemperatureModel, listboxParent: Node, providedOptions: GasPropertiesThermometerNodeOptions ) {

    const options = optionize<GasPropertiesThermometerNodeOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      isDisposable: false,
      spacing: 5,
      align: 'center',
      phetioFeatured: true
    }, providedOptions );

    // temperatureKelvinProperty is null when there are no particles in the container.
    // Map null to zero, since ThermometerNode doesn't support null values.
    const privateTemperatureProperty = new DerivedProperty(
      [ temperatureModel.temperatureKelvinProperty ],
      temperature => ( temperature === null ) ? 0 : temperature, {
        valueType: 'number'
      } );

    const thermometerNode = new ThermometerNode( privateTemperatureProperty,
      temperatureModel.temperatureKelvinRange.min, temperatureModel.temperatureKelvinRange.max, {
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
    const comboBox = new TemperatureDisplay( temperatureModel, listboxParent, {
      maxWidth: 4 * thermometerNode.width,
      tandem: options.tandem.createTandem( 'comboBox' )
    } );

    options.children = [ comboBox, thermometerNode ];

    super( options );

    this.addLinkedElement( temperatureModel );
  }
}

gasProperties.register( 'GasPropertiesThermometerNode', GasPropertiesThermometerNode );