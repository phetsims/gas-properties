// Copyright 2019, University of Colorado Boulder

//TODO what should this look like?
//TODO make animation adapt to change of visibleBoundsProperty.value.top
//TODO make animation constant speed, regardless of where visibleBoundsProperty.value.top
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
     * @param {Property.<Bounds2>} visibleBoundsProperty
     */
    constructor( lidNode, visibleBoundsProperty ) {
      super( {
        duration: 1, // seconds
        easing: Easing.LINEAR,
        object: lidNode,
        attribute: 'y',
        to: visibleBoundsProperty.value.top
      } );
    }
  }

  return gasProperties.register( 'LidAnimation', LidAnimation );
} );