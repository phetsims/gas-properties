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

    // Move [<][>]
    const leftRightArrowKeysRowIcon = KeyboardHelpIconFactory.leftRightArrowKeysRowIcon();
    const moveRow = KeyboardHelpSectionRow.labelWithIcon( SceneryPhetStrings.keyboardHelpDialog.moveStringProperty, leftRightArrowKeysRowIcon );

    // Move slower [Shift]+[<\][>]
    const shiftPlusLeftRightIcon = KeyboardHelpIconFactory.shiftPlusIcon( leftRightArrowKeysRowIcon );
    const moveSlowerRow = KeyboardHelpSectionRow.labelWithIcon( SceneryPhetStrings.keyboardHelpDialog.moveSlowerStringProperty, shiftPlusLeftRightIcon );

    super( GasPropertiesStrings.keyboardHelpDialog.moveHandlesStringProperty, [ moveRow, moveSlowerRow ] );
  }
}

gasProperties.register( 'MoveHandlesKeyboardHelpSection', MoveHandlesKeyboardHelpSection );