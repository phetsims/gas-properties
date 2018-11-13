// Copyright 2018, University of Colorado Boulder

/**
 * The view for the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const gasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/gasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Text = require( 'SCENERY/nodes/Text' );

  class EnergyScreenView extends ScreenView {

    /**
     * @param {EnergyModel} model
     */
    constructor( model ) {

      super();

      //TODO delete this
      const underConstruction = new Text( 'Energy - under construction', {
        font: new PhetFont( 35 ),
        fill: gasPropertiesColorProfile.textFillProperty,
        center: this.layoutBounds.center
      } );
      this.addChild( underConstruction );

      // Reset All button
      const resetAllButton = new ResetAllButton( {
        listener: () => {
          model.reset();
        },
        right: this.layoutBounds.maxX - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        bottom: this.layoutBounds.maxY - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
      } );
      this.addChild( resetAllButton );
    }
  }

  return gasProperties.register( 'EnergyScreenView', EnergyScreenView );
} );