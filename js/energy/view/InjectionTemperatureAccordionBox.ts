// Copyright 2019-2022, University of Colorado Boulder

/**
 * InjectionTemperatureAccordionBox contains controls related to the temperature used to compute the initial velocity
 * of particles when they are injected into the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { RangedProperty } from '../../../../axon/js/NumberProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import { HBox, Node, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import ArrowButton from '../../../../sun/js/buttons/ArrowButton.js';
import Slider from '../../../../sun/js/Slider.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import FixedWidthNode from '../../common/view/FixedWidthNode.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';

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
                      initialTemperatureProperty: RangedProperty,
                      providedOptions: InjectionTemperatureAccordionBoxOptions ) {

    assert && assert( initialTemperatureProperty.range, 'initialTemperatureProperty is missing range' );

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
        createNode: tandem => new Text( GasPropertiesStrings.matchContainerStringProperty, TEXT_OPTIONS ),
        tandemName: 'matchContainerRadioButton'
      },
      {
        value: true,
        createNode: tandem => new Text( GasPropertiesStrings.setToStringProperty, TEXT_OPTIONS ),
        tandemName: 'setToRadioButton'
      }
    ], {
      spacing: 12,
      radioButtonOptions: GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS,
      tandem: options.tandem.createTandem( 'radioButtonGroup' )
    } );

    // Major ticks for temperature slider
    const tickTextOptions = {
      fill: GasPropertiesColors.textFillProperty,
      font: GasPropertiesConstants.CONTROL_FONT
    };
    const majorTicks = [
      {
        value: initialTemperatureProperty.range.min,
        label: new Text( initialTemperatureProperty.range.min, tickTextOptions )
      },
      {
        value: initialTemperatureProperty.range.max,
        label: new Text( initialTemperatureProperty.range.max, tickTextOptions )
      }
    ];

    // Temperature NumberControl
    const temperatureControl = new NumberControl( '', initialTemperatureProperty, initialTemperatureProperty.range, {
      layoutFunction: temperatureLayoutFunction,
      titleNodeOptions: {
        fill: GasPropertiesColors.textFillProperty,
        font: GasPropertiesConstants.CONTROL_FONT,
        maxWidth: 125, // determined empirically
        tandem: Tandem.OPTIONAL // no tandem because no title
      },
      numberDisplayOptions: {
        textOptions: {
          font: GasPropertiesConstants.CONTROL_FONT
        },
        valuePattern: new PatternStringProperty( GasPropertiesStrings.valueUnitsStringProperty, {
          units: GasPropertiesStrings.kelvinStringProperty
        } ),
        maxWidth: 75 // determined empirically
      },
      sliderOptions: {
        trackSize: new Dimension2( 175, 5 ),
        trackStroke: GasPropertiesColors.textFillProperty,
        majorTicks: majorTicks,
        majorTickStroke: GasPropertiesColors.textFillProperty,
        constrainValue: value => {
          return Utils.roundToInterval( value, 50 );
        }
      },
      layoutOptions: {
        align: 'center'
      },
      tandem: options.tandem.createTandem( 'temperatureControl' )
    } );

    const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

    const content = new FixedWidthNode( contentWidth, new VBox( {
      align: 'left',
      spacing: 12,
      children: [ radioButtonGroup, temperatureControl ]
    } ) );

    super( content, options );

    controlTemperatureEnabledProperty.link( controlTemperatureEnabled => {
      temperatureControl.enabled = controlTemperatureEnabled;
    } );
  }
}

/**
 * Layout function for the temperature NumberControl.
 * The title is ignored, and the other controls are arranged like this, horizontally centered:
 *
 *   < number >
 *  -----|------
 */
function temperatureLayoutFunction( titleNode: Node, numberDisplay: NumberDisplay, slider: Slider,
                                    leftArrowButton: ArrowButton | null, rightArrowButton: ArrowButton | null ): Node {
  assert && assert( leftArrowButton && rightArrowButton );

  return new VBox( {
    align: 'center',
    spacing: 5,
    resize: false, // prevent slider from causing a resize when thumb is at min or max
    children: [
      new HBox( {
        spacing: 5,
        children: [ leftArrowButton!, numberDisplay, rightArrowButton! ]
      } ),
      slider
    ]
  } );
}

gasProperties.register( 'InjectionTemperatureAccordionBox', InjectionTemperatureAccordionBox );