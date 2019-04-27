// Copyright 2019, University of Colorado Boulder

/**
 * Vectors that indicate the flow rate of particles between the left and right sides of the container.
 * Higher flow rate results in a bigger vector.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Node = require( 'SCENERY/nodes/Node' );

  // constants
  const X_SPACING = 5;
  const TAIL_LENGTH_PER_PARTICLE = 10;

  class ParticleFlowRateNode extends Node {

    /**
     * @param {number} dividerX - x coordinate of the container's divider
     * @param {Particle[]} particles
     * @param {Object} [options]
     */
    constructor( dividerX, particles, options ) {

      options = _.extend( {
        arrowNodeOptions: null // nested options, set below
      }, options );

      options.arrowNodeOptions = _.extend( {
        headHeight: 15,
        headWidth: 15,
        tailWidth: 8,
        fill: 'white',
        stroke: 'black'
      }, options.arrowNodeOptions );

      // left and right arrows
      const leftArrowNode = new ArrowNode( 0, 0, -20, 0, options.arrowNodeOptions );
      const rightArrowNode = new ArrowNode( 0, 0, 20, 0, options.arrowNodeOptions );

      // origin is between the tails of the 2 arrows 
      leftArrowNode.x = -X_SPACING / 2;
      rightArrowNode.x = X_SPACING / 2;

      assert && assert( !options.children, 'ParticleFlowRateNode sets options' );
      options = _.extend( {
        children: [ leftArrowNode, rightArrowNode ]
      }, options );

      super( options );

      // @private
      this.dividerX = dividerX;
      this.particles = particles;
      this.leftArrowNode = leftArrowNode;
      this.rightArrowNode = rightArrowNode;
      this.minTailLength = options.arrowNodeOptions.headHeight + 4;
    }

    /**
     * Updates the vectors.
     * @param {number} dt - time delta, in ps
     * @public
     */
    step( dt ) {

      let numberToLeft = 0;
      let numberToRight = 0;

      for ( let i = 0; i < this.particles.length; i++ ) {
        const particle = this.particles[ i ];
        if ( particle.previousLocation.x <= this.dividerX && particle.location.x > this.dividerX ) {
          numberToRight++;
        }
        else if ( particle.previousLocation.x >= this.dividerX && particle.location.x < this.dividerX ) {
          numberToLeft++;
        }
      }

      this.leftArrowNode.visible = ( numberToLeft > 0 );
      this.leftArrowNode.setTip( -( this.minTailLength + numberToLeft * TAIL_LENGTH_PER_PARTICLE ), 0 );

      this.rightArrowNode.visible = ( numberToRight > 0 );
      this.rightArrowNode.setTip( this.minTailLength + numberToRight * TAIL_LENGTH_PER_PARTICLE, 0 );
    }
  }

  return gasProperties.register( 'ParticleFlowRateNode', ParticleFlowRateNode );
} );