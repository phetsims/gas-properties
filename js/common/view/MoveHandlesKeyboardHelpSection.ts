// Copyright 2024, University of Colorado Boulder

/**
 * MoveHandlesKeyboardHelpSection is the keyboard-help section that described how to move the container handles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import gasProperties from '../../gasProperties.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import SceneryPhetStrings from '../../../../scenery-phet/js/SceneryPhetStrings.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';

export default class MoveHandlesKeyboardHelpSection extends KeyboardHelpSection {

  public constructor() {

    const leftRightArrowsIcon = KeyboardHelpIconFactory.leftRightArrowKeysRowIcon();
    const upDownArrowsIcon = KeyboardHelpIconFactory.upDownArrowKeysRowIcon();

    // Move [<][>] or [^][v]
    const leftRightOrUpDownArrowsIcon = KeyboardHelpIconFactory.iconOrIcon( leftRightArrowsIcon, upDownArrowsIcon );
    const moveRow = KeyboardHelpSectionRow.labelWithIcon( SceneryPhetStrings.keyboardHelpDialog.moveStringProperty, leftRightOrUpDownArrowsIcon );

    // Move slower [Shift]+[<][>] or [Shift]+[^][v]
    const shiftPlusLeftRightIcon = KeyboardHelpIconFactory.shiftPlusIcon( leftRightArrowsIcon );
    const shiftPlusUpDownIcon = KeyboardHelpIconFactory.shiftPlusIcon( upDownArrowsIcon );
    const moveSlowerRow = KeyboardHelpSectionRow.labelWithIconList( SceneryPhetStrings.keyboardHelpDialog.moveSlowerStringProperty,
      [ shiftPlusLeftRightIcon, shiftPlusUpDownIcon ] );

    super( GasPropertiesStrings.keyboardHelpDialog.moveHandlesStringProperty, [ moveRow, moveSlowerRow ] );
  }
}

gasProperties.register( 'MoveHandlesKeyboardHelpSection', MoveHandlesKeyboardHelpSection );