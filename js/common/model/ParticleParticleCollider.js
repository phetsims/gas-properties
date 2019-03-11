// Copyright 2019, University of Colorado Boulder

//TODO see Java SphereSphereExpert, SphereSphereContactDetector, SphereSphereCollision
/**
 * Detects and handles particle-particle collisions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  class ParticleParticleCollider {

    constructor() {
      //TODO does this need to be a class?
    }

    /**
     * Detects and handles collision between 2 particles.
     * @param particle1
     * @param particle2
     * @returns {boolean} true if the particles collided, false otherwise
     */
    doCollision( particle1, particle2 ) {
      assert && assert( particle1 !== particle2, 'particles are the same instance' );
      let collided = false;

      if ( !particle1.contacted( particle2 ) && particle1.contacts( particle2 ) ) {
        collided = true;

        //TODO temporary, to do something
        particle1.setVelocity( particle1.velocity.magnitude, phet.joist.random.nextDouble() * 2 * Math.PI );
        particle2.setVelocity( particle2.velocity.magnitude, phet.joist.random.nextDouble() * 2 * Math.PI );
      }

      return collided;
    }
  }

  return gasProperties.register( 'ParticleParticleCollider', ParticleParticleCollider );
} );