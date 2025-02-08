// Copyright 2019-2025, University of Colorado Boulder

/**
 * DividerToggleButton is used to toggle the container's vertical divider. It is color-coded to the divider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import BooleanRectangularToggleButton, { BooleanRectangularToggleButtonOptions } from '../../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';

type SelfOptions = EmptySelfOptions;

type DividerToggleButtonOptions = SelfOptions &
  PickOptional<BooleanRectangularToggleButtonOptions, 'layoutOptions' | 'enabledProperty'> &
  PickRequired<BooleanRectangularToggleButtonOptions, 'tandem'>;

export default class DividerToggleButton extends BooleanRectangularToggleButton {

  public constructor( isDividedProperty: Property<boolean>, providedOptions: DividerToggleButtonOptions ) {

    const options = optionize<DividerToggleButtonOptions, SelfOptions, BooleanRectangularToggleButtonOptions>()( {

      // BooleanRectangularToggleButtonOptions
      isDisposable: false,
      baseColor: GasPropertiesColors.dividerColorProperty
    }, providedOptions );

    const textOptions = {
      font: GasPropertiesConstants.CONTROL_FONT,
      fill: 'black',
      maxWidth: 150 // determined empirically
    };

    const alignGroup = new AlignGroup();
    const trueNode = new AlignBox( new Text( GasPropertiesStrings.removeDividerStringProperty, textOptions ), {
      group: alignGroup
    } );
    const falseNode = new AlignBox( new Text( GasPropertiesStrings.resetDividerStringProperty, textOptions ), {
      group: alignGroup
    } );

    super( isDividedProperty, trueNode, falseNode, options );
  }
}

gasProperties.register( 'DividerToggleButton', DividerToggleButton );