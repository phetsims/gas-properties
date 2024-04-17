// Copyright 2024, University of Colorado Boulder

/**
 * TODO https://github.com/phetsims/gas-properties/issues/215
 * TODO https://github.com/phetsims/scenery-phet/issues/847
 * This is a placeholder for the keyboard help that will exist in scenery-phet.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import gasProperties from '../../gasProperties.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';

export default class SpinnerControlsKeyboardHelpSection extends KeyboardHelpSection {

  public constructor( orientation: 'horizontal' | 'vertical', includeShift = true ) {

    const arrowKeysIcons = ( orientation === 'vertical' ) ? KeyboardHelpIconFactory.upDownArrowKeysRowIcon() :
                           KeyboardHelpIconFactory.leftRightArrowKeysRowIcon();

    const rows = [];

    // Adjust
    const adjustValueRow = KeyboardHelpSectionRow.labelWithIcon( 'Adjust value', arrowKeysIcons );
    rows.push( adjustValueRow );

    // Adjust in smaller steps
    if ( includeShift ) {
      const adjustInSmallerStepsRow = KeyboardHelpSectionRow.labelWithIcon( 'Adjust in smaller steps',
        KeyboardHelpIconFactory.shiftPlusIcon( arrowKeysIcons ) );
      rows.push( adjustInSmallerStepsRow );
    }

    // Jump to minimum
    const jumpToMinimumRow = KeyboardHelpSectionRow.labelWithIcon( 'Jump to minimum', TextKeyNode.home() );
    rows.push( jumpToMinimumRow );

    // Jump to maximum
    const jumpToMaximumRow = KeyboardHelpSectionRow.labelWithIcon( 'Jump to maximum', TextKeyNode.end() );
    rows.push( jumpToMaximumRow );

    super( 'Spinner Controls', rows );
  }
}

gasProperties.register( 'SpinnerControlsKeyboardHelpSection', SpinnerControlsKeyboardHelpSection );