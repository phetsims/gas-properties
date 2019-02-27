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

      options = options || {};

      assert && assert( !options.mainColor, 'ParticleNode sets mainColor' );
      options.mainColor = particle.colorProperty;

      super( 2 * particle.radius, options );
    }
  }

  return gasProperties.register( 'ParticleNode', ParticleNode );
} );