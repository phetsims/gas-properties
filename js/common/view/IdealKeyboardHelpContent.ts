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
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import SpinnerControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SpinnerControlsKeyboardHelpSection.js';
import TimingControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/TimingControlsKeyboardHelpSection.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';

export default class IdealKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections = [

      // Move Draggable Items
      new MoveDraggableItemsKeyboardHelpSection(),

      //TODO https://github.com/phetsims/gas-properties/issues/215 replace with HeaterCoolerKeyboardHelpContent
      // Slider Controls
      new SliderControlsKeyboardHelpSection(),

      // Spinner Controls
      new SpinnerControlsKeyboardHelpSection( {
        includeLargerStepsRow: false
      } )
    ];

    // Sections in the right column.
    const rightSections = [

      // Timing Controls
      new TimingControlsKeyboardHelpSection(),

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