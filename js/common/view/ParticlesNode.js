// Copyright 2019, University of Colorado Boulder

/**
 * ParticlesNode is the base class for rendering a collection of particles using Canvas. It is used in all screens.
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const ColorDef = require( 'SCENERY/util/ColorDef' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );
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
     * @param {ColorDef} debugFill - fill the canvas when ?canvasBounds, for debugging
     */
    constructor( particleArrays, imageProperties, modelViewTransform, debugFill ) {

      assert && assert( Array.isArray( particleArrays ) && particleArrays.length > 0,
        `invalid particleArrays: ${particleArrays}` );
      assert && assert( particleArrays.length === imageProperties.length,
        'must supply an image Property for each particle array' );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      assert && assert( ColorDef.isColorDef( debugFill ), `invalid debugFill: ${debugFill}` );

      super();

      // If any image changes while the sim is paused, redraw the particle system.
      Property.multilink( imageProperties, () => { this.update(); } );

      // @private
      this.modelViewTransform = modelViewTransform;
      this.particleArrays = particleArrays;
      this.imageProperties = imageProperties;
      this.debugFill = debugFill;
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
      assert && assert( context instanceof CanvasRenderingContext2D, `invalid context: ${context}` );

      // Stroke the canvas bounds, for debugging.  This is a big performance hit.
      if ( GasPropertiesQueryParameters.canvasBounds ) {
        const canvasBounds = this.getCanvasBounds();
        context.fillStyle = this.debugFill;
        context.fillRect(  canvasBounds.x, canvasBounds.y, canvasBounds.width, canvasBounds.height );
      }

      // Draw the particles
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
      assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      assert && assert( particleImageProperty instanceof Property,
        `invalid particleImageProperty: ${particleImageProperty}` );

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
    assert && assert( context instanceof CanvasRenderingContext2D, `invalid context: ${context}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
    assert && assert( image instanceof HTMLCanvasElement, `invalid image: ${image}` );

    for ( let i = 0; i < particles.length; i++ ) {
      context.drawImage( image,

        // Be careful about how dx, dy args are computed. Content is centered and padded in HTMLCanvasElement
        // because we provided integer bounds in particleToCanvas.
        modelViewTransform.modelToViewX( particles[ i ].location.x ) - ( image.width / 2 ) / IMAGE_SCALE,
        modelViewTransform.modelToViewY( particles[ i ].location.y ) - ( image.height / 2 ) / IMAGE_SCALE,
        image.width / IMAGE_SCALE,
        image.height / IMAGE_SCALE
      );
    }
  }

  return gasProperties.register( 'ParticlesNode', ParticlesNode );
} );