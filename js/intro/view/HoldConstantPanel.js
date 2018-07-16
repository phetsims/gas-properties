// Copyright 2018, University of Colorado Boulder

/**
 * Control panel labeled 'Hold Constant'
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  var GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var holdConstantString = require( 'string!GAS_PROPERTIES/holdConstant' );
  var holdConstantNothingString = require( 'string!GAS_PROPERTIES/holdConstant.nothing' );
  var holdConstantVolumeString = require( 'string!GAS_PROPERTIES/holdConstant.volume' );
  var holdConstantTemperatureString = require( 'string!GAS_PROPERTIES/holdConstant.temperature' );
  var holdConstantPressureTString = require( 'string!GAS_PROPERTIES/holdConstant.pressureT' );
  var holdConstantPressureVString = require( 'string!GAS_PROPERTIES/holdConstant.pressureV' );

  /**
   * @param {StringProperty} holdConstantProperty
   * @param {Object} [options]
   * @constructor
   */
  function HoldConstantPanel( holdConstantProperty, options ) {

    options = _.extend( {

      fixedWidth: 300,

      // Panel options
      align: 'left',
      xMargin: GasPropertiesConstants.PANEL_X_MARGIN,
      yMargin: GasPropertiesConstants.PANEL_Y_MARGIN,
      cornerRadius: GasPropertiesConstants.PANEL_CORNER_RADIUS,
      fill: GasPropertiesColors.BACKGROUND_COLOR,
      stroke: GasPropertiesColors.FOREGROUND_COLOR

    }, options );

    var radioButtonOptions = {
      radius: 10,
      xSpacing: 10
    };

    var textOptions = {
      font: new PhetFont( 20 ),
      fill: GasPropertiesColors.FOREGROUND_COLOR
    };

    var titleNode = new Text( holdConstantString, {
      font: GasPropertiesConstants.TITLE_FONT,
      fill: GasPropertiesColors.FOREGROUND_COLOR
    } );

    var nothingRadioButton = new AquaRadioButton( holdConstantProperty, 'nothing',
      new Text( holdConstantNothingString, textOptions ),
      radioButtonOptions );

    var volumeRadioButton = new AquaRadioButton( holdConstantProperty, 'volume',
      new Text( holdConstantVolumeString, textOptions ),
      radioButtonOptions );

    var temperatureRadioButton = new AquaRadioButton( holdConstantProperty, 'temperature',
      new Text( holdConstantTemperatureString, textOptions ),
      radioButtonOptions );

    var pressureTRadioButton = new AquaRadioButton( holdConstantProperty, 'pressureT',
      new Text( holdConstantPressureTString, textOptions ),
      radioButtonOptions );

    var pressureVRadioButton = new AquaRadioButton( holdConstantProperty, 'pressureV',
      new Text( holdConstantPressureVString, textOptions ),
      radioButtonOptions );

    var content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        titleNode,
        nothingRadioButton,
        volumeRadioButton,
        temperatureRadioButton,
        pressureTRadioButton,
        pressureVRadioButton
      ]
    } );

    var strut = new HStrut( options.fixedWidth - ( 2 * options.xMargin ) );

    Panel.call( this, new Node( { children: [ strut, content ] } ), options );
  }

  gasProperties.register( 'HoldConstantPanel', HoldConstantPanel );

  return inherit( Panel, HoldConstantPanel );
} );
 