// Copyright 2019-2024, University of Colorado Boulder

/**
 * InjectionTemperatureAccordionBox contains controls related to the temperature used to compute the initial velocity
 * of particles when they are injected into the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
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

type SelfOptions = EmptySelfOptions;

type InjectionTemperatureAccordionBoxOptions = SelfOptions & PickRequired<AccordionBoxOptions, 'expandedProperty' | 'tandem'>;

export default class InjectionTemperatureAccordionBox extends AccordionBox {

  public constructor( controlTemperatureEnabledProperty: Property<boolean>,
                      initialTemperatureProperty: NumberProperty,
                      providedOptions: InjectionTemperatureAccordionBoxOptions ) {

    const options = optionize4<InjectionTemperatureAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()(
      {}, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        // AccordionBoxOptions
        isDisposable: false,
        contentXMargin: GasPropertiesConstants.ACCORDION_BOX_OPTIONS.contentXMargin,
        titleNode: new Text( GasPropertiesStrings.injectionTemperatureStringProperty, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColors.textFillProperty,
          maxWidth: 170
        } )
      }, providedOptions );

    // Radio buttons
    const radioButtonGroup = new VerticalAquaRadioButtonGroup( controlTemperatureEnabledProperty, [

      // Match Container
      {
        value: false,
        createNode: () => new Text( GasPropertiesStrings.matchContainerStringProperty, TEXT_OPTIONS ),
        tandemName: 'matchContainerRadioButton'
      },

      // Set to:
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

    const temperatureControl = new InjectionTemperatureControl( initialTemperatureProperty, {
      enabledProperty: controlTemperatureEnabledProperty,
      tandem: options.tandem.createTandem( 'temperatureControl' )
    } );

    const content = new VBox( {
      align: 'left',
      spacing: 12,
      children: [ radioButtonGroup, temperatureControl ]
    } );

    super( content, options );
  }
}

gasProperties.register( 'InjectionTemperatureAccordionBox', InjectionTemperatureAccordionBox );