// Copyright 2018-2022, University of Colorado Boulder

/**
 * GasPropertiesPreferencesNode is the user interface for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, and affect all screens.
 *
 * The Preferences dialog is created on demand by joist, using a PhetioCapsule. So GasPropertiesPreferencesNode must
 * implement dispose, and all elements of GasPropertiesPreferencesNode that have tandems must be disposed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import gasPropertiesStrings from '../../gasPropertiesStrings.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import GasPropertiesPreferences from '../model/GasPropertiesPreferences.js';

class GasPropertiesPreferencesNode extends VBox {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const children = [];

    // Pressure Noise checkbox
    const pressureNoiseCheckbox = new PressureNoiseCheckbox( GasPropertiesPreferences.pressureNoiseProperty, {
      tandem: options.tandem.createTandem( 'pressureNoiseCheckbox' )
    } );
    children.push( pressureNoiseCheckbox );

    assert && assert( !options.children, 'GasPropertiesPreferencesNode sets children' );
    options.children = children;

    super( options );

    // @private
    this.disposeGasPropertiesGlobalOptionsNode = () => {
      children.forEach( child => child.dispose() );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeGasPropertiesGlobalOptionsNode();
    super.dispose();
  }
}

class PressureNoiseCheckbox extends Checkbox {

  constructor( pressureNoiseProperty, options ) {

    options = merge( {}, GasPropertiesConstants.CHECKBOX_OPTIONS, {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const pressureNoiseText = new Text( gasPropertiesStrings.pressureNoise, {
      font: GasPropertiesConstants.CONTROL_FONT,
      maxWidth: 350, // set empirically
      tandem: options.tandem.createTandem( 'pressureNoiseText' ),
      phetioVisiblePropertyInstrumented: false
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

gasProperties.register( 'GasPropertiesPreferencesNode', GasPropertiesPreferencesNode );
export default GasPropertiesPreferencesNode;