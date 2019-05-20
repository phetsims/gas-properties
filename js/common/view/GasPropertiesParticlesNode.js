// Copyright 2019, University of Colorado Boulder

/**
 * Renders the particle system for the 'Ideal', 'Explore', and 'Energy' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ParticleImageProperty = require( 'GAS_PROPERTIES/common/view/ParticleImageProperty' );
  const ParticlesNode = require( 'GAS_PROPERTIES/common/view/ParticlesNode' );

  class GasPropertiesParticlesNode extends ParticlesNode {

    /**
     * @param {GasPropertiesModel} model - passing in the entire model since we use so much of its public API
     */
    constructor( model ) {

      // generated image for HeavyParticle species
      const heavyParticleImageProperty = new ParticleImageProperty(
        HeavyParticle,
        model.modelViewTransform,
        new NumberProperty( GasPropertiesConstants.HEAVY_PARTICLES_RADIUS ),
        GasPropertiesColorProfile.heavyParticleColorProperty,
        GasPropertiesColorProfile.heavyParticleHighlightColorProperty
      );

      // generated image for HeavyParticle species
      const lightParticleImageProperty = new ParticleImageProperty(
        LightParticle,
        model.modelViewTransform,
        new NumberProperty( GasPropertiesConstants.LIGHT_PARTICLES_RADIUS ),
        GasPropertiesColorProfile.lightParticleColorProperty,
        GasPropertiesColorProfile.lightParticleHighlightColorProperty
      );

      // {Particle[][]} arrays for each particle type
      const particleArrays = [
        model.heavyParticles, model.lightParticles,
        model.heavyParticlesOutside, model.lightParticlesOutside
      ];

      // {Property.<HTMLCanvasElement>[]} images for each particle type in particleArrays
      const imageProperties = [
        heavyParticleImageProperty, lightParticleImageProperty,
        heavyParticleImageProperty, lightParticleImageProperty
      ];

      super( particleArrays, imageProperties, model.modelViewTransform );

      // Size the canvas to match the portion of the model bounds that is above the bottom of the container.
      // Particles will never be drawn below the container, but can escape through the lid and float up.
      // See https://github.com/phetsims/gas-properties/issues/38
      model.modelBoundsProperty.link( modelBounds => {
        const canvasBounds = modelBounds.withMinY( model.container.bottom );
        this.setCanvasBounds( model.modelViewTransform.modelToViewBounds( canvasBounds ) );
      } );
    }
  }

  return gasProperties.register( 'GasPropertiesParticlesNode', GasPropertiesParticlesNode );
} );