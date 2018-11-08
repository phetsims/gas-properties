// Copyright 2018, University of Colorado Boulder

/**
 * Control panel labeled 'Hold Constant'
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const holdConstantNothingString = require( 'string!GAS_PROPERTIES/holdConstant.nothing' );
  const holdConstantPressureTString = require( 'string!GAS_PROPERTIES/holdConstant.pressureT' );
  const holdConstantPressureVString = require( 'string!GAS_PROPERTIES/holdConstant.pressureV' );
  const holdConstantString = require( 'string!GAS_PROPERTIES/holdConstant' );
  const holdConstantTemperatureString = require( 'string!GAS_PROPERTIES/holdConstant.temperature' );
  const holdConstantVolumeString = require( 'string!GAS_PROPERTIES/holdConstant.volume' );

  class HoldConstantPanel extends Panel {

    /**
     * @param {StringProperty} holdConstantProperty
     * @param {Object} [options]
     */
    constructor( holdConstantProperty, options ) {

      options = _.extend( {

        fixedWidth: 250,

        // Panel options
        align: 'left',
        xMargin: GasPropertiesConstants.PANEL_X_MARGIN,
        yMargin: GasPropertiesConstants.PANEL_Y_MARGIN,
        cornerRadius: GasPropertiesConstants.PANEL_CORNER_RADIUS,
        fill: GasPropertiesColors.BACKGROUND_COLOR,
        stroke: GasPropertiesColors.FOREGROUND_COLOR

      }, options );

      assert && assert( options.maxWidth === undefined, 'ParticleCountsAccordionBox sets maxWidth' );
      options.maxWidth = options.fixedWidth;

      const radioButtonOptions = {
        radius: 10,
        xSpacing: 10
      };

      const textOptions = {
        font: new PhetFont( 20 ),
        fill: GasPropertiesColors.FOREGROUND_COLOR
      };

      const titleNode = new Text( holdConstantString, {
        font: GasPropertiesConstants.TITLE_FONT,
        fill: GasPropertiesColors.FOREGROUND_COLOR
      } );

      const nothingRadioButton = new AquaRadioButton( holdConstantProperty, 'nothing',
        new Text( holdConstantNothingString, textOptions ),
        radioButtonOptions );

      const volumeRadioButton = new AquaRadioButton( holdConstantProperty, 'volume',
        new Text( holdConstantVolumeString, textOptions ),
        radioButtonOptions );

      const temperatureRadioButton = new AquaRadioButton( holdConstantProperty, 'temperature',
        new Text( holdConstantTemperatureString, textOptions ),
        radioButtonOptions );

      const pressureVRadioButton = new AquaRadioButton( holdConstantProperty, 'pressureV',
        new Text( holdConstantPressureVString, textOptions ),
        radioButtonOptions );

      const pressureTRadioButton = new AquaRadioButton( holdConstantProperty, 'pressureT',
        new Text( holdConstantPressureTString, textOptions ),
        radioButtonOptions );

      const content = new VBox( {
        align: 'left',
        spacing: 10,
        children: [
          titleNode,
          nothingRadioButton,
          volumeRadioButton,
          temperatureRadioButton,
          pressureVRadioButton,
          pressureTRadioButton
        ]
      } );

      const strut = new HStrut( options.fixedWidth - ( 2 * options.xMargin ) );

      super( new Node( { children: [ strut, content ] } ), options );
    }
  }

  return gasProperties.register( 'HoldConstantPanel', HoldConstantPanel );
} );
 