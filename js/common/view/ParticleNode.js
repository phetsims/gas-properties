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
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     * @constructor
     */
    constructor( particle, modelViewTransform, options ) {

      assert && assert( !options || !options.hasOwnProperty( 'mainColor' ), 'ParticleNode sets mainColor' );
      options = _.extend( {
        mainColor: particle.colorProperty
      }, options );

      const diameter = 2 * modelViewTransform.modelToViewDeltaX( particle.radius );

      super( diameter, options );
    }
  }

  return gasProperties.register( 'ParticleNode', ParticleNode );
} );