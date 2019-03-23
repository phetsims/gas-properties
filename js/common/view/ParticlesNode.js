// Copyright 2019, University of Colorado Boulder

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
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const ParticleNode = require( 'GAS_PROPERTIES/common/view/ParticleNode' );

  class ParticlesNode extends CanvasNode {

    /**
     * @param {IdealModel} model TODO more general type, narrower interface
     */
    constructor( model ) {

      super();

      // @private
      this.model = model;

      // @private {HTMLCanvasElement} Create heavy particle image to match color profile.
      // The content is centered in the HTMLCanvasElement, and may have uniform padding around it.
      this.heavyParticleImage = null;
      const heavyParticle = new HeavyParticle();
      heavyParticle.colorProperty.link( color => {
        const particleNode = new ParticleNode( heavyParticle, model.modelViewTransform );
        particleNode.toCanvas( canvas => { this.heavyParticleImage = canvas; } );
      } );

      // @private {HTMLCanvasElement} Create light particle image to match color profile changes.
      // The content is centered in the HTMLCanvasElement, and may have uniform padding around it.
      this.lightParticleImage = null;
      const lightParticle = new LightParticle();
      lightParticle.colorProperty.link( color => {
        const particleNode = new ParticleNode( lightParticle, model.modelViewTransform );
        particleNode.toCanvas( canvas => { this.lightParticleImage = canvas; } );
      } );

      //TODO canvas size could be considerably smaller, does it matter?
      // Size the canvas to match the model bounds. This changes dynamically as the browser window is resized.
      model.modelBoundsProperty.link( modelBounds => {
        this.setCanvasBounds( model.modelViewTransform.modelToViewBounds( modelBounds ) );
      } );
    }

    /**
     * Called on each step of the simulation's timer.
     * @param {number} dt - time delta, in seconds
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
      drawParticles( context, this.model.modelViewTransform, this.model.heavyParticles, this.heavyParticleImage );
      drawParticles( context, this.model.modelViewTransform, this.model.lightParticles, this.lightParticleImage );
      drawParticles( context, this.model.modelViewTransform, this.model.heavyParticlesOutside, this.heavyParticleImage );
      drawParticles( context, this.model.modelViewTransform, this.model.lightParticlesOutside, this.lightParticleImage );
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

  return gasProperties.register( 'ParticlesNode', ParticlesNode );
} );