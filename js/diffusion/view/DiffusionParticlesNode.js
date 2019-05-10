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
     * @param {DiffusionModel} model
     */
    constructor( model ) {

      // {Property.<HTMLCanvasElement>} generated images for DiffusionParticle1 and DiffusionParticle2 types
      const particle1ImageProperty = new Property( null );
      const particle2ImageProperty = new Property( null );

      // Update DiffusionParticle1 image to match radius and color profile
      Property.multilink( [
          model.experiment.radius1Property,
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
          model.experiment.radius2Property,
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

      // {Particle[][]} arrays for each particle type
      const particleArrays = [ model.particles1, model.particles2 ];

      // {Property.<HTMLCanvasElement>[]} images for each particle type in particleArrays
      const imageProperties = [ particle1ImageProperty, particle2ImageProperty ];

      super( model.modelBoundsProperty, model.modelViewTransform, particleArrays, imageProperties );

      // If either image changes while the sim is paused, redraw the particle system.
      Property.multilink( [ particle1ImageProperty, particle2ImageProperty ],
        ( particle1Image, particle2Image ) => { this.update(); } );
    }
  }

  return gasProperties.register( 'DiffusionParticlesNode', DiffusionParticlesNode );
} );