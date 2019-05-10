// Copyright 2019, University of Colorado Boulder

/**
 * Control panel labeled 'Particle Tools', which has controls related to particles.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const FixedWidthNode = require( 'GAS_PROPERTIES/common/view/FixedWidthNode' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const collisionsString = require( 'string!GAS_PROPERTIES/collisions' );
  const controlTemperatureString = require( 'string!GAS_PROPERTIES/controlTemperature' );
  const particleToolsString = require( 'string!GAS_PROPERTIES/particleTools' );
  const temperatureString = require( 'string!GAS_PROPERTIES/temperature' );
  const kelvinString = require( 'string!GAS_PROPERTIES/kelvin' );
  const valueUnitsString = require( 'string!GAS_PROPERTIES/valueUnits' );

  class ParticleToolsAccordionBox extends AccordionBox {

    /**
     * @param {BooleanProperty} collisionsEnabledProperty
     * @param {BooleanProperty} controlTemperatureEnabledProperty
     * @param {NumberProperty} initialTemperatureProperty
     * @param {Object} [options]
     */
    constructor( collisionsEnabledProperty,
                 controlTemperatureEnabledProperty,
                 initialTemperatureProperty,
                 options ) {

      assert && assert( initialTemperatureProperty.range, 'initialTemperatureProperty is missing range' );

      options = _.extend( {}, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        fixedWidth: 100,

        // AccordionBox options
        titleNode: new Text( particleToolsString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } )
      }, options );

      // Limit width of title
      options.titleNode.maxWidth = 0.75 * options.fixedWidth; // determined empirically

      // Collisions checkbox
      const collisionsCheckbox = new GasPropertiesCheckbox( collisionsEnabledProperty, {
        text: collisionsString,
        textMaxWidth: 175 // determined empirically
      } );

      // Control Temperature checkbox
      const controlTemperatureCheckbox = new GasPropertiesCheckbox( controlTemperatureEnabledProperty, {
        text: controlTemperatureString,
        textMaxWidth: 175 // determined empirically
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
      const temperatureControl = new NumberControl( temperatureString, initialTemperatureProperty, initialTemperatureProperty.range, {
        layoutFunction: NumberControl.createLayoutFunction4(),
        titleNodeOptions: {
          fill: GasPropertiesColorProfile.textFillProperty,
          font: GasPropertiesConstants.CONTROL_FONT,
          maxWidth: 125
        },
        numberDisplayOptions: {
          font: GasPropertiesConstants.CONTROL_FONT,
          valuePattern: StringUtils.fillIn( valueUnitsString, {
            units: kelvinString
          } ),
          maxWidth: 75
        },
        sliderOptions: {
          trackSize: new Dimension2( 120, 5 ),
          trackStroke: GasPropertiesColorProfile.textFillProperty,
          majorTicks: majorTicks,
          majorTickStroke: GasPropertiesColorProfile.textFillProperty,
          constrainValue: value => {
            return Util.roundToInterval( value, 50 );
          }
        }
      } );

      const vBox = new VBox( {
        align: 'left',
        spacing: 12,
        children: [ collisionsCheckbox, controlTemperatureCheckbox, temperatureControl ]
      } );

      const content = new FixedWidthNode( vBox, {
        fixedWidth: options.fixedWidth - ( 2 * options.contentXMargin )
      } );

      super( content, options );

      controlTemperatureEnabledProperty.link( controlTemperatureEnabled => {
        temperatureControl.enabled = controlTemperatureEnabled;
      } );
    }
  }

  return gasProperties.register( 'ParticleToolsAccordionBox', ParticleToolsAccordionBox );
} );