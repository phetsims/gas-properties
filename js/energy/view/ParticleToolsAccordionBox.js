// Copyright 2019, University of Colorado Boulder

/**
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

      options = _.extend( {

        fixedWidth: 250,

        // AccordionBox options
        buttonXMargin: 0,
        titleXSpacing: 0,
        contentXMargin: 0,
        titleNode: new Text( particleToolsString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } )
      }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, options );

      // Limit width of title
      options.titleNode.maxWidth = options.fixedWidth - options.buttonXMargin - options.titleXSpacing;

      // Collisions checkbox
      const collisionsCheckbox = new GasPropertiesCheckbox( collisionsEnabledProperty, {
        text: collisionsString
      } );

      // Control Temperature checkbox
      const controlTemperatureCheckbox = new GasPropertiesCheckbox( controlTemperatureEnabledProperty, {
        text: controlTemperatureString
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
          font: GasPropertiesConstants.CONTROL_FONT
        },
        numberDisplayOptions: {
          font: GasPropertiesConstants.CONTROL_FONT,
          valuePattern: StringUtils.fillIn( valueUnitsString, {
            units: kelvinString
          } )
        },
        sliderOptions: {
          trackSize: new Dimension2( 120, 5 ),
          trackStroke: GasPropertiesColorProfile.textFillProperty,
          majorTicks: majorTicks,
          majorTickStroke: GasPropertiesColorProfile.textFillProperty
        }
      } );

      // force the accordion box to be a fixedWidth
      assert && assert( !options.hasOwnProperty( 'maxWidth' ), 'ParticleCountsAccordionBox sets maxWidth' );
      options = _.extend( {
        maxWidth: options.fixedWidth
      }, options );

      const vBox = new VBox( {
        align: 'left',
        spacing: 15,
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