// Copyright 2018-2022, University of Colorado Boulder

/**
 * TemperatureDisplay displays the temperature value, with the ability to switch units via a combo box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import ComboBoxDisplay, { ComboBoxDisplayItem, ComboBoxDisplayOptions } from '../../../../scenery-phet/js/ComboBoxDisplay.js';
import { Node } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import Thermometer from '../model/Thermometer.js';
import { TemperatureUnits } from '../model/TemperatureUnits.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { EmptySelfOptions, optionize3 } from '../../../../phet-core/js/optionize.js';

// constants
const NUMBER_DISPLAY_RANGE = new Range( -99999, 99999 ); // determines how wide items in the ComboBoxDisplay will be

type SelfOptions = EmptySelfOptions;

type TemperatureDisplayOptions = SelfOptions &
  PickOptional<ComboBoxDisplayOptions, 'maxWidth'> &
  PickRequired<ComboBoxDisplayOptions, 'tandem'>;

export default class TemperatureDisplay extends ComboBoxDisplay<TemperatureUnits> {

  public constructor( thermometer: Thermometer, listboxParent: Node, providedOptions: TemperatureDisplayOptions ) {

    const options = optionize3<TemperatureDisplayOptions, SelfOptions, ComboBoxDisplayOptions>()(
      {}, GasPropertiesConstants.COMBO_BOX_DISPLAY_OPTIONS, providedOptions );

    const items: ComboBoxDisplayItem<TemperatureUnits>[] = [
      {
        choice: 'kelvin',
        tandemName: `kelvin${ComboBoxDisplay.ITEM_TANDEM_NAME_SUFFIX}`,
        numberProperty: thermometer.temperatureKelvinProperty,
        range: NUMBER_DISPLAY_RANGE,
        units: GasPropertiesStrings.kelvinStringProperty
      },
      {
        choice: 'celsius',
        tandemName: `celsius${ComboBoxDisplay.ITEM_TANDEM_NAME_SUFFIX}`,
        numberProperty: thermometer.temperatureCelsiusProperty,
        range: NUMBER_DISPLAY_RANGE,
        units: GasPropertiesStrings.degreesCelsiusStringProperty
      }
    ];

    super( thermometer.unitsProperty, items, listboxParent, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'TemperatureDisplay', TemperatureDisplay );