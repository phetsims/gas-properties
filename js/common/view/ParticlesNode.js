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
  const ParticleNode = require( 'GAS_PROPERTIES/common/view/ParticleNode' );
  const Property = require( 'AXON/Property' );

  // constants
  const IMAGE_SCALE = 2; // scale images to improve quality, see https://github.com/phetsims/gas-properties/issues/55
  const IMAGE_PADDING = 2;

  class ParticlesNode extends CanvasNode {

    /**
     * @param {Particle[][]} particleArrays - arrays of particles to render
     * @param {Property.<HTMLCanvasElement>[]} imageProperties - an image for each array in particleArrays
     * @param {ModelViewTransform2} modelViewTransform
     */
    constructor( particleArrays, imageProperties, modelViewTransform ) {

      assert && assert( particleArrays.length === imageProperties.length,
        'must supply an image Property for each particle array' );

      super();

      // If any image changes while the sim is paused, redraw the particle system.
      Property.multilink( imageProperties, () => { this.update(); } );

      // @private
      this.modelViewTransform = modelViewTransform;
      this.particleArrays = particleArrays;
      this.imageProperties = imageProperties;
    }

    /**
     * Redraws the particle system.
     * @public
     */
    update() {
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

    /**
     * Converts a Particle to an HTMLCanvasElement.
     * @param {Particle} particle
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Property.<HTMLCanvasElement>} particleImageProperty
     * @public
     */
    static particleToCanvas( particle, modelViewTransform, particleImageProperty ) {

      // Create a particle Node, scaled up to improve quality.
      const particleNode = new ParticleNode( particle, modelViewTransform );
      particleNode.setScaleMagnitude( IMAGE_SCALE, IMAGE_SCALE );

      // Provide our own integer width and height, so that we can reliably center the image
      const canvasWidth = Math.ceil( particleNode.width + IMAGE_PADDING );
      const canvasHeight = Math.ceil( particleNode.height + IMAGE_PADDING );

      // Convert the particle Node to an HTMLCanvasElement
      particleNode.toCanvas( canvas => { particleImageProperty.value = canvas; },
        canvasWidth / 2, canvasHeight / 2, canvasWidth, canvasHeight );
    }
  }

  /**
   * Draws a collection of particles.
   * @param {CanvasRenderingContext2D} context
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Particle[]} particles
   * @param {HTMLCanvasElement} image
   */
  function drawParticles( context, modelViewTransform, particles, image ) {
    for ( let i = 0; i < particles.length; i++ ) {
      context.drawImage( image,

        // Be careful about how dx, dy args are computed. Content is centered and padded in HTMLCanvasElement
        // because we manually provided integer bounds in particleToCanvas.
        modelViewTransform.modelToViewX( particles[ i ].location.x ) - ( image.width / 2 ) / IMAGE_SCALE,
        modelViewTransform.modelToViewY( particles[ i ].location.y ) - ( image.height / 2 ) / IMAGE_SCALE,
        image.width / IMAGE_SCALE,
        image.height / IMAGE_SCALE
      );
    }
  }

  return gasProperties.register( 'ParticlesNode', ParticlesNode );
} );