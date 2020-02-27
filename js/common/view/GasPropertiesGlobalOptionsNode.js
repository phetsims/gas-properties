// Copyright 2018-2019, University of Colorado Boulder

/**
 * GasPropertiesGlobalOptionsNode is the user interface for global options, accessed via PhET > Options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ProjectorModeCheckbox from '../../../../joist/js/ProjectorModeCheckbox.js';
import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasPropertiesStrings from '../../gas-properties-strings.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColorProfile from '../GasPropertiesColorProfile.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import GasPropertiesGlobalOptions from '../GasPropertiesGlobalOptions.js';

const pressureNoiseString = gasPropertiesStrings.pressureNoise;

// constants
const CHECKBOX_TEXT_MAX_WIDTH = 350;

class GasPropertiesGlobalOptionsNode extends VBox {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      hasPressureNoiseCheckbox: true, // whether to include the 'Pressure Noise' checkbox

      // superclass options
      spacing: 12,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const children = [];

    // Projector Mode checkbox
    const projectorModeCheckbox = new ProjectorModeCheckbox( GasPropertiesColorProfile,
      merge( {}, GasPropertiesConstants.CHECKBOX_OPTIONS, {
        font: GasPropertiesConstants.CONTROL_FONT,
        maxTextWidth: CHECKBOX_TEXT_MAX_WIDTH,
        tandem: options.tandem.createTandem( 'projectorModeCheckbox' )
      } ) );
    children.push( projectorModeCheckbox );

    // Pressure Noise checkbox
    if ( options.hasPressureNoiseCheckbox ) {
      const pressureNoiseCheckbox = new Checkbox(
        new Text( pressureNoiseString, {
          font: GasPropertiesConstants.CONTROL_FONT,
          maxWidth: CHECKBOX_TEXT_MAX_WIDTH
        } ),
        GasPropertiesGlobalOptions.pressureNoiseProperty,
        merge( {}, GasPropertiesConstants.CHECKBOX_OPTIONS, {
          tandem: options.tandem.createTandem( 'pressureNoiseCheckbox' )
        } )
      );
      children.push( pressureNoiseCheckbox );
    }

    assert && assert( !options.children, 'GasPropertiesGlobalOptionsNode sets children' );
    options.children = children;

    super( options );
  }
}

gasProperties.register( 'GasPropertiesGlobalOptionsNode', GasPropertiesGlobalOptionsNode );
export default GasPropertiesGlobalOptionsNode;