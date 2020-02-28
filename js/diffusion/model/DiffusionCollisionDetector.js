// Copyright 2019-2020, University of Colorado Boulder

/**
 * DiffusionCollisionDetector is a specialization of CollisionDetector that handles collisions between
 * particles and a vertical divider in a DiffusionContainer.  When the divider is present, it treats the
 * 2 sides of the container as 2 separate containers.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import GasPropertiesUtils from '../../common/GasPropertiesUtils.js';
import CollisionDetector from '../../common/model/CollisionDetector.js';
import gasProperties from '../../gasProperties.js';
import DiffusionContainer from './DiffusionContainer.js';
import DiffusionParticle1 from './DiffusionParticle1.js';
import DiffusionParticle2 from './DiffusionParticle2.js';

class DiffusionCollisionDetector extends CollisionDetector {

  /**
   * @param {DiffusionContainer} container
   * @param {DiffusionParticle1[]} particles1
   * @param {DiffusionParticle2[]} particles2
   * @param {Object} [options]
   */
  constructor( container, particles1, particles2, options ) {
    assert && assert( container instanceof DiffusionContainer, `invalid container: ${container}` );
    assert && assert( GasPropertiesUtils.isArrayOf( particles1, DiffusionParticle1 ),
      `invalid particles1: ${particles1}` );
    assert && assert( GasPropertiesUtils.isArrayOf( particles2, DiffusionParticle2 ),
      `invalid particles2: ${particles2}` );

    super( container, [ particles1, particles2 ], new BooleanProperty( true ), options );
  }

  /**
   * Detects and handles particle-container collisions for the system for one time step.
   * @returns {number} the number of collisions
   * @protected
   * @override
   */
  updateParticleContainerCollisions() {

    let numberOfParticleContainerCollisions = 0;
    if ( this.container.hasDividerProperty.value ) {

      // If the divider is in place, treat the 2 sides of the container as 2 separate containers.
      const leftWallVelocity = Vector2.ZERO;
      numberOfParticleContainerCollisions += CollisionDetector.doParticleContainerCollisions(
        this.particleArrays[ 0 ], this.container.leftBounds, leftWallVelocity );
      numberOfParticleContainerCollisions += CollisionDetector.doParticleContainerCollisions(
        this.particleArrays[ 1 ], this.container.rightBounds, leftWallVelocity );
    }
    else {

      // If there is no divider, use default behavior.
      numberOfParticleContainerCollisions = super.updateParticleContainerCollisions();
    }
    return numberOfParticleContainerCollisions;
  }
}

gasProperties.register( 'DiffusionCollisionDetector', DiffusionCollisionDetector );
export default DiffusionCollisionDetector;