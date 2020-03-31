// Copyright 2019-2020, University of Colorado Boulder

/**
 * ScaleCheckbox is the checkbox used to show/hide the scale on the Diffusion container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import GasPropertiesCheckbox from '../../common/view/GasPropertiesCheckbox.js';
import GasPropertiesIconFactory from '../../common/view/GasPropertiesIconFactory.js';
import gasPropertiesStrings from '../../gasPropertiesStrings.js';
import gasProperties from '../../gasProperties.js';

const scaleString = gasPropertiesStrings.scale;

class ScaleCheckbox extends GasPropertiesCheckbox {

  /**
   * @param {BooleanProperty} scaleVisibleProperty
   * @param {Object} [options]
   */
  constructor( scaleVisibleProperty, options ) {
    assert && assert( scaleVisibleProperty instanceof BooleanProperty,
      `invalid scaleVisibleProperty: ${scaleVisibleProperty}` );

    assert && assert( !options || !options.text, 'ScaleCheckbox sets text' );

    options = merge( {

      // superclass options
      text: scaleString,
      icon: GasPropertiesIconFactory.createScaleIcon()
    }, options );

    super( scaleVisibleProperty, options );
  }
}

gasProperties.register( 'ScaleCheckbox', ScaleCheckbox );
export default ScaleCheckbox;