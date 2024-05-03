// Copyright 2019-2024, University of Colorado Boulder

/**
 * DiffusionParticleCanvasProperty derives the HTMLCanvasElement for a DiffusionParticle, used to render particles with
 * CanvasNode. This image needs to be regenerated when there is a change to the radius or colors for a particle species.
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
import DiffusionParticle from '../model/DiffusionParticle.js';
import ParticlesNode from '../../common/view/ParticlesNode.js';

type SelfOptions = EmptySelfOptions;

type DiffusionParticleCanvasPropertyOptions = SelfOptions;

export default class DiffusionParticleCanvasProperty extends DerivedProperty1<HTMLCanvasElement, HTMLCanvasElement | null> {

  public constructor( particle: DiffusionParticle,
                      modelViewTransform: ModelViewTransform2,
                      radiusProperty: TReadOnlyProperty<number>,
                      providedOptions?: DiffusionParticleCanvasPropertyOptions ) {

    const options = optionize<DiffusionParticleCanvasPropertyOptions, SelfOptions, DerivedPropertyOptions<HTMLCanvasElement>>()( {

      // DerivedPropertyOptions
      isDisposable: false,
      valueType: [ HTMLCanvasElement ]
    }, providedOptions );

    // Node.toCanvas takes a callback that doesn't return a value, so use an intermediate Property to
    // derive the value and act as a proxy for the DerivedProperty dependencies.
    const particleCanvasProperty = new Property<HTMLCanvasElement | null>( null );
    Multilink.multilink( [ radiusProperty, particle.colorProperty, particle.highlightColorProperty ],
      ( radius, color, highlightColor ) => {
        particle.setRadius( radius );
        ParticlesNode.particleToCanvas( particle, modelViewTransform, particleCanvasProperty );
      } );

    super(
      [ particleCanvasProperty ],
      ( value: HTMLCanvasElement | null ) => {
        const canvasElement = value!;
        assert && assert( canvasElement );
        return canvasElement;
      },
      options );
  }
}

gasProperties.register( 'DiffusionParticleCanvasProperty', DiffusionParticleCanvasProperty );