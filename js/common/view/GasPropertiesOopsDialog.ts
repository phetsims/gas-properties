// Copyright 2019-2025, University of Colorado Boulder

/**
 * GasPropertiesOopsDialog is a specialization of OopsDialog, with a custom icon and options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import OopsDialog, { OopsDialogOptions } from '../../../../scenery-phet/js/OopsDialog.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import phetGirlLabCoat_png from '../../../images/phetGirlLabCoat_png.js';
import gasProperties from '../../gasProperties.js';

type SelfOptions = EmptySelfOptions;

type GasPropertiesOopsDialogOptions = SelfOptions & PickRequired<OopsDialogOptions, 'tandem' | 'phetioDocumentation'>;

export default class GasPropertiesOopsDialog extends OopsDialog {

  public constructor( messageStringProperty: ReadOnlyProperty<string>, providedOptions: GasPropertiesOopsDialogOptions ) {

    const options = optionize<GasPropertiesOopsDialogOptions, SelfOptions, OopsDialogOptions>()( {

      // OopsDialogOptions
      iconNode: new Image( phetGirlLabCoat_png, {
        maxHeight: 132 // determined empirically
      } ),
      richTextOptions: {
        font: new PhetFont( 16 )
      },
      phetioFeatured: true // see https://github.com/phetsims/gas-properties/issues/257
    }, providedOptions );

    super( messageStringProperty, options );
  }
}

gasProperties.register( 'GasPropertiesOopsDialog', GasPropertiesOopsDialog );