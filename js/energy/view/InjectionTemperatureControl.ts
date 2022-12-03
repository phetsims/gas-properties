// Copyright 2022, University of Colorado Boulder

/**
 * InjectionTemperatureControl is a NumberControl for setting the injection temperature of particles.
 * It was factored out of InjectionTemperatureAccordionBox on 11/29/2022.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import gasProperties from '../../gasProperties.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import Slider from '../../../../sun/js/Slider.js';
import ArrowButton from '../../../../sun/js/buttons/ArrowButton.js';

type SelfOptions = EmptySelfOptions;

type InjectionTemperatureControlOptions = SelfOptions &
  PickRequired<NumberControlOptions, 'tandem' | 'enabledProperty'>;

export default class InjectionTemperatureControl extends NumberControl {

  public constructor( initialTemperatureProperty: NumberProperty, providedOptions: InjectionTemperatureControlOptions ) {

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

    const options = optionize<InjectionTemperatureControlOptions, SelfOptions, NumberControlOptions>()( {

      // NumberControlOptions
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
      }
    }, providedOptions );

    super( '', initialTemperatureProperty, initialTemperatureProperty.range, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
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
    children: [
      new HBox( {
        spacing: 5,
        children: [ leftArrowButton!, numberDisplay, rightArrowButton! ]
      } ),
      slider
    ]
  } );
}

gasProperties.register( 'InjectionTemperatureControl', InjectionTemperatureControl );