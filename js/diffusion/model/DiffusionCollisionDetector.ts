// Copyright 2019-2022, University of Colorado Boulder

/**
 * DiffusionCollisionDetector is a specialization of CollisionDetector that handles collisions between
 * particles and a vertical divider in a DiffusionContainer.  When the divider is present, it treats the
 * 2 sides of the container as 2 separate containers.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CollisionDetector from '../../common/model/CollisionDetector.js';
import gasProperties from '../../gasProperties.js';
import DiffusionContainer from './DiffusionContainer.js';
import DiffusionParticle1 from './DiffusionParticle1.js';
import DiffusionParticle2 from './DiffusionParticle2.js';

export default class DiffusionCollisionDetector extends CollisionDetector {

  private readonly diffusionContainer: DiffusionContainer;

  public constructor( diffusionContainer: DiffusionContainer,
                      particles1: DiffusionParticle1[],
                      particles2: DiffusionParticle2[] ) {
    super( diffusionContainer, [ particles1, particles2 ], new BooleanProperty( true ) );
    this.diffusionContainer = diffusionContainer;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Detects and handles particle-container collisions for the system for one time step.
   * Returns the number of collisions
   */
  protected override updateParticleContainerCollisions(): number {

    let numberOfParticleContainerCollisions = 0;
    if ( this.diffusionContainer.hasDividerProperty.value ) {

      // If the divider is in place, treat the 2 sides of the container as 2 separate containers.
      const leftWallVelocity = Vector2.ZERO;
      numberOfParticleContainerCollisions += CollisionDetector.doParticleContainerCollisions(
        this.particleArrays[ 0 ], this.diffusionContainer.leftBounds, leftWallVelocity );
      numberOfParticleContainerCollisions += CollisionDetector.doParticleContainerCollisions(
        this.particleArrays[ 1 ], this.diffusionContainer.rightBounds, leftWallVelocity );
    }
    else {

      // If there is no divider, use default behavior.
      numberOfParticleContainerCollisions = super.updateParticleContainerCollisions();
    }
    return numberOfParticleContainerCollisions;
  }
}

gasProperties.register( 'DiffusionCollisionDetector', DiffusionCollisionDetector );