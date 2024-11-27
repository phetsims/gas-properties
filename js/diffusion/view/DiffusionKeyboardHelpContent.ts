// Copyright 2024, University of Colorado Boulder

/**
 * DiffusionKeyboardHelpContent is the keyboard help for the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import SpinnerControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SpinnerControlsKeyboardHelpSection.js';
import TimeControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/TimeControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import gasProperties from '../../gasProperties.js';

export default class DiffusionKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections = [

      // Move Draggable Items
      new MoveDraggableItemsKeyboardHelpSection(),

      // Spinner Controls
      new SpinnerControlsKeyboardHelpSection( {
        includeSmallerStepsRow: false,
        includeLargerStepsRow: false
      } )
    ];

    // Sections in the right column.
    const rightSections = [

      // Time Controls
      new TimeControlsKeyboardHelpSection(),

      // Basic Actions
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true
      } )
    ];

    super( leftSections, rightSections, {
      isDisposable: false
    } );
  }
}

gasProperties.register( 'DiffusionKeyboardHelpContent', DiffusionKeyboardHelpContent );