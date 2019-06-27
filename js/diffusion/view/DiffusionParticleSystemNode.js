// Copyright 2019, University of Colorado Boulder

/**
 * DiffusionParticleSystemNode renders the particle system for the 'Diffusion' screen.  Since all particles are
 * confined to the container, it requires only one Canvas, and therefore uses ParticlesNode via inheritance.
 * 
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DiffusionModel = require( 'GAS_PROPERTIES/diffusion/model/DiffusionModel' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const DiffusionParticle1 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle1' );
  const DiffusionParticle2 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle2' );
  const ParticleImageProperty = require( 'GAS_PROPERTIES/common/view/ParticleImageProperty' );
  const ParticlesNode = require( 'GAS_PROPERTIES/common/view/ParticlesNode' );

  // constants
  const DEBUG_FILL = 'rgba( 255, 0, 0, 0.1 )';

  class DiffusionParticleSystemNode extends ParticlesNode {

    /**
     * @param {DiffusionModel} model - passing in the entire model since we use so much of its public API
     */
    constructor( model ) {
      assert && assert( model instanceof DiffusionModel, `invalid model: ${model}` );

      // generated image for DiffusionParticle1 species
      const particle1ImageProperty = new ParticleImageProperty(
        options => new DiffusionParticle1( options ),
        model.modelViewTransform,
        model.leftSettings.radiusProperty
      );

      // generated image for DiffusionParticle2 species
      const particle2ImageProperty = new ParticleImageProperty(
        options => new DiffusionParticle2( options ),
        model.modelViewTransform,
        model.rightSettings.radiusProperty
      );

      // {Particle[][]} arrays for each particle species
      const particleArrays = [ model.particles1, model.particles2 ];

      // {Property.<HTMLCanvasElement>[]} images for each particle species in particleArrays
      const imageProperties = [ particle1ImageProperty, particle2ImageProperty ];

      super( particleArrays, imageProperties, model.modelViewTransform, DEBUG_FILL );

      // Size the canvas to match the container bounds. See https://github.com/phetsims/gas-properties/issues/38
      this.setCanvasBounds( model.modelViewTransform.modelToViewBounds( model.container.bounds ) );
    }
  }

  return gasProperties.register( 'DiffusionParticleSystemNode', DiffusionParticleSystemNode );
} );