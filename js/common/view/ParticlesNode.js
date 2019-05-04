// Copyright 2019, University of Colorado Boulder

/**
 * Base class for rendering a particle system, used in all screens.
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  class ParticlesNode extends CanvasNode {

    /**
     * @param {Property.<Bounds2>} modelBoundsProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Particle[][]} particleArrays
     * @param {Property.<HTMLCanvasElement>} imageProperties
     */
    constructor( modelBoundsProperty, modelViewTransform, particleArrays, imageProperties ) {

      assert && assert( particleArrays.length === imageProperties.length,
        'must supply an image for each particles array' );

      super();

      // Size the canvas to match the model bounds. This changes dynamically as the browser window is resized.
      modelBoundsProperty.link( modelBounds => {
        this.setCanvasBounds( modelViewTransform.modelToViewBounds( modelBounds ) );
      } );

      // @private
      this.modelViewTransform = modelViewTransform;
      this.particleArrays = particleArrays;
      this.imageProperties = imageProperties;
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
      for ( let i = 0; i < this.particleArrays.length; i++ ) {
        drawParticles( context, this.modelViewTransform, this.particleArrays[ i ], this.imageProperties[ i ].value );
      }
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