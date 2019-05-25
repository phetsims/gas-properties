// Copyright 2019, University of Colorado Boulder

/**
 * Renders the particle system for the 'Diffusion' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DiffusionModel = require( 'GAS_PROPERTIES/diffusion/model/DiffusionModel' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const DiffusionParticle1 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle1' );
  const DiffusionParticle2 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle2' );
  const ParticleImageProperty = require( 'GAS_PROPERTIES/common/view/ParticleImageProperty' );
  const ParticlesNode = require( 'GAS_PROPERTIES/common/view/ParticlesNode' );

  // constants
  const DEBUG_FILL = 'rgba( 255, 0, 0, 0.1 )';

  class DiffusionParticlesNode extends ParticlesNode {

    /**
     * @param {DiffusionModel} model - passing in the entire model since we use so much of its public API
     */
    constructor( model ) {
      assert && assert( model instanceof DiffusionModel, `invalid model: ${model}` );

      // generated image for DiffusionParticle1 species
      const particle1ImageProperty = new ParticleImageProperty(
        options => new DiffusionParticle1( options ),
        model.modelViewTransform,
        model.leftSettings.radiusProperty,
        GasPropertiesColorProfile.particle1ColorProperty,
        GasPropertiesColorProfile.particle1HighlightColorProperty
      );

      // generated image for DiffusionParticle2 species
      const particle2ImageProperty = new ParticleImageProperty(
        options => new DiffusionParticle2( options ),
        model.modelViewTransform,
        model.rightSettings.radiusProperty,
        GasPropertiesColorProfile.particle2ColorProperty,
        GasPropertiesColorProfile.particle2HighlightColorProperty
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

  return gasProperties.register( 'DiffusionParticlesNode', DiffusionParticlesNode );
} );