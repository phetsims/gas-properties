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
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Node = require( 'SCENERY/nodes/Node' );

  // constants
  const X_SPACING = 5;
  const Y_SPACING = 5;
  const ARROW_OPTIONS = {
    headHeight: 15,
    headWidth: 15,
    tailWidth: 8,
    stroke: 'black'
  };
  const ARROW1_OPTIONS = _.extend( {}, ARROW_OPTIONS, {
    fill: GasPropertiesColorProfile.particle1ColorProperty
  } );
  const ARROW2_OPTIONS = _.extend( {}, ARROW_OPTIONS, {
    fill: GasPropertiesColorProfile.particle2ColorProperty
  } );
  const MIN_TAIL_LENGTH = ARROW_OPTIONS.headHeight + 4;
  const TAIL_LENGTH_PER_PARTICLE = 10;

  class ParticleFlowRatesNode extends Node {

    /**
     * @param {number} dividerX - x coordinate of the container's divider
     * @param {Particle[]} particles1
     * @param {Particle[]} particles2
     * @param {Object} [options]
     */
    constructor( dividerX, particles1, particles2, options ) {

      options = options || {};

      // @private left and right arrows for particles1
      const leftArrowNode1 = new ArrowNode( 0, 0, -MIN_TAIL_LENGTH, 0, ARROW1_OPTIONS );
      const rightArrowNode1 = new ArrowNode( 0, 0, MIN_TAIL_LENGTH, 0, ARROW1_OPTIONS );

      // left and right arrows for particles2
      const leftArrowNode2 = new ArrowNode( 0, 0, -MIN_TAIL_LENGTH, 0, ARROW2_OPTIONS );
      const rightArrowNode2 = new ArrowNode( 0, 0, MIN_TAIL_LENGTH, 0, ARROW2_OPTIONS );

      // layout that looks something like this:
      //
      //    <---  --->
      //   <----  --->
      //
      leftArrowNode1.x = -X_SPACING / 2;
      rightArrowNode1.x = X_SPACING / 2;
      leftArrowNode2.top = leftArrowNode1.bottom + Y_SPACING;
      leftArrowNode2.x = -X_SPACING / 2;
      rightArrowNode2.x = X_SPACING / 2;
      rightArrowNode2.top = rightArrowNode1.bottom + Y_SPACING;

      assert && assert( !options.children, 'ParticleFlowRatesNode sets options' );
      options = _.extend( {
        children: [
          leftArrowNode1, rightArrowNode1,
          leftArrowNode2, rightArrowNode2
        ]
      }, options );

      super( options );

      // @private
      this.dividerX = dividerX;
      this.particles1 = particles1;
      this.particles2 = particles2;
      this.leftArrowNode1 = leftArrowNode1;
      this.rightArrowNode1 = rightArrowNode1;
      this.leftArrowNode2 = leftArrowNode2;
      this.rightArrowNode2 = rightArrowNode2;
    }

    /**
     * Updates the vectors.
     * @param {number} dt - time delta, in ps
     * @public
     */
    step( dt ) {
      this.update( this.particles1, this.leftArrowNode1, this.rightArrowNode1 ); 
      this.update( this.particles2, this.leftArrowNode2, this.rightArrowNode2 ); 
    }

    /**
     * Updates vectors for one set of particles.
     * @param {Particle[]} particles
     * @param {ArrowNode} leftArrowNode
     * @param {ArrowNode} rightArrowNode
     */
    update( particles, leftArrowNode, rightArrowNode ) {

      let numberToLeft = 0;
      let numberToRight = 0;

      for ( let i = 0; i < particles.length; i++ ) {
        const particle = particles[ i ];
        if ( particle.previousLocation.x <= this.dividerX && particle.location.x > this.dividerX ) {
          numberToRight++;
        }
        else if ( particle.previousLocation.x >= this.dividerX && particle.location.x < this.dividerX ) {
          numberToLeft++;
        }
      }
      
      leftArrowNode.visible = ( numberToLeft > 0 );
      leftArrowNode.setTip( -( MIN_TAIL_LENGTH + numberToLeft * TAIL_LENGTH_PER_PARTICLE ), 0 );
      
      rightArrowNode.visible = ( numberToRight > 0 );
      rightArrowNode.setTip( MIN_TAIL_LENGTH + numberToRight * TAIL_LENGTH_PER_PARTICLE, 0 );
    }
  }

  return gasProperties.register( 'ParticleFlowRatesNode', ParticleFlowRatesNode );
} );