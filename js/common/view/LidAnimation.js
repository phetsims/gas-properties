// Copyright 2019, University of Colorado Boulder

/**
 * Animation for when the lid blows off of the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Animation = require( 'TWIXT/Animation' );
  const Easing = require( 'TWIXT/Easing' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  class LidAnimation extends Animation {

    /**
     * @param {Node} lidNode
     * @param {Property.<Bounds2>} modelBoundsProperty
     */
    constructor( lidNode, modelBoundsProperty ) {
      super( {
        duration: 1, // seconds
        easing: Easing.LINEAR,
        object: lidNode,
        attribute: 'y',
        to: -100
      } );
    }
  }

  return gasProperties.register( 'LidAnimation', LidAnimation );
} );