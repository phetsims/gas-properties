// Copyright 2019-2024, University of Colorado Boulder

/**
 * ReturnLidButton is used to return the container's lid after it has been blown off.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import IdealGasLawContainer from '../model/IdealGasLawContainer.js';

type SelfOptions = EmptySelfOptions;

type ReturnLidButtonOptions = SelfOptions & PickRequired<RectangularPushButtonOptions, 'tandem'>;

export default class ReturnLidButton extends RectangularPushButton {

  public constructor( container: IdealGasLawContainer, providedOptions: ReturnLidButtonOptions ) {

    const textNode = new Text( GasPropertiesStrings.returnLidStringProperty, {
      font: GasPropertiesConstants.CONTROL_FONT,
      maxWidth: 150 // determined empirically
    } );

    const options = optionize<ReturnLidButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // RectangularPushButtonOptions
      isDisposable: false,
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      content: textNode,
      listener: () => container.returnLid()
    }, providedOptions );

    super( options );

    // Button is visible immediately, so it's possible to push it and repeatedly blow the lid off.
    container.lidIsOnProperty.link( lidIsOn => {
      this.visible = !lidIsOn;
    } );
  }
}

gasProperties.register( 'ReturnLidButton', ReturnLidButton );