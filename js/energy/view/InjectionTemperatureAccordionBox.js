// Copyright 2019, University of Colorado Boulder

/**
 * InjectionTemperatureAccordionBox contains controls related to the temperature used to compute the initial velocity
 * of particles when they are injected into the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const ArrowButton = require( 'SUN/buttons/ArrowButton' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const FixedWidthNode = require( 'GAS_PROPERTIES/common/view/FixedWidthNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Slider = require( 'SUN/Slider' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  const injectionTemperatureString = require( 'string!GAS_PROPERTIES/injectionTemperature' );
  const kelvinString = require( 'string!GAS_PROPERTIES/kelvin' );
  const matchContainerString = require( 'string!GAS_PROPERTIES/matchContainer' );
  const setToString = require( 'string!GAS_PROPERTIES/setTo' );
  const valueUnitsString = require( 'string!GAS_PROPERTIES/valueUnits' );

  // constants
  const TEXT_OPTIONS = {
    font: GasPropertiesConstants.CONTROL_FONT,
    fill: GasPropertiesColorProfile.textFillProperty,
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
        tandem: Tandem.required
      }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        // superclass options
        titleNode: new Text( injectionTemperatureString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } )
      }, options );

      // Limit width of title
      options.titleNode.maxWidth = 0.75 * options.fixedWidth; // determined empirically

      // Radio buttons
      const radioButtonGroup = new VerticalAquaRadioButtonGroup( controlTemperatureEnabledProperty, [
        { value: false, node: new Text( matchContainerString, TEXT_OPTIONS ) },
        { value: true, node: new Text( setToString, TEXT_OPTIONS ) }
      ], {
        spacing: 12,
        radioButtonOptions: GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS
      } );

      // Major ticks for temperature slider
      const tickTextOptions = {
        fill: GasPropertiesColorProfile.textFillProperty,
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
          fill: GasPropertiesColorProfile.textFillProperty,
          font: GasPropertiesConstants.CONTROL_FONT,
          maxWidth: 125 // determined empirically
        },
        numberDisplayOptions: {
          font: GasPropertiesConstants.CONTROL_FONT,
          valuePattern: StringUtils.fillIn( valueUnitsString, {
            units: kelvinString
          } ),
          maxWidth: 75 // determined empirically
        },
        sliderOptions: {
          trackSize: new Dimension2( 175, 5 ),
          trackStroke: GasPropertiesColorProfile.textFillProperty,
          majorTicks: majorTicks,
          majorTickStroke: GasPropertiesColorProfile.textFillProperty,
          constrainValue: value => {
            return Util.roundToInterval( value, 50 );
          }
        }
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

  return gasProperties.register( 'InjectionTemperatureAccordionBox', InjectionTemperatureAccordionBox );
} );