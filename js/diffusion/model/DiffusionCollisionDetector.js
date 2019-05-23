// Copyright 2019, University of Colorado Boulder

/**
 * DiffusionCollisionDetector is a specialization of CollisionDetector that handles collisions between
 * particles and a vertical divider in a DiffusionContainer.  When the divider is present, it treat the
 * 2 sides of the container as 2 separate containers.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const CollisionDetector = require( 'GAS_PROPERTIES/common/model/CollisionDetector' );
  const DiffusionContainer = require( 'GAS_PROPERTIES/diffusion/model/DiffusionContainer' );
  const Vector2 = require( 'DOT/Vector2' );

  class DiffusionCollisionDetector extends CollisionDetector {

    /**
     * @param {DiffusionContainer} container
     * @param {DiffusionParticle1[]} particles1
     * @param {DiffusionParticle2[]} particles2
     * @param {Object} [options]
     */
    constructor( container, particles1, particles2, options ) {
      assert && assert( container instanceof DiffusionContainer, 'invalid container' );
      super( container, [ particles1, particles2 ], options );
    }

    /**
     * Detects and handles particle-container collisions for the system for one time step.
     * @param {number} dt
     * @returns {number} the number of collisions
     * @protected
     * @override
     */
    stepParticleContainerCollisions( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
      let numberOfParticleContainerCollisions = 0;
      if ( this.container.hasDividerProperty.value ) {

        // If the divider is in place, treat the 2 sides of the container as 2 separate containers.
        const leftWallVelocity = Vector2.ZERO;
        numberOfParticleContainerCollisions +=
          CollisionDetector.doParticleContainerCollisions( this.particleArrays[ 0 ], this.container.leftBounds, leftWallVelocity );
        numberOfParticleContainerCollisions +=
          CollisionDetector.doParticleContainerCollisions( this.particleArrays[ 1 ], this.container.rightBounds, leftWallVelocity );
      }
      else {

        // If there is no divider, use default behavior.
        numberOfParticleContainerCollisions = super.stepParticleContainerCollisions( dt );
      }
      return numberOfParticleContainerCollisions;
    }
  }

  return gasProperties.register( 'DiffusionCollisionDetector', DiffusionCollisionDetector );
} );