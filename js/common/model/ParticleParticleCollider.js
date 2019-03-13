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
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );

  class ParticleParticleCollider {

    constructor() {
      //TODO does this need to be a class?
    }

    /**
     * Detects and handles collision between 2 particles.
     * @param particle1
     * @param particle2
     * @public
     */
    doCollision( particle1, particle2 ) {
      assert && assert( particle1 instanceof Particle, 'particle1 is not a Particle' );
      assert && assert( particle2 instanceof Particle, 'particle2 is not a Particle' );
      assert && assert( particle1 !== particle2, 'particles are the same instance' );

      if ( !particle1.contactedParticle( particle2 ) && particle1.contactsParticle( particle2 ) ) {

        //TODO temporary, to do something
        particle1.setVelocityPolar( particle1.velocity.magnitude, phet.joist.random.nextDouble() * 2 * Math.PI );
        particle2.setVelocityPolar( particle2.velocity.magnitude, phet.joist.random.nextDouble() * 2 * Math.PI );
      }
    }
  }

  return gasProperties.register( 'ParticleParticleCollider', ParticleParticleCollider );
} );