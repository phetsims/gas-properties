// Copyright 2018, University of Colorado Boulder

/**
 * The view for the 'Work' screen.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  var GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {WorkModel} model
   * @constructor
   */
  function WorkScreenView( model ) {

    ScreenView.call( this );

    //TODO delete this
    var underConstruction = new Text( 'Work: under construction', {
      font: new PhetFont( 35 ),
      fill: GasPropertiesColors.FOREGROUND_COLOR,
      center: this.layoutBounds.center
    } );
    this.addChild( underConstruction );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right:  this.layoutBounds.maxX - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( resetAllButton );
  }

  gasProperties.register( 'WorkScreenView', WorkScreenView );

  return inherit( ScreenView, WorkScreenView, {

    //TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle view animation here.
    }
  } );
} );