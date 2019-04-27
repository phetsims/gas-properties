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
  const TAIL_LENGTH_PER_PARTICLE = 20;
  const REFRESH_INTERVAL = 1; // ps

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
      this.numberToLeft = 0;
      this.numberToRight = 0;
      this.dtAccumulator = 0;
    }

    /**
     * Updates the vectors.
     * @param {number} dt - time delta, in ps
     * @public
     */
    step( dt ) {

      this.dtAccumulator += dt;

      for ( let i = 0; i < this.particles.length; i++ ) {
        const particle = this.particles[ i ];
        if ( particle.previousLocation.x <= this.dividerX && particle.location.x > this.dividerX ) {
          this.numberToRight++;
        }
        else if ( particle.previousLocation.x >= this.dividerX && particle.location.x < this.dividerX ) {
          this.numberToLeft++;
        }
      }

      if ( this.dtAccumulator >= REFRESH_INTERVAL ) {
        
        this.leftArrowNode.visible = ( this.numberToLeft > 0 );
        this.leftArrowNode.setTip( -( this.minTailLength + this.numberToLeft * TAIL_LENGTH_PER_PARTICLE ), 0 );
        this.numberToLeft = 0;

        this.rightArrowNode.visible = ( this.numberToRight > 0 );
        this.rightArrowNode.setTip( this.minTailLength + this.numberToRight * TAIL_LENGTH_PER_PARTICLE, 0 );
        this.numberToRight = 0;

        this.dtAccumulator = this.dtAccumulator - REFRESH_INTERVAL; //TODO or just set to zero?
      }
    }
  }

  return gasProperties.register( 'ParticleFlowRateNode', ParticleFlowRateNode );
} );