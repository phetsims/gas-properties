// Copyright 2019, University of Colorado Boulder

/**
 * ReturnLidButton is used to return the container's lid after it has been blown off.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const IdealGasLawContainer = require( 'GAS_PROPERTIES/common/model/IdealGasLawContainer' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const returnLidString = require( 'string!GAS_PROPERTIES/returnLid' );

  class ReturnLidButton extends RectangularPushButton {

    /**
     * @param {IdealGasLawContainer} container
     * @param {Object} [options]
     */
    constructor( container, options ) {
      assert && assert( container instanceof IdealGasLawContainer, `invalid container: ${container}` );

      options = merge( {

        // superclass options
        baseColor: PhetColorScheme.BUTTON_YELLOW
      }, options );

      const textNode = new Text( returnLidString, {
        font: GasPropertiesConstants.CONTROL_FONT,
        maxWidth: 150 // determined empirically
      } );

      const buttonListener = () => {
        container.lidIsOnProperty.value = true;
      };

      assert && assert( !options.content, 'ReturnLidButton sets content' );
      assert && assert( !options.listener, 'ReturnLidButton sets listener' );
      options = merge( {
        content: textNode,
        listener: buttonListener
      }, options );

      super( options );

      // Button is visible immediately, so it's possible to push it and repeatedly blow the lid off.
      container.lidIsOnProperty.link( lidIsOn => {
        this.visible = !lidIsOn;
      } );
    }
  }

  return gasProperties.register( 'ReturnLidButton', ReturnLidButton );
} );