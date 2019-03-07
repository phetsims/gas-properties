// Copyright 2019, University of Colorado Boulder

/**
 * Particle view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  class ParticleNode extends ShadedSphereNode {

    /**
     * @param {Particle} particle
     * @param {Object} [options]
     * @constructor
     */
    constructor( particle, options ) {

      assert && assert( !options || !options.hasOwnProperty( 'mainColor' ), 'ParticleNode sets mainColor' );
      options = _.extend( {
        mainColor: particle.colorProperty
      }, options );

      super( 2 * particle.radius, options );
    }
  }

  return gasProperties.register( 'ParticleNode', ParticleNode );
} );