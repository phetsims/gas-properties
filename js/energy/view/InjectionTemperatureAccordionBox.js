// Copyright 2019-2021, University of Colorado Boulder

/**
 * InjectionTemperatureAccordionBox contains controls related to the temperature used to compute the initial velocity
 * of particles when they are injected into the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import ArrowButton from '../../../../sun/js/buttons/ArrowButton.js';
import Slider from '../../../../sun/js/Slider.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import FixedWidthNode from '../../common/view/FixedWidthNode.js';
import gasProperties from '../../gasProperties.js';
import gasPropertiesStrings from '../../gasPropertiesStrings.js';

// constants
const TEXT_OPTIONS = {
  font: GasPropertiesConstants.CONTROL_FONT,
  fill: GasPropertiesColors.textFillProperty,
  maxWidth: 175 // determined empirically
};

class InjectionTemperatureAccordionBox extends AccordionBox {

  /**
   * @param {BooleanProperty} controlTemperatureEnabledProperty
   * @param {NumberProperty} initialTemperatureProperty
   * @param {Object} [options]
   */
  constructor( controlTemperatureEnabledProperty, initialTemperatureProperty, options ) {
    assert && assert( controlTemperatureEnabledProperty instanceof BooleanProperty,
      `invalid controlTemperatureEnabledProperty: ${controlTemperatureEnabledProperty}` );
    assert && assert( initialTemperatureProperty instanceof NumberProperty,
      `invalid initialTemperatureProperty: ${initialTemperatureProperty}` );

    assert && assert( initialTemperatureProperty.range, 'initialTemperatureProperty is missing range' );

    options = merge( {
      fixedWidth: 100,
      contentXMargin: 0,

      // phet-io
      tandem: Tandem.REQUIRED
    }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

      // superclass options
      titleNode: new Text( gasPropertiesStrings.injectionTemperature, {
        font: GasPropertiesConstants.TITLE_FONT,
        fill: GasPropertiesColors.textFillProperty
      } )
    }, options );

    // Limit width of title
    options.titleNode.maxWidth = 0.75 * options.fixedWidth; // determined empirically

    // Radio buttons
    const radioButtonGroup = new VerticalAquaRadioButtonGroup( controlTemperatureEnabledProperty, [
      {
        value: false,
        node: new Text( gasPropertiesStrings.matchContainer, TEXT_OPTIONS ),
        tandemName: 'matchContainerRadioButton'
      },
      {
        value: true,
        node: new Text( gasPropertiesStrings.setTo, TEXT_OPTIONS ),
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
        valuePattern: StringUtils.fillIn( gasPropertiesStrings.valueUnits, {
          units: gasPropertiesStrings.kelvin
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
 *
 * @param {Node} titleNode
 * @param {NumberDisplay} numberDisplay
 * @param {Slider} slider
 * @param {ArrowButton} leftArrowButton
 * @param {ArrowButton} rightArrowButton
 * @returns {Node}
 */
function temperatureLayoutFunction( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) {
  assert && assert( titleNode instanceof Node, `invalid titleNode: ${titleNode}` );
  assert && assert( numberDisplay instanceof NumberDisplay, `invalid numberDisplay: ${numberDisplay}` );
  assert && assert( slider instanceof Slider, `invalid slider: ${slider}` );
  assert && assert( leftArrowButton instanceof ArrowButton, `invalid leftArrowButton: ${leftArrowButton}` );
  assert && assert( rightArrowButton instanceof ArrowButton, `invalid rightArrowButton: ${rightArrowButton}` );

  return new VBox( {
    align: 'center',
    spacing: 5,
    resize: false, // prevent slider from causing a resize when thumb is at min or max
    children: [
      new HBox( {
        spacing: 5,
        children: [ leftArrowButton, numberDisplay, rightArrowButton ]
      } ),
      slider
    ]
  } );
}

gasProperties.register( 'InjectionTemperatureAccordionBox', InjectionTemperatureAccordionBox );
export default InjectionTemperatureAccordionBox;