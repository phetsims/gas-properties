// Copyright 2019-2020, University of Colorado Boulder

/**
 * ParticleImageProperty derives the HTMLCanvasElement for a Particle, used to render particles with CanvasNode.
 * This image needs to be regenerated when there is a change to the radius or colors for a particle species.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import gasProperties from '../../gasProperties.js';
import ParticlesNode from './ParticlesNode.js';

class ParticleImageProperty extends DerivedProperty {

  /**
   * @param {function(options:*):Particle} createParticle - creates a Particle instance
   * @param {ModelViewTransform2} modelViewTransform
   * @param {NumberProperty} radiusProperty
   * @param {Object} [options]
   */
  constructor( createParticle, modelViewTransform, radiusProperty, options ) {
    assert && assert( typeof createParticle === 'function', `invalid createParticle: ${createParticle}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );
    assert && assert( radiusProperty instanceof NumberProperty, `invalid radiusProperty: ${radiusProperty}` );

    options = merge( {

      // superclass options
      valueType: [ HTMLCanvasElement, null ]
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

    super( [ privateProperty ], value => value, options );
  }
}

gasProperties.register( 'ParticleImageProperty', ParticleImageProperty );
export default ParticleImageProperty;