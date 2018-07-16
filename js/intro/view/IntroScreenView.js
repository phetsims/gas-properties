// Copyright 2018, University of Colorado Boulder

/**
 * The view for the 'Intro' screen.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  /**
   * @param {IntroModel} model
   * @constructor
   */
  function IntroScreenView( model ) {

    ScreenView.call( this );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
  }

  gasProperties.register( 'IntroScreenView', IntroScreenView );

  return inherit( ScreenView, IntroScreenView, {

    //TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle view animation here.
    }
  } );
} );