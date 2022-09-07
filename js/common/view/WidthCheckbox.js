// Copyright 2018-2020, University of Colorado Boulder

/**
 * WidthCheckbox is a checkbox to show/hide the width of the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesCheckbox from './GasPropertiesCheckbox.js';
import GasPropertiesIconFactory from './GasPropertiesIconFactory.js';

class WidthCheckbox extends GasPropertiesCheckbox {

  /**
   * @param {BooleanProperty} widthVisibleProperty
   * @param {Object} [options]
   */
  constructor( widthVisibleProperty, options ) {
    assert && assert( widthVisibleProperty instanceof BooleanProperty,
      `invalid widthVisibleProperty: ${widthVisibleProperty}` );

    if ( options ) {
      assert && assert( !options.text, 'WidthCheckbox sets text' );
      assert && assert( !options.icon, 'WidthCheckbox sets icon' );
    }

    options = merge( {

      // superclass options
      text: GasPropertiesStrings.width,
      icon: GasPropertiesIconFactory.createContainerWidthIcon()
    }, options );

    super( widthVisibleProperty, options );
  }
}

gasProperties.register( 'WidthCheckbox', WidthCheckbox );
export default WidthCheckbox;