// Copyright 2018-2022, University of Colorado Boulder

/**
 * GasPropertiesCheckbox is a specialization of Checkbox for this sim.  It can be labeled with text and/or an icon,
 * and has the correct options and color profiling for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Font, HBox, Node, RichText, TColor } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';

type SelfOptions = {
  icon?: Node | null; // optional icon, to the right of text
  textStringProperty?: TReadOnlyProperty<string> | null; // optional text label
  textFill?: TColor;
  textMaxWidth?: number | null;
  textIconSpacing?: number; // horizontal space between text and icon
  font?: Font;
};

export type GasPropertiesCheckboxOptions = SelfOptions &
  PickOptional<CheckboxOptions, 'spacing'> &
  PickRequired<CheckboxOptions, 'tandem'>;

export default class GasPropertiesCheckbox extends Checkbox {

  public constructor( booleanProperty: Property<boolean>, providedOptions: GasPropertiesCheckboxOptions ) {

    const options = optionize4<GasPropertiesCheckboxOptions, SelfOptions, CheckboxOptions>()(
      {}, GasPropertiesConstants.CHECKBOX_OPTIONS, {

        // SelfOptions
        textStringProperty: null,
        icon: null,
        textFill: GasPropertiesColors.textFillProperty,
        textMaxWidth: null,
        textIconSpacing: 10,
        font: GasPropertiesConstants.CONTROL_FONT,

        // CheckboxOptions
        checkboxColor: GasPropertiesColors.checkboxStrokeProperty,
        checkboxColorBackground: GasPropertiesColors.checkboxFillProperty
      }, providedOptions );

    assert && assert( options.textStringProperty || options.icon, 'textStringProperty or icon is required' );

    const contentChildren = [];

    if ( options.textStringProperty ) {
      contentChildren.push( new RichText( options.textStringProperty, {
        fill: options.textFill,
        font: options.font,
        maxWidth: options.textMaxWidth
      } ) );
    }

    if ( options.icon ) {
      contentChildren.push( options.icon );
    }

    let content;
    if ( contentChildren.length === 1 ) {
      content = contentChildren[ 0 ];
    }
    else {
      content = new HBox( {
        align: 'center',
        spacing: options.textIconSpacing,
        children: contentChildren
      } );
    }

    super( booleanProperty, content, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'GasPropertiesCheckbox', GasPropertiesCheckbox );