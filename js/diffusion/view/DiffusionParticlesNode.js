// Copyright 2019, University of Colorado Boulder

/**
 * Renders the particle system for the 'Diffusion' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const DiffusionParticle1 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle1' );
  const DiffusionParticle2 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle2' );
  const ParticlesNode = require( 'GAS_PROPERTIES/common/view/ParticlesNode' );
  const Property = require( 'AXON/Property' );

  class DiffusionParticlesNode extends ParticlesNode {

    /**
     * @param {DiffusionModel} model TODO narrower interface?
     */
    constructor( model ) {

      // {Property.<HTMLCanvasElement>} generated images for DiffusionParticle1 and DiffusionParticle2 species
      const particle1ImageProperty = new Property( null );
      const particle2ImageProperty = new Property( null );

      // Update DiffusionParticle1 image to match radius and color profile
      Property.multilink( [
          model.leftSettings.radiusProperty,
          GasPropertiesColorProfile.particle1ColorProperty,
          GasPropertiesColorProfile.particle1HighlightColorProperty
        ],
        ( radius, color, highlightColor ) => {
          ParticlesNode.particleToCanvas(
            new DiffusionParticle1( { radius: radius } ),
            model.modelViewTransform, 
            particle1ImageProperty
          );
        } );

      // Update DiffusionParticle2 image to match radius and color profile
      Property.multilink( [
          model.rightSettings.radiusProperty,
          GasPropertiesColorProfile.particle2ColorProperty,
          GasPropertiesColorProfile.particle2HighlightColorProperty
        ],
        ( radius, color, highlightColor ) => {
          ParticlesNode.particleToCanvas(
            new DiffusionParticle2( { radius: radius } ),
            model.modelViewTransform,
            particle2ImageProperty
          );
        } );

      // {Particle[][]} arrays for each particle species
      const particleArrays = [ model.particles1, model.particles2 ];

      // {Property.<HTMLCanvasElement>[]} images for each particle species in particleArrays
      const imageProperties = [ particle1ImageProperty, particle2ImageProperty ];

      super( particleArrays, imageProperties, model.modelViewTransform );

      // Size the canvas to match the container bounds. See https://github.com/phetsims/gas-properties/issues/38
      this.setCanvasBounds( model.modelViewTransform.modelToViewBounds( model.container.bounds ) );
    }
  }

  return gasProperties.register( 'DiffusionParticlesNode', DiffusionParticlesNode );
} );