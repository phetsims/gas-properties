// Copyright 2018, University of Colorado Boulder

/**
 * Model for the 'KMT' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   */
  function KMTModel() {
    //TODO
  }

  gasProperties.register( 'KMTModel', KMTModel );

  return inherit( Object, KMTModel, {

    // @public resets the model
    reset: function() {
      //TODO reset things here
    },

    //TODO Called by the animation loop. Optional, so if your model has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle model animation here.
    }
  } );
} );