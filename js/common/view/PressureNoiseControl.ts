// Copyright 2022-2024, University of Colorado Boulder

/**
 * PressureNoiseControl is the checkbox labeled 'Pressure Noise' that appears in the Preferences dialog.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ToggleSwitch, { ToggleSwitchOptions } from '../../../../sun/js/ToggleSwitch.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';

export default class PressureNoiseControl extends PreferencesControl {

  public constructor( pressureNoiseProperty: Property<boolean>, tandem: Tandem ) {

    const labelText = new Text( GasPropertiesStrings.pressureNoiseStringProperty, {
      font: new PhetFont( {
        size: 16,
        weight: 'bold'
      } ),
      maxWidth: 200
    } );

    const toggleSwitch = new ToggleSwitch( pressureNoiseProperty, false, true,
      combineOptions<ToggleSwitchOptions>( {}, PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS, {
        tandem: tandem.createTandem( 'toggleSwitch' ),
        phetioVisiblePropertyInstrumented: false
      } ) );

    const descriptionText = new RichText( GasPropertiesStrings.pressureNoiseDescriptionStringProperty, {
      lineWrap: 550,
      maxHeight: 50,
      font: new PhetFont( 16 )
    } );

    super( {
      isDisposable: false,
      labelNode: labelText,
      controlNode: toggleSwitch,
      descriptionNode: descriptionText,
      labelSpacing: 20,
      tandem: tandem,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );
  }
}

gasProperties.register( 'PressureNoiseControl', PressureNoiseControl );