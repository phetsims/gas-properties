// Copyright 2018, University of Colorado Boulder

/**
 * The view for the 'KMT' screen.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {KMTModel} model
   * @constructor
   */
  function KMTScreenView( model ) {

    ScreenView.call( this );

    //TODO delete this
    var underConstruction = new Text( 'KMT: under construction', {
      font: new PhetFont( 35 ),
      center: this.layoutBounds.center
    } );
    this.addChild( underConstruction );

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

  gasProperties.register( 'KMTScreenView', KMTScreenView );

  return inherit( ScreenView, KMTScreenView, {

    //TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle view animation here.
    }
  } );
} );