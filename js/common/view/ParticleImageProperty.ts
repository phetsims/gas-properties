// Copyright 2019-2022, University of Colorado Boulder

/**
 * ParticleImageProperty derives the HTMLCanvasElement for a Particle, used to render particles with CanvasNode.
 * This image needs to be regenerated when there is a change to the radius or colors for a particle species.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { DerivedProperty1, DerivedPropertyOptions } from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import gasProperties from '../../gasProperties.js';
import Particle from '../model/Particle.js';
import ParticlesNode from './ParticlesNode.js';

type SelfOptions = EmptySelfOptions;

type ParticleImagePropertyOptions = SelfOptions;

export default class ParticleImageProperty extends DerivedProperty1<HTMLCanvasElement, HTMLCanvasElement | null> {

  public constructor( createParticle: () => Particle,
                      modelViewTransform: ModelViewTransform2,
                      radiusProperty: TReadOnlyProperty<number>,
                      providedOptions?: ParticleImagePropertyOptions ) {

    const options = optionize<ParticleImagePropertyOptions, SelfOptions, DerivedPropertyOptions<HTMLCanvasElement>>()( {

      // DerivedPropertyOptions
      valueType: [ HTMLCanvasElement ]
    }, providedOptions );

    // Create a prototypical Particle
    const particle = createParticle();

    // Node.toCanvas takes a callback that doesn't return a value, so use an intermediate Property to
    // derive the value and act as a proxy for the DerivedProperty dependencies.
    const privateProperty = new Property<HTMLCanvasElement | null>( null );
    Multilink.multilink( [ radiusProperty, particle.colorProperty, particle.highlightColorProperty ],
      ( radius, color, highlightColor ) => {
        particle.radius = radius;
        ParticlesNode.particleToCanvas( particle, modelViewTransform, privateProperty );
      } );

    super(
      [ privateProperty ],
      ( value: HTMLCanvasElement | null ) => {
        const canvasElement = value!;
        assert && assert( canvasElement );
        return canvasElement;
      },
      options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'ParticleImageProperty', ParticleImageProperty );