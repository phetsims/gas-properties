// Copyright 2024, University of Colorado Boulder

//TODO https://github.com/phetsims/gas-properties/issues/215 Replaces this with scenery-phet.SpinnerHelpSection
/**
 * TODO https://github.com/phetsims/gas-properties/issues/215
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import gasProperties from '../../gasProperties.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';

export default class GasPropertiesSpinnerHelpSection extends KeyboardHelpSection {

  public constructor( orientation: 'horizontal' | 'vertical' ) {

    const arrowKeysIcons = ( orientation === 'vertical' ) ? KeyboardHelpIconFactory.upDownArrowKeysRowIcon() :
                           KeyboardHelpIconFactory.leftRightArrowKeysRowIcon();

    // Adjust
    const adjustValueRow = KeyboardHelpSectionRow.labelWithIcon( 'Adjust value', arrowKeysIcons );

    // Adjust in smaller steps
    const adjustInSmallerStepsRow = KeyboardHelpSectionRow.labelWithIcon( 'Adjust in smaller steps',
      KeyboardHelpIconFactory.shiftPlusIcon( arrowKeysIcons ) );

    // Jump to minimum
    const jumpToMinimumRow = KeyboardHelpSectionRow.labelWithIcon( 'Jump to minimum', TextKeyNode.home() );

    // Jump to maximum
    const jumpToMaximumRow = KeyboardHelpSectionRow.labelWithIcon( 'Jump to maximum', TextKeyNode.end() );

    super( 'Spinner Controls', [
      adjustValueRow,
      adjustInSmallerStepsRow,
      jumpToMinimumRow,
      jumpToMaximumRow
    ] );
  }
}

gasProperties.register( 'GasPropertiesSpinnerHelpSection', GasPropertiesSpinnerHelpSection );