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
  const ParticleNode = require( 'GAS_PROPERTIES/common/view/ParticleNode' );
  const ParticlesNode = require( 'GAS_PROPERTIES/common/view/ParticlesNode' );
  const Property = require( 'AXON/Property' );

  // constants
  const IMAGE_SCALE = 2; // scale images to improve quality, see https://github.com/phetsims/gas-properties/issues/55

  class DiffusionParticlesNode extends ParticlesNode {

    /**
     * @param {DiffusionModel} model
     */
    constructor( model ) {

      // {Property.<HTMLCanvasElement>} generated images for DiffusionParticle1 and DiffusionParticle2 types
      const particle1ImageProperty = new Property( null );
      const particle2ImageProperty = new Property( null );

      // Create DiffusionParticle1 image to match color profile and radius.
      // The content is centered in the HTMLCanvasElement, and may have uniform padding around it.
      Property.multilink(
        [ GasPropertiesColorProfile.particle1ColorProperty,
          GasPropertiesColorProfile.particle1HighlightColorProperty,
          model.experiment.radius1Property ],
        ( color, highlightColor, radius ) => {
          const particle1 = new DiffusionParticle1( { radius: radius } );
          const particleNode = new ParticleNode( particle1, model.modelViewTransform );
          particleNode.setScaleMagnitude( IMAGE_SCALE, IMAGE_SCALE );
          particleNode.toCanvas( canvas => { particle1ImageProperty.value = canvas; } );
        } );

      // Create DiffusionParticle2 image to match color profile and radius.
      // The content is centered in the HTMLCanvasElement, and may have uniform padding around it.
      Property.multilink(
        [ GasPropertiesColorProfile.particle2ColorProperty,
          GasPropertiesColorProfile.particle2HighlightColorProperty,
          model.experiment.radius2Property ],
        ( color, highlightColor, radius ) => {
          const particle2 = new DiffusionParticle2( { radius: radius } );
          const particleNode = new ParticleNode( particle2, model.modelViewTransform );
          particleNode.setScaleMagnitude( IMAGE_SCALE, IMAGE_SCALE );
          particleNode.toCanvas( canvas => { particle2ImageProperty.value = canvas; } );
        } );

      // arrays for each particle type
      const particleArrays = [ model.particles1, model.particles2 ];

      // images for each particle type in particleArrays
      const imageProperties = [ particle1ImageProperty, particle2ImageProperty ];

      super( model.modelBoundsProperty, model.modelViewTransform, particleArrays, imageProperties, IMAGE_SCALE );

      // If either image changes while the sim is paused, redraw the particle system.
      Property.multilink( [ particle1ImageProperty, particle2ImageProperty ],
        ( particle1Image, particle2Image ) => { this.update(); } );
    }
  }

  return gasProperties.register( 'DiffusionParticlesNode', DiffusionParticlesNode );
} );