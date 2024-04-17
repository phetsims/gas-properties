// Copyright 2024, University of Colorado Boulder

//TODO https://github.com/phetsims/gas-properties/issues/215 Finish this, then factor out duplication.
/**
 * IdealKeyboardHelpContent is the keyboard help for the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import gasProperties from '../../gasProperties.js';
import ComboBoxKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import MoveHandlesKeyboardHelpSection from '../../common/view/MoveHandlesKeyboardHelpSection.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import SpinnerControlsKeyboardHelpSection from '../../common/view/SpinnerControlsKeyboardHelpSection.js';

export default class IdealKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections = [

      // Move Handles
      new MoveHandlesKeyboardHelpSection(),

      // Move Draggable Items
      new MoveDraggableItemsKeyboardHelpSection(),

      // Slider Controls
      new SliderControlsKeyboardHelpSection()
    ];

    // Sections in the right column.
    const rightSections = [

      // Spinner Controls
      new SpinnerControlsKeyboardHelpSection( 'horizontal' ),

      // Pop open menu
      new ComboBoxKeyboardHelpSection(),

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

gasProperties.register( 'IdealKeyboardHelpContent', IdealKeyboardHelpContent );