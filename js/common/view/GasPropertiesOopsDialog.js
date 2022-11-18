// Copyright 2019-2022, University of Colorado Boulder

/**
 * GasPropertiesOopsDialog is a specialization of OopsDialog, with a custom icon and options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Image } from '../../../../scenery/js/imports.js';
import phetGirlLabCoat_png from '../../../images/phetGirlLabCoat_png.js';
import gasProperties from '../../gasProperties.js';

class GasPropertiesOopsDialog extends OopsDialog {

  /**
   * @param {TReadOnlyProperty.<string>} messageStringProperty
   * @param {Object} [options]
   */
  constructor( messageStringProperty, options ) {

    options = merge( {

      // superclass options
      iconNode: new Image( phetGirlLabCoat_png, {
        maxHeight: 132 // determined empirically
      } ),
      richTextOptions: {
        font: new PhetFont( 16 )
      }
    }, options );

    super( messageStringProperty, options );
  }
}

gasProperties.register( 'GasPropertiesOopsDialog', GasPropertiesOopsDialog );
export default GasPropertiesOopsDialog;