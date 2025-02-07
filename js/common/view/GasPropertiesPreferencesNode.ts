// Copyright 2022-2024, University of Colorado Boulder

/**
 * GasPropertiesPreferencesNode is the user interface for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, and affect all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesPreferences from '../model/GasPropertiesPreferences.js';
import PressureNoiseControl from './PressureNoiseControl.js';

export default class GasPropertiesPreferencesNode extends VBox {

  public constructor( tandem: Tandem ) {

    // Pressure Noise control
    const pressureNoiseControl = new PressureNoiseControl( GasPropertiesPreferences.pressureNoiseProperty,
      tandem.createTandem( 'pressureNoiseControl' ) );

    super( {
      isDisposable: false,
      children: [ pressureNoiseControl ],
      tandem: tandem
    } );
  }
}

gasProperties.register( 'GasPropertiesPreferencesNode', GasPropertiesPreferencesNode );