// Copyright 2018-2019, University of Colorado Boulder

/**
 * Control for selecting what should be held constant.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HoldConstantEnum = require( 'GAS_PROPERTIES/common/model/HoldConstantEnum' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
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

  class HoldConstantControl extends VBox {

    /**
     * @param {StringProperty} holdConstantProperty
     * @param {Object} [options]
     */
    constructor( holdConstantProperty, options ) {

      options = _.extend( {
        align: 'left',
        spacing: 12
      }, options );

      const titleNode = new Text( holdConstantString, {
        font: GasPropertiesConstants.TITLE_FONT,
        fill: GasPropertiesColorProfile.textFillProperty,
        maxWidth: 200 // determined empirically
      } );

      const items = [
        { value: HoldConstantEnum.NOTHING, node: new Text( holdConstantNothingString, TEXT_OPTIONS ) },
        { value: HoldConstantEnum.VOLUME, node: new Text( holdConstantVolumeString, TEXT_OPTIONS ) },
        { value: HoldConstantEnum.TEMPERATURE, node: new Text( holdConstantTemperatureString, TEXT_OPTIONS ) },
        { value: HoldConstantEnum.PRESSURE_V, node: new Text( holdConstantPressureVString, TEXT_OPTIONS ) },
        { value: HoldConstantEnum.PRESSURE_T, node: new Text( holdConstantPressureTString, TEXT_OPTIONS ) }
      ];

      const radioButtonGroup = new VerticalAquaRadioButtonGroup( holdConstantProperty, items, {
        align: 'left',
        spacing: 12,
        radioButtonOptions: GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS
      } );

      assert && assert( !options.children, 'HoldConstantControl sets children' );
      options = _.extend( {
        children: [ titleNode, radioButtonGroup ]
      }, options );

      super( options );
    }
  }

  return gasProperties.register( 'HoldConstantControl', HoldConstantControl );
} );