// Copyright 2019, University of Colorado Boulder

/**
 * Renders the particle system for the 'Ideal', 'Explore', and 'Energy' screens.  To optimize the size of canvases,
 * this consists of 2 CanvasNodes; one for particles inside the container, one for particles outside the container.
 * So we use 2 instances of ParticlesNode via composition.
 *
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ParticleImageProperty = require( 'GAS_PROPERTIES/common/view/ParticleImageProperty' );
  const ParticlesNode = require( 'GAS_PROPERTIES/common/view/ParticlesNode' );
  const ParticleSystem = require( 'GAS_PROPERTIES/common/model/ParticleSystem' );
  const Property = require( 'AXON/Property' );

  // constants
  const INSIDE_DEBUG_FILL = 'rgba( 255, 0, 0, 0.1 )'; // canvas fill for particles INSIDE container
  const OUTSIDE_DEBUG_FILL = 'rgba( 0, 255, 0, 0.1 )'; // canvas fill for particles OUTSIDE container

  class GasPropertiesParticleSystemNode extends Node {

    /**
     * @param {ParticleSystem} particleSystem
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Property.<Bounds2>} modelBoundsProperty
     * @param {Bounds2} containerMaxBounds
     */
    constructor( particleSystem, modelViewTransform, modelBoundsProperty, containerMaxBounds ) {
      assert && assert( particleSystem instanceof ParticleSystem, `invalid particleSystem: ${particleSystem}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      assert && assert( modelBoundsProperty instanceof Property, `invalid modelBoundsProperty: ${modelBoundsProperty}` );
      assert && assert( containerMaxBounds instanceof Bounds2, `invalid containerMaxBounds: ${containerMaxBounds}` );

      // generated image for HeavyParticle species
      const heavyParticleImageProperty = new ParticleImageProperty(
        options => new HeavyParticle( options ),
        modelViewTransform,
        new NumberProperty( GasPropertiesConstants.HEAVY_PARTICLES_RADIUS )
      );

      // generated image for LightParticle species
      const lightParticleImageProperty = new ParticleImageProperty(
        options => new LightParticle( options ),
        modelViewTransform,
        new NumberProperty( GasPropertiesConstants.LIGHT_PARTICLES_RADIUS )
      );

      // particles inside the container
      const insideParticlesNode = new ParticlesNode(
        [ particleSystem.heavyParticles, particleSystem.lightParticles ],
        [ heavyParticleImageProperty, lightParticleImageProperty ],
        modelViewTransform,
        INSIDE_DEBUG_FILL
      );

      // Size the inside canvas to the maximum bounds for the container.
      insideParticlesNode.setCanvasBounds( modelViewTransform.modelToViewBounds( containerMaxBounds ) );

      // particles outside the container
      const outsideParticlesNode = new ParticlesNode(
        [ particleSystem.heavyParticlesOutside, particleSystem.lightParticlesOutside ],
        [ heavyParticleImageProperty, lightParticleImageProperty ],
        modelViewTransform,
        OUTSIDE_DEBUG_FILL
      );

      // When particles escape through the container's lid, they float up, since there is no gravity.
      // So size the outside canvas to the portion of the model bounds that is above the container.
      modelBoundsProperty.link( modelBounds => {
        const canvasBounds = modelBounds.withMinY( containerMaxBounds.maxY );
        outsideParticlesNode.setCanvasBounds( modelViewTransform.modelToViewBounds( canvasBounds ) );
      } );

      super( {
        children: [ insideParticlesNode, outsideParticlesNode ]
      } );

      // @private
      this.insideParticlesNode = insideParticlesNode;
      this.outsideParticlesNode = outsideParticlesNode;
    }

    /**
     * Redraws the particle system.
     * @public
     */
    update() {
      this.insideParticlesNode.update();
      this.outsideParticlesNode.update();
    }
  }

  return gasProperties.register( 'GasPropertiesParticleSystemNode', GasPropertiesParticleSystemNode );
} );