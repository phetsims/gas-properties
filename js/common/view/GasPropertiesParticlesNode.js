// Copyright 2019, University of Colorado Boulder

/**
 * Renders the particle system for the 'Ideal', 'Explore', and 'Energy' screens.  To optimize the size of canvases,
 * this consists of 2 CanvasNodes; one for particles inside the container, one for particles outside the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesModel = require( 'GAS_PROPERTIES/common/model/GasPropertiesModel' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ParticleImageProperty = require( 'GAS_PROPERTIES/common/view/ParticleImageProperty' );
  const ParticlesNode = require( 'GAS_PROPERTIES/common/view/ParticlesNode' );

  // constants
  const INSIDE_DEBUG_FILL = 'rgba( 255, 0, 0, 0.1 )'; // canvas fill for particles INSIDE container
  const OUTSIDE_DEBUG_FILL = 'rgba( 0, 255, 0, 0.1 )'; // canvas fill for particles OUTSIDE container

  class GasPropertiesParticlesNode extends Node {

    /**
     * @param {GasPropertiesModel} model - passing in the entire model since we use so much of its public API
     */
    constructor( model ) {
      assert && assert( model instanceof GasPropertiesModel, `invalid model: ${model}` );

      // generated image for HeavyParticle species
      const heavyParticleImageProperty = new ParticleImageProperty(
        options => new HeavyParticle( options ),
        model.modelViewTransform,
        new NumberProperty( GasPropertiesConstants.HEAVY_PARTICLES_RADIUS )
      );

      // generated image for LightParticle species
      const lightParticleImageProperty = new ParticleImageProperty(
        options => new LightParticle( options ),
        model.modelViewTransform,
        new NumberProperty( GasPropertiesConstants.LIGHT_PARTICLES_RADIUS )
      );

      // particles inside the container
      const insideParticlesNode = new ParticlesNode(
        [ model.heavyParticles, model.lightParticles ],
        [ heavyParticleImageProperty, lightParticleImageProperty ],
        model.modelViewTransform,
        INSIDE_DEBUG_FILL
      );

      // Size the inside canvas to the maximium bounds for the container.
      insideParticlesNode.setCanvasBounds( model.modelViewTransform.modelToViewBounds( model.container.maxBounds ) );

      // particles outside the container
      const outsideParticlesNode = new ParticlesNode(
        [ model.heavyParticlesOutside, model.lightParticlesOutside ],
        [ heavyParticleImageProperty, lightParticleImageProperty ],
        model.modelViewTransform,
        OUTSIDE_DEBUG_FILL
      );

      // When particles escape through the container's lid, they float up, since there is no gravity.
      // So size the outside canvas to the portion of the model bounds that is above the container.
      model.modelBoundsProperty.link( modelBounds => {
        const canvasBounds = modelBounds.withMinY( model.container.top );
        outsideParticlesNode.setCanvasBounds( model.modelViewTransform.modelToViewBounds( canvasBounds ) );
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

  return gasProperties.register( 'GasPropertiesParticlesNode', GasPropertiesParticlesNode );
} );