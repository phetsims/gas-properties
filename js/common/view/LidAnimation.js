// Copyright 2019, University of Colorado Boulder

//TODO #64 what should lid animation look like?
//TODO #64 lid animation should be tied to sim play/pause/step
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

      // Randomly rotate 1 degree about the center of the lid.
      let numberOfSteps = 0;
      this.updateEmitter.addListener( () => {
        numberOfSteps++;
        if ( numberOfSteps % 10 === 0 ) {
          lidNode.setRotation( 0 );
          lidNode.rotateAround( lidNode.center, phet.joist.random.nextIntBetween( -1, 1 ) * Math.PI / 180 );
        }
      } );
    }
  }

  return gasProperties.register( 'LidAnimation', LidAnimation );
} );