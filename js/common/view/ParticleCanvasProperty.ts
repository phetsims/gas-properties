// Copyright 2019-2024, University of Colorado Boulder

/**
 * ParticleCanvasProperty derives the HTMLCanvasElement for a Particle, used to render particles with CanvasNode.
 * This image needs to be regenerated when there is a change to colors for a particle species.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { DerivedProperty1 } from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import gasProperties from '../../gasProperties.js';
import Particle from '../model/Particle.js';
import ParticlesNode from './ParticlesNode.js';

export default class ParticleCanvasProperty extends DerivedProperty1<HTMLCanvasElement, HTMLCanvasElement | null> {

  protected readonly particleCanvasProperty: Property<HTMLCanvasElement | null>;

  public constructor( particle: Particle, modelViewTransform: ModelViewTransform2 ) {

    // Node.toCanvas takes a callback that doesn't return a value, so use an intermediate Property to
    // derive the value and act as a proxy for the DerivedProperty dependencies.
    const particleCanvasProperty = new Property<HTMLCanvasElement | null>( null );
    Multilink.multilink( [ particle.colorProperty, particle.highlightColorProperty ],
      () => ParticlesNode.particleToCanvas( particle, modelViewTransform, particleCanvasProperty )
    );

    super(
      [ particleCanvasProperty ],
      ( value: HTMLCanvasElement | null ) => {
        const canvasElement = value!;
        assert && assert( canvasElement );
        return canvasElement;
      },
      {
        isDisposable: false,
        valueType: [ HTMLCanvasElement ]
      } );

    this.particleCanvasProperty = particleCanvasProperty;
  }
}

gasProperties.register( 'ParticleCanvasProperty', ParticleCanvasProperty );