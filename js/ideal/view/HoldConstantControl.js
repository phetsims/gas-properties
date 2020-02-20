// Copyright 2018-2019, University of Colorado Boulder

/**
 * HoldConstantControl is the control for selecting which quantity should be held constant.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AquaRadioButtonGroup = require( 'SUN/AquaRadioButtonGroup' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HoldConstant = require( 'GAS_PROPERTIES/common/model/HoldConstant' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
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

      options = merge( {

        // superclass options
        align: 'left',
        spacing: SPACING,

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      const titleNode = new Text( holdConstantString, {
        font: GasPropertiesConstants.TITLE_FONT,
        fill: GasPropertiesColorProfile.textFillProperty,
        maxWidth: 200 // determined empirically
      } );

      const items = [
        { value: HoldConstant.NOTHING, node: new Text( holdConstantNothingString, TEXT_OPTIONS ) },
        { value: HoldConstant.VOLUME, node: new Text( holdConstantVolumeString, TEXT_OPTIONS ) },
        { value: HoldConstant.TEMPERATURE, node: new Text( holdConstantTemperatureString, TEXT_OPTIONS ) },
        { value: HoldConstant.PRESSURE_V, node: new Text( holdConstantPressureVString, TEXT_OPTIONS ) },
        { value: HoldConstant.PRESSURE_T, node: new Text( holdConstantPressureTString, TEXT_OPTIONS ) }
      ];

      const radioButtonGroup = new AquaRadioButtonGroup( holdConstantProperty, items, {
        radioButtonOptions: GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS,
        orientation: 'vertical',
        align: 'left',
        spacing: SPACING
      } );

      assert && assert( !options.children, 'HoldConstantControl sets children' );
      options = merge( {
        children: [ titleNode, radioButtonGroup ]
      }, options );

      super( options );

      // Disable "Temperature (T)" radio button for conditions that are not possible.
      const temperatureRadioButton = radioButtonGroup.getButton( HoldConstant.TEMPERATURE );
      Property.multilink(
        [ numberOfParticlesProperty, isContainerOpenProperty ],
        ( numberOfParticles, isContainerOpen ) => {
          temperatureRadioButton.enabledProperty.value = ( numberOfParticles !== 0 ) && !isContainerOpen;
        } );

      // Disable radio buttons for selections that are not possible with zero pressure.
      const pressureVRadioButton = radioButtonGroup.getButton( HoldConstant.PRESSURE_V );
      const pressureTRadioButton = radioButtonGroup.getButton( HoldConstant.PRESSURE_T );
      pressureProperty.link( pressure => {
        pressureVRadioButton.enabledProperty.value = ( pressure !== 0 );
        pressureTRadioButton.enabledProperty.value = ( pressure !== 0 );
      } );
    }
  }

  return gasProperties.register( 'HoldConstantControl', HoldConstantControl );
} );