// Copyright 2019, University of Colorado Boulder

/**
 * Renders all of the particles in the model.
 * Do not transform this node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
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
      this.heavyParticle = new HeavyParticle();
      this.lightParticle = new LightParticle();
      this.heavyParticleImage = null; // {HTMLCanvasElement} initialized below
      this.lightParticleImage = null; // {HTMLCanvasElement} initialized below

      // Create heavy particle image, re-created if color profile changes.
      this.heavyParticle.colorProperty.link( color => {
        const particle = new ParticleNode( this.heavyParticle, model.modelViewTransform );
        particle.toCanvas( canvas => {
          this.heavyParticleImage = canvas;
        } );
      } );

      // Create light particle image, re-created if color profile changes.
      this.lightParticle.colorProperty.link( color => {
        const particle = new ParticleNode( this.lightParticle, model.modelViewTransform );
        particle.toCanvas( canvas => {
          this.lightParticleImage = canvas;
        } );
      } );

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
      if ( GasPropertiesQueryParameters.renderParticles === 'image' ) {
        drawParticlesImage( context, this.model.modelViewTransform, this.model.heavyParticles, this.heavyParticleImage );
        drawParticlesImage( context, this.model.modelViewTransform, this.model.lightParticles, this.lightParticleImage );
      }
      else {
        drawParticlesCircles( context, this.model.modelViewTransform, this.model.heavyParticles );
        drawParticlesCircles( context, this.model.modelViewTransform, this.model.lightParticles );
      }
    }
  }

  /**
   * Draws a collection of particles using Canvas2D drawImage.
   * @param {CanvasRenderingContext2D} context
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Particle[]} particles
   * @param {HTMLCanvasElement} image
   * @private
   */
  function drawParticlesImage( context, modelViewTransform, particles, image ) {

    context.strokeStyle = 'black';
    context.lineWidth = 1;

    for ( let i = 0; i < particles.length; i++ ) {
      context.drawImage( image,
        modelViewTransform.modelToViewX( particles[ i ].left ),
        modelViewTransform.modelToViewY( particles[ i ].top )
      );
    }
  }

  /**
   * Draws a collection of particles using Canvas2D arc.
   * @param {CanvasRenderingContext2D} context
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Particle[]} particles
   * @private
   */
  function drawParticlesCircles( context, modelViewTransform, particles ) {

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
      context.fillStyle = particles[ i ].colorProperty.value.toCSS();
      context.fill();
    }
  }

  return gasProperties.register( 'ParticlesNode', ParticlesNode );
} );