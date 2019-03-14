// Copyright 2019, University of Colorado Boulder

/**
 * Renders all of the particles in the model using CanvasNode and CanvasRenderingContext2D.arc().
 * Do not transform this node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  class ParticlesArcNode extends CanvasNode {

    /**
     * @param {IdealModel} model TODO more general type, narrower interface
     */
    constructor( model ) {

      super();

      // @private
      this.model = model;

      // Size the canvas to match the bounds where particles can exist.
      // This changes dynamically as the browser window is resized.
      model.particleBoundsProperty.link( particleBounds => {
        this.setCanvasBounds( model.modelViewTransform.modelToViewBounds( particleBounds ) );
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
      drawParticles( context, this.model.modelViewTransform, this.model.heavyParticles );
      drawParticles( context, this.model.modelViewTransform, this.model.lightParticles );
    }
  }

  /**
   * Draws a collection of particles using CanvasRenderingContext2D.arc()
   * @param {CanvasRenderingContext2D} context
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Particle[]} particles
   * @private
   */
  function drawParticles( context, modelViewTransform, particles ) {

    context.strokeStyle = 'black';
    context.lineWidth = 1;

    for ( let i = 0; i < particles.length; i++ ) {
      context.beginPath();
      context.arc(
        modelViewTransform.modelToViewX( particles[ i ].location.x ),
        modelViewTransform.modelToViewY( particles[ i ].location.y ),
        modelViewTransform.modelToViewDeltaX( particles[ i ].radius ),
        0, 2 * Math.PI, false );
      context.closePath();
      context.stroke();
      context.fillStyle = particles[ i ].mainColorProperty.value.toCSS();
      context.fill();
    }
  }

  return gasProperties.register( 'ParticlesArcNode', ParticlesArcNode );
} );