// Copyright 2019, University of Colorado Boulder

//TODO lots of duplication with ParticlesNode
/**
 * Renders all of the particles in the model using CanvasNode and CanvasRenderingContext2D.drawImage().
 * Do not transform this node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const DiffusionParticle1 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle1' );
  const DiffusionParticle2 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle2' );
  const ParticleNode = require( 'GAS_PROPERTIES/common/view/ParticleNode' );

  class DiffusionParticlesNode extends CanvasNode {

    /**
     * @param {DiffusionModel} model TODO narrower interface?
     */
    constructor( model ) {

      super();

      // @private
      this.model = model;

      // @private {HTMLCanvasElement} Create DiffusionParticle1 image to match color profile.
      // The content is centered in the HTMLCanvasElement, and may have uniform padding around it.
      this.particle1Image = null;
      const particle1 = new DiffusionParticle1();
      particle1.colorProperty.link( color => {
        const particleNode = new ParticleNode( particle1, model.modelViewTransform );
        particleNode.toCanvas( canvas => { this.particle1Image = canvas; } );
      } );

      // @private {HTMLCanvasElement} Create DiffusionParticle2 image to match color profile changes.
      // The content is centered in the HTMLCanvasElement, and may have uniform padding around it.
      this.particle2Image = null;
      const particle2 = new DiffusionParticle2();
      particle2.colorProperty.link( color => {
        const particleNode = new ParticleNode( particle2, model.modelViewTransform );
        particleNode.toCanvas( canvas => { this.particle2Image = canvas; } );
      } );

      //TODO canvas size could be considerably smaller, does it matter?
      // Size the canvas to match the model bounds. This changes dynamically as the browser window is resized.
      model.modelBoundsProperty.link( modelBounds => {
        this.setCanvasBounds( model.modelViewTransform.modelToViewBounds( modelBounds ) );
      } );
    }

    /**
     * Called on each step of the simulation's timer.
     * @param {number} dt - time delta, in ps
     */
    step( dt ) {
      this.invalidatePaint(); // results in a call to paintCanvas
    }

    /**
     * Redraws the particles to reflect their current state.
     * @param {CanvasRenderingContext2D} context
     * @public
     * @override
     */
    paintCanvas( context ) {
      drawParticles( context, this.model.modelViewTransform, this.model.particles1, this.particle1Image );
      drawParticles( context, this.model.modelViewTransform, this.model.particles2, this.particle2Image );
    }
  }

  /**
   * Draws a collection of particles using CanvasRenderingContext2D.drawImage()
   * @param {CanvasRenderingContext2D} context
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Particle[]} particles
   * @param {HTMLCanvasElement} image
   * @private
   */
  function drawParticles( context, modelViewTransform, particles, image ) {
    for ( let i = 0; i < particles.length; i++ ) {
      context.drawImage( image,

        // content is centered and padded in HTMLCanvasElement, so be careful about how dx, dy args are computed.
        modelViewTransform.modelToViewX( particles[ i ].location.x ) - image.width / 2,
        modelViewTransform.modelToViewY( particles[ i ].location.y ) - image.height / 2
      );
    }
  }

  return gasProperties.register( 'DiffusionParticlesNode', DiffusionParticlesNode );
} );