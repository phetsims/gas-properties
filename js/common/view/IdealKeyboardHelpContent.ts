// Copyright 2024, University of Colorado Boulder

/**
 * IdealKeyboardHelpContent is the keyboard help for the 'Ideal' screen, and its 2 variants 'Explore' and 'Energy'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import gasProperties from '../../gasProperties.js';
import ComboBoxKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import SpinnerControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SpinnerControlsKeyboardHelpSection.js';
import TimeControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/TimeControlsKeyboardHelpSection.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import HeatCoolControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/HeatCoolControlsKeyboardHelpSection.js';

export default class IdealKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections = [

      // Move Draggable Items
      new MoveDraggableItemsKeyboardHelpSection(),

      // Heat Cool
      new HeatCoolControlsKeyboardHelpSection(),

      // Spinner Controls
      new SpinnerControlsKeyboardHelpSection( {
        includeLargerStepsRow: false
      } )
    ];

    // Sections in the right column.
    const rightSections = [

      // Time controls
      new TimeControlsKeyboardHelpSection(),

      // Change Units
      new ComboBoxKeyboardHelpSection( {
        headingString: GasPropertiesStrings.keyboardHelpDialog.changeUnitsStringProperty
      } ),

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