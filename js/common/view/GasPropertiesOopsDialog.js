// Copyright 2019-2020, University of Colorado Boulder

/**
 * GasPropertiesOopsDialog is a specialization of OopsDialog, with a custom icon and options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import phetGirlLabCoat_png from '../../../images/phetGirlLabCoat_png.js';
import gasProperties from '../../gasProperties.js';

class GasPropertiesOopsDialog extends OopsDialog {

  /**
   * @param {string} message
   * @param {Object} [options]
   */
  constructor( message, options ) {

    options = merge( {

      // superclass options
      iconNode: new Image( phetGirlLabCoat_png, {
        maxHeight: 132 // determined empirically
      } ),
      richTextOptions: {
        font: new PhetFont( 16 )
      }
    }, options );

    super( message, options );
  }
}

gasProperties.register( 'GasPropertiesOopsDialog', GasPropertiesOopsDialog );
export default GasPropertiesOopsDialog;