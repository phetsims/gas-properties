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
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const ParticleNode = require( 'GAS_PROPERTIES/common/view/ParticleNode' );

  class ParticlesNode extends CanvasNode {

    /**
     * @param {IdealModel} model TODO type expression, interface too wide
     */
    constructor( model ) {

      super();
      
      // @private
      this.model = model;
      this.heavyParticle = new HeavyParticle();
      this.lightParticle = new LightParticle();
      this.heavyParticleImage = null; // {HTMLCanvasElement} initialized below
      this.lightParticleImage = null; // {HTMLCanvasElement} initialized below

      // Create canvas element for heavy particles, re-created if color profile changes.
      this.heavyParticle.colorProperty.link( color => {
        const particle = new ParticleNode( this.heavyParticle );
        particle.toCanvas( canvas => {
          this.heavyParticleImage = canvas;
        } );
      } );

      // Create canvas element for light particles, re-created if color profile changes.
      this.lightParticle.colorProperty.link( color => {
        const particle = new ParticleNode( this.lightParticle );
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
      this.drawParticles( context, this.model.heavyParticles, this.heavyParticleImage );
      this.drawParticles( context, this.model.lightParticles, this.lightParticleImage );
    }

    /**
     * Draws a collection of particles that are represented by the same image.
     * @param {CanvasRenderingContext2D} context
     * @param {Particle[]} particles
     * @param {HTMLCanvasElement} image
     * @private
     */
    drawParticles( context, particles, image ) {
      const radius = image.width / 2;
      for ( let i = 0; i < particles.length; i++ ) {
        const location = this.model.modelViewTransform.modelToViewPosition( particles[ i ].location )
          .subtractScalar( radius );
        context.drawImage( image, location.x, location.y );
      }
    }
  }

  return gasProperties.register( 'ParticlesNode', ParticlesNode );
} );