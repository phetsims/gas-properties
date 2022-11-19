// Copyright 2018-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * GasPropertiesCheckbox is a specialization of Checkbox for this sim.  It can be labeled with text and/or an icon,
 * and has the correct options and color profiling for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import { HBox, RichText } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';

export default class GasPropertiesCheckbox extends Checkbox {

  /**
   * @param {BooleanProperty} booleanProperty
   * @param {Object} [options]
   */
  constructor( booleanProperty, options ) {
    assert && assert( booleanProperty instanceof BooleanProperty, `invalid booleanProperty: ${booleanProperty}` );

    options = merge( {}, GasPropertiesConstants.CHECKBOX_OPTIONS, {
      stringProperty: null, // {TReadOnlyProperty.<string>|null} optional text label
      icon: null, // {Node|null} optional icon, to the right of text
      textFill: GasPropertiesColors.textFillProperty,
      textMaxWidth: null,
      textIconSpacing: 10, // horizontal space between text and icon
      font: GasPropertiesConstants.CONTROL_FONT,

      // superclass options
      checkboxColor: GasPropertiesColors.checkboxStrokeProperty,
      checkboxColorBackground: GasPropertiesColors.checkboxFillProperty
    }, options );

    assert && assert( options.stringProperty || options.icon, 'stringProperty or icon is required' );

    const contentChildren = [];

    if ( options.stringProperty ) {
      contentChildren.push( new RichText( options.stringProperty, {
        fill: options.textFill,
        font: options.font,
        maxWidth: options.textMaxWidth
      } ) );
    }

    if ( options.icon ) {
      contentChildren.push( options.icon );
    }

    let content = null;
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
}

gasProperties.register( 'GasPropertiesCheckbox', GasPropertiesCheckbox );