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
  const DiffusionParticle1 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle1' );
  const DiffusionParticle2 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle2' );
  const ParticleNode = require( 'GAS_PROPERTIES/common/view/ParticleNode' );
  const ParticlesNode = require( 'GAS_PROPERTIES/common/view/ParticlesNode' );
  const Property = require( 'AXON/Property' );

  class DiffusionParticlesNode extends ParticlesNode {

    /**
     * @param {DiffusionModel} model
     */
    constructor( model ) {

      // {Property.<HTMLCanvasElement>} Create DiffusionParticle1 image to match color profile.
      // The content is centered in the HTMLCanvasElement, and may have uniform padding around it.
      const particle1ImageProperty = new Property( null );
      const particle1 = new DiffusionParticle1();
      particle1.colorProperty.link( color => {
        const particleNode = new ParticleNode( particle1, model.modelViewTransform );
        particleNode.toCanvas( canvas => { particle1ImageProperty.value = canvas; } );
      } );

      // {Property.<HTMLCanvasElement>} Create DiffusionParticle2 image to match color profile changes.
      // The content is centered in the HTMLCanvasElement, and may have uniform padding around it.
      const particle2ImageProperty = new Property( null );
      const particle2 = new DiffusionParticle2();
      particle2.colorProperty.link( color => {
        const particleNode = new ParticleNode( particle2, model.modelViewTransform );
        particleNode.toCanvas( canvas => { particle2ImageProperty.value = canvas; } );
      } );

      super(
        model.modelBoundsProperty,
        model.modelViewTransform,
        [ model.particles1, model.particles2 ],
        [ particle1ImageProperty, particle2ImageProperty ]
      );
    }
  }

  return gasProperties.register( 'DiffusionParticlesNode', DiffusionParticlesNode );
} );