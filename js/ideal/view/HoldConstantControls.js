// Copyright 2018, University of Colorado Boulder

/**
 * Controls for selecting what should be held constant.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const holdConstantNothingString = require( 'string!GAS_PROPERTIES/holdConstant.nothing' );
  const holdConstantPressureTString = require( 'string!GAS_PROPERTIES/holdConstant.pressureT' );
  const holdConstantPressureVString = require( 'string!GAS_PROPERTIES/holdConstant.pressureV' );
  const holdConstantString = require( 'string!GAS_PROPERTIES/holdConstant' );
  const holdConstantTemperatureString = require( 'string!GAS_PROPERTIES/holdConstant.temperature' );
  const holdConstantVolumeString = require( 'string!GAS_PROPERTIES/holdConstant.volume' );

  // constants
  const RADIO_BUTTON_OPTIONS = {
    radius: 10,
    xSpacing: 10
  };
  const TEXT_OPTIONS = {
    font: GasPropertiesConstants.CONTROL_FONT,
    fill: GasPropertiesColors.FOREGROUND_COLOR
  };
  
  class HoldConstantControls extends VBox {

    /**
     * @param {StringProperty} holdConstantProperty
     * @param {Object} [options]
     */
    constructor( holdConstantProperty, options ) {

      options = _.extend( {}, GasPropertiesConstants.VBOX_OPTIONS, options );

      const titleNode = new Text( holdConstantString, {
        font: GasPropertiesConstants.TITLE_FONT,
        fill: GasPropertiesColors.FOREGROUND_COLOR
      } );

      const nothingRadioButton = new AquaRadioButton( holdConstantProperty, 'nothing',
        new Text( holdConstantNothingString, TEXT_OPTIONS ),
        RADIO_BUTTON_OPTIONS );

      const volumeRadioButton = new AquaRadioButton( holdConstantProperty, 'volume',
        new Text( holdConstantVolumeString, TEXT_OPTIONS ),
        RADIO_BUTTON_OPTIONS );

      const temperatureRadioButton = new AquaRadioButton( holdConstantProperty, 'temperature',
        new Text( holdConstantTemperatureString, TEXT_OPTIONS ),
        RADIO_BUTTON_OPTIONS );

      const pressureVRadioButton = new AquaRadioButton( holdConstantProperty, 'pressureV',
        new Text( holdConstantPressureVString, TEXT_OPTIONS ),
        RADIO_BUTTON_OPTIONS );

      const pressureTRadioButton = new AquaRadioButton( holdConstantProperty, 'pressureT',
        new Text( holdConstantPressureTString, TEXT_OPTIONS ),
        RADIO_BUTTON_OPTIONS );

      assert && assert( !options.children, 'sets children' );
      options.children = [
        titleNode,
        nothingRadioButton,
        volumeRadioButton,
        temperatureRadioButton,
        pressureVRadioButton,
        pressureTRadioButton
      ];

      super( options );
    }
  }

  return gasProperties.register( 'HoldConstantControls', HoldConstantControls );
} );