// Copyright 2018, University of Colorado Boulder

/**
 * Model for the 'Work' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  /**
   * @constructor
   */
  function WorkModel() {
    //TODO
  }

  gasProperties.register( 'WorkModel', WorkModel );

  return inherit( Object, WorkModel, {

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