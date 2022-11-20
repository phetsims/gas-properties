// Copyright 2022, University of Colorado Boulder

/**
 * PressureNoiseCheckbox is the checkbox labeled 'Pressure Noise' that appears in the Preferences dialog.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Text } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';

type SelfOptions = EmptySelfOptions;

type PressureNoiseCheckboxOptions = SelfOptions & PickRequired<CheckboxOptions, 'tandem'>;

export class PressureNoiseCheckbox extends Checkbox {

  private readonly disposePressureNoiseCheckbox: () => void;

  public constructor( pressureNoiseProperty: Property<boolean>, providedOptions: PressureNoiseCheckboxOptions ) {

    const options = providedOptions;

    const pressureNoiseText = new Text( GasPropertiesStrings.pressureNoiseStringProperty, {
      font: GasPropertiesConstants.CONTROL_FONT,
      maxWidth: 350, // set empirically
      tandem: options.tandem.createTandem( 'pressureNoiseText' )
    } );

    super( pressureNoiseProperty, pressureNoiseText, options );

    this.disposePressureNoiseCheckbox = () => {
      pressureNoiseText.dispose();
    };
  }

  public override dispose(): void {
    this.disposePressureNoiseCheckbox();
    super.dispose();
  }
}

gasProperties.register( 'PressureNoiseCheckbox', PressureNoiseCheckbox );