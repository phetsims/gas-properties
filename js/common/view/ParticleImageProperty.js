// Copyright 2019, University of Colorado Boulder

/**
 * Property that contains the HTMLCanvasElement for a Particle, uses to render particles with CanvasNode.
 * This image needs to be regenerated when there is a change to the radius or colors for a particle species.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const ParticlesNode = require( 'GAS_PROPERTIES/common/view/ParticlesNode' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );

  class ParticleImageProperty extends DerivedProperty {

    /**
     * @param {function(options:*):Particle} createParticle - creates a Particle instance
     * @param {ModelViewTransform2} modelViewTransform
     * @param {NumberProperty} radiusProperty
     * @param {Object} [options]
     */
    constructor( createParticle, modelViewTransform, radiusProperty, options ) {
      assert && assert( typeof createParticle === 'function', `invalid createParticle: ${createParticle}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );
      assert && assert( radiusProperty instanceof NumberProperty, `invalid radiusProperty: ${radiusProperty}` );

      options = _.extend( {
        isValidValue: value => ( value === null || value instanceof HTMLCanvasElement ),
        radiusProperty: null
      }, options );

      // Create a prototypical Particle
      const particle = createParticle( {
        radius: radiusProperty.value
      } );

      // Node.toCanvas takes a callback that doesn't return a value, so use an intermediate Property to
      // derive the value and act as a proxy for the DerivedProperty dependencies.
      const privateProperty = new Property( null );
      Property.multilink( [ radiusProperty, particle.colorProperty, particle.highlightColorProperty ],
        ( radius, color, highlightColor ) => {
          particle.radius = radius;
          ParticlesNode.particleToCanvas( particle, modelViewTransform, privateProperty );
        } );

      super( [ privateProperty ], ( value ) => value, options );
    }
  }

  return gasProperties.register( 'ParticleImageProperty', ParticleImageProperty );
} );