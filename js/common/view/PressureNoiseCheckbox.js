// Copyright 2022, University of Colorado Boulder

/**
 * PressureNoiseCheckbox is the checkbox labeled 'Pressure Noise' that appears in the Preferences dialog.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Text } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';

export class PressureNoiseCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} pressureNoiseProperty
   * @param {Object} [options]
   */
  constructor( pressureNoiseProperty, options ) {

    options = merge( {}, GasPropertiesConstants.CHECKBOX_OPTIONS, {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const pressureNoiseText = new Text( GasPropertiesStrings.pressureNoiseStringProperty, {
      font: GasPropertiesConstants.CONTROL_FONT,
      maxWidth: 350, // set empirically
      tandem: options.tandem.createTandem( 'pressureNoiseText' )
    } );

    super( pressureNoiseProperty, pressureNoiseText, options );

    // @private
    this.disposePressureNoiseCheckbox = () => {
      pressureNoiseText.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposePressureNoiseCheckbox();
    super.dispose();
  }
}

gasProperties.register( 'PressureNoiseCheckbox', PressureNoiseCheckbox );