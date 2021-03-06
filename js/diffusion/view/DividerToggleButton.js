// Copyright 2019-2020, University of Colorado Boulder

/**
 * DividerToggleButton is used to toggle the container's vertical divider. It is color-coded to the divider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import BooleanRectangularToggleButton from '../../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import GasPropertiesColorProfile from '../../common/GasPropertiesColorProfile.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';
import gasPropertiesStrings from '../../gasPropertiesStrings.js';

class DividerToggleButton extends BooleanRectangularToggleButton {

  /**
   * @param {BooleanProperty} hasDividerProperty
   * @param {Object} [options]
   */
  constructor( hasDividerProperty, options ) {
    assert && assert( hasDividerProperty instanceof BooleanProperty,
      `invalid hasDividerProperty: ${hasDividerProperty}` );

    options = merge( {

      // superclass options
      baseColor: GasPropertiesColorProfile.dividerColorProperty
    }, options );

    const textOptions = {
      font: GasPropertiesConstants.CONTROL_FONT,
      fill: 'black',
      maxWidth: 150 // determined empirically
    };

    const trueNode = new Text( gasPropertiesStrings.removeDivider, textOptions );
    const falseNode = new Text( gasPropertiesStrings.resetDivider, textOptions );

    super( trueNode, falseNode, hasDividerProperty, options );
  }
}

gasProperties.register( 'DividerToggleButton', DividerToggleButton );
export default DividerToggleButton;