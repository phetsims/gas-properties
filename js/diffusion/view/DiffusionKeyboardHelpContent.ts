// Copyright 2024, University of Colorado Boulder

//TODO https://github.com/phetsims/gas-properties/issues/215 Finish this, then factor out duplication.
/**
 * DiffusionKeyboardHelpContent is the keyboard help for the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import gasProperties from '../../gasProperties.js';
import { Node } from '../../../../scenery/js/imports.js';

export default class DiffusionKeyboardHelpContent extends Node {

  public constructor() {

    // Basic Actions
    const basicActionsKeyboardHelpSection = new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: true
    } );

    super( {
      isDisposable: false,
      children: [ basicActionsKeyboardHelpSection ]
    } );
  }
}

gasProperties.register( 'DiffusionKeyboardHelpContent', DiffusionKeyboardHelpContent );