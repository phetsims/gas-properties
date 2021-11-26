// Copyright 2019-2020, University of Colorado Boulder

/**
 * ReturnLidButton is used to return the container's lid after it has been blown off.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import { Text } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import gasProperties from '../../gasProperties.js';
import gasPropertiesStrings from '../../gasPropertiesStrings.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import IdealGasLawContainer from '../model/IdealGasLawContainer.js';

class ReturnLidButton extends RectangularPushButton {

  /**
   * @param {IdealGasLawContainer} container
   * @param {Object} [options]
   */
  constructor( container, options ) {
    assert && assert( container instanceof IdealGasLawContainer, `invalid container: ${container}` );

    options = merge( {

      // superclass options
      baseColor: PhetColorScheme.BUTTON_YELLOW
    }, options );

    const textNode = new Text( gasPropertiesStrings.returnLid, {
      font: GasPropertiesConstants.CONTROL_FONT,
      maxWidth: 150 // determined empirically
    } );

    const buttonListener = () => {
      container.lidIsOnProperty.value = true;
    };

    assert && assert( !options.content, 'ReturnLidButton sets content' );
    assert && assert( !options.listener, 'ReturnLidButton sets listener' );
    options = merge( {
      content: textNode,
      listener: buttonListener
    }, options );

    super( options );

    // Button is visible immediately, so it's possible to push it and repeatedly blow the lid off.
    container.lidIsOnProperty.link( lidIsOn => {
      this.visible = !lidIsOn;
    } );
  }
}

gasProperties.register( 'ReturnLidButton', ReturnLidButton );
export default ReturnLidButton;