// Copyright 2019, University of Colorado Boulder

/**
 * Control for changing the timescale, a pair of radio buttons.
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
  const Text = require( 'SCENERY/nodes/Text' );
  const Timescale = require( 'GAS_PROPERTIES/diffusion/model/Timescale' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const normalString = require( 'string!GAS_PROPERTIES/normal' );
  const slowString = require( 'string!GAS_PROPERTIES/slow' );

  class TimescaleControl extends VBox {

    /**
     * @param {EnumerationProperty} timescaleProperty
     * @param {Object} [options]
     */
    constructor( timescaleProperty, options ) {

      options = _.extend( {
        spacing: 10,
        align: 'left'
      }, options );

      const textOptions = {
        font: GasPropertiesConstants.CONTROL_FONT,
        fill: GasPropertiesColorProfile.textFillProperty,
        maxWidth: 85 // determined empirically
      };

      assert && assert( !options.children, 'DiffusionTimeControls sets children' );
      options = _.extend( {
        children: [
          new AquaRadioButton( timescaleProperty, Timescale.NORMAL, new Text( normalString, textOptions ),
            GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS ),
          new AquaRadioButton( timescaleProperty, Timescale.SLOW, new Text( slowString, textOptions ),
            GasPropertiesConstants.AQUA_RADIO_BUTTON_OPTIONS )
        ]
      }, options );

      super( options );
    }
  }

  return gasProperties.register( 'TimescaleControl', TimescaleControl );
} );