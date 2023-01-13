// Copyright 2019-2023, University of Colorado Boulder

/**
 * InjectionTemperatureAccordionBox contains controls related to the temperature used to compute the initial velocity
 * of particles when they are injected into the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import InjectionTemperatureControl from './InjectionTemperatureControl.js';

// constants
const TEXT_OPTIONS: TextOptions = {
  font: GasPropertiesConstants.CONTROL_FONT,
  fill: GasPropertiesColors.textFillProperty,
  maxWidth: 175 // determined empirically
};

type SelfOptions = {
  fixedWidth?: number;
};

type InjectionTemperatureAccordionBoxOptions = SelfOptions & PickRequired<AccordionBoxOptions, 'expandedProperty' | 'tandem'>;

export default class InjectionTemperatureAccordionBox extends AccordionBox {

  public constructor( controlTemperatureEnabledProperty: Property<boolean>,
                      initialTemperatureProperty: NumberProperty,
                      providedOptions: InjectionTemperatureAccordionBoxOptions ) {

    const options = optionize4<InjectionTemperatureAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()(
      {}, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        // SelfOptions
        fixedWidth: 100,

        // AccordionBoxOptions
        contentXMargin: GasPropertiesConstants.ACCORDION_BOX_OPTIONS.contentXMargin,
        titleNode: new Text( GasPropertiesStrings.injectionTemperatureStringProperty, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColors.textFillProperty
        } )
      }, providedOptions );

    // Limit width of title
    options.titleNode.maxWidth = 0.75 * options.fixedWidth; // determined empirically

    // Radio buttons
    const radioButtonGroup = new VerticalAquaRadioButtonGroup( controlTemperatureEnabledProperty, [
      {
        value: false,
        createNode: () => new Text( GasPropertiesStrings.matchContainerStringProperty, TEXT_OPTIONS ),
        tandemName: 'matchContainerRadioButton'
      },
      {
        value: true,
        createNode: () => new Text( GasPropertiesStrings.setToStringProperty, TEXT_OPTIONS ),
        tandemName: 'setToRadioButton'
      }
    ], {
      spacing: 12,
      radioButtonOptions: GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS,
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    // NumberControl
    const temperatureControl = new InjectionTemperatureControl( initialTemperatureProperty, {
      enabledProperty: controlTemperatureEnabledProperty,
      tandem: options.tandem.createTandem( 'temperatureControl' )
    } );

    const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

    const content = new VBox( {
      preferredWidth: contentWidth,
      widthSizable: false, // so that width will remain preferredWidth
      align: 'left',
      spacing: 12,
      children: [ radioButtonGroup, temperatureControl ]
    } );

    super( content, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'InjectionTemperatureAccordionBox', InjectionTemperatureAccordionBox );