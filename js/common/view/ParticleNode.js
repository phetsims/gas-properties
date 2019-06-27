// Copyright 2019, University of Colorado Boulder

/**
 * ParticleNode displays a particle as a shaded sphere.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  class ParticleNode extends ShadedSphereNode {

    /**
     * @param {Particle} particle
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     * @constructor
     */
    constructor( particle, modelViewTransform, options ) {
      assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );

      assert && assert( !options || !options.mainColor, 'ParticleNode sets mainColor' );
      options = _.extend( {

        // superclass options
        mainColor: particle.colorProperty,
        highlightColor: particle.highlightColorProperty
      }, options );

      const diameter = 2 * modelViewTransform.modelToViewDeltaX( particle.radius );

      super( diameter, options );
    }
  }

  return gasProperties.register( 'ParticleNode', ParticleNode );
} );