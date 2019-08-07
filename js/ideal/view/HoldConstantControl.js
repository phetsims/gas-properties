// Copyright 2018-2019, University of Colorado Boulder

/**
 * HoldConstantControl is the control for selecting which quantity should be held constant.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HoldConstant = require( 'GAS_PROPERTIES/common/model/HoldConstant' );
  const Property = require( 'AXON/Property' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Tandem = require( 'TANDEM/Tandem' );
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
     * @param {Property.<number>>} numberOfParticlesProperty
     * @param {NumberProperty} pressureProperty
     * @param {BooleanProperty} isContainerOpenProperty
     * @param {Object} [options]
     */
    constructor( holdConstantProperty, numberOfParticlesProperty, pressureProperty, isContainerOpenProperty, options ) {
      assert && assert( holdConstantProperty instanceof EnumerationProperty,
        `invalid holdConstantProperty: ${holdConstantProperty}` );
      assert && assert( numberOfParticlesProperty instanceof Property,
        `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );
      assert && assert( pressureProperty instanceof NumberProperty,
        `invalid pressureProperty: ${pressureProperty}` );
      assert && assert( isContainerOpenProperty instanceof Property,
              `invalid isContainerOpenProperty: ${isContainerOpenProperty}` );

      options = _.extend( {

        // superclass options
        align: 'left',
        spacing: SPACING,

        // phet-io
        tandem: Tandem.required
      }, options );

      const titleNode = new Text( holdConstantString, {
        font: GasPropertiesConstants.TITLE_FONT,
        fill: GasPropertiesColorProfile.textFillProperty,
        maxWidth: 200 // determined empirically
      } );

      // Nothing
      const nothingRadioButton = new AquaRadioButton( holdConstantProperty, HoldConstant.NOTHING,
        new Text( holdConstantNothingString, TEXT_OPTIONS ),
        GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS );

      // Volume (V)
      const volumeRadioButton = new AquaRadioButton( holdConstantProperty, HoldConstant.VOLUME,
        new Text( holdConstantVolumeString, TEXT_OPTIONS ),
        GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS );

      // Temperature (T)
      const temperatureRadioButton = new AquaRadioButton( holdConstantProperty, HoldConstant.TEMPERATURE,
        new Text( holdConstantTemperatureString, TEXT_OPTIONS ),
        GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS );

      // Pressure V
      const pressureVRadioButton = new AquaRadioButton( holdConstantProperty, HoldConstant.PRESSURE_V,
        new Text( holdConstantPressureVString, TEXT_OPTIONS ),
        GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS );

      // Pressure T
      const pressureTRadioButton = new AquaRadioButton( holdConstantProperty, HoldConstant.PRESSURE_T,
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

      // Disable "Temperature (T)" radio button for conditions that are not possible.
      Property.multilink(
        [ numberOfParticlesProperty, isContainerOpenProperty ],
        ( numberOfParticles, isContainerOpen ) => {
          temperatureRadioButton.enabledProperty.value = ( numberOfParticles !== 0 ) && !isContainerOpen;
        } );

      // Disable radio buttons for selections that are not possible with zero pressure.
      pressureProperty.link( pressure => {
        pressureVRadioButton.enabledProperty.value = ( pressure !== 0 );
        pressureTRadioButton.enabledProperty.value = ( pressure !== 0 );
      } );
    }
  }

  return gasProperties.register( 'HoldConstantControl', HoldConstantControl );
} );