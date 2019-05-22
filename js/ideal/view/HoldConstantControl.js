// Copyright 2018-2019, University of Colorado Boulder

/**
 * Control for selecting what should be held constant.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HoldConstantEnum = require( 'GAS_PROPERTIES/common/model/HoldConstantEnum' );
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
  const TEXT_OPTIONS = {
    font: GasPropertiesConstants.CONTROL_FONT,
    fill: GasPropertiesColorProfile.textFillProperty,
    maxWidth: 175 // determined empirically
  };
  const SPACING = 12;

  class HoldConstantControl extends VBox {

    /**
     * @param {EnumerationProperty} holdConstantProperty
     * @param {NumberProperty} totalNumberOfParticlesProperty
     * @param {Object} [options]
     */
    constructor( holdConstantProperty, totalNumberOfParticlesProperty, options ) {

      options = _.extend( {
        align: 'left',
        spacing: SPACING
      }, options );

      const titleNode = new Text( holdConstantString, {
        font: GasPropertiesConstants.TITLE_FONT,
        fill: GasPropertiesColorProfile.textFillProperty,
        maxWidth: 200 // determined empirically
      } );

      // Nothing
      const nothingRadioButton = new AquaRadioButton( holdConstantProperty, HoldConstantEnum.NOTHING,
        new Text( holdConstantNothingString, TEXT_OPTIONS ),
        GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS );

      // Volume (V)
      const volumeRadioButton = new AquaRadioButton( holdConstantProperty, HoldConstantEnum.VOLUME,
        new Text( holdConstantVolumeString, TEXT_OPTIONS ),
        GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS );

      // Temperature (T)
      const temperatureRadioButton = new AquaRadioButton( holdConstantProperty, HoldConstantEnum.TEMPERATURE,
        new Text( holdConstantTemperatureString, TEXT_OPTIONS ),
        GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS );

      // Pressure V
      const pressureVRadioButton = new AquaRadioButton( holdConstantProperty, HoldConstantEnum.PRESSURE_V,
        new Text( holdConstantPressureVString, TEXT_OPTIONS ),
        GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS );

      // Pressure T
      const pressureTRadioButton = new AquaRadioButton( holdConstantProperty, HoldConstantEnum.PRESSURE_T,
        new Text( holdConstantPressureTString, TEXT_OPTIONS ),
        GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS );

      const radioButtonGroup = new VBox( {
        align: 'left',
        spacing: SPACING,
        children: [
          nothingRadioButton,
          volumeRadioButton,
          temperatureRadioButton,
          pressureVRadioButton,
          pressureTRadioButton
        ]
      } );

      assert && assert( !options.children, 'HoldConstantControl sets children' );
      options = _.extend( {
        children: [ titleNode, radioButtonGroup ]
      }, options );

      super( options );

      // Disable radio buttons for selections that are not possible when the container is empty.
      totalNumberOfParticlesProperty.link( totalNumberOfParticles => {
        temperatureRadioButton.enabledProperty.value = ( totalNumberOfParticles !== 0 );
        pressureVRadioButton.enabledProperty.value = ( totalNumberOfParticles !== 0 );
        pressureTRadioButton.enabledProperty.value = ( totalNumberOfParticles !== 0 );
      } );
    }
  }

  return gasProperties.register( 'HoldConstantControl', HoldConstantControl );
} );