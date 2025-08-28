// Copyright 2019-2025, University of Colorado Boulder

/**
 * DiffusionParticleCanvasProperty derives the HTMLCanvasElement for a DiffusionParticle, used to render particles with
 * CanvasNode. In the Diffusion screen, particle radius is settable.  So this extends ParticleCanvasProperty by updating
 * the HTMLCanvasElement when radius changes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ParticleCanvasProperty from '../../common/view/ParticleCanvasProperty.js';
import ParticlesNode from '../../common/view/ParticlesNode.js';
import gasProperties from '../../gasProperties.js';
import DiffusionParticle from '../model/DiffusionParticle.js';

export default class DiffusionParticleCanvasProperty extends ParticleCanvasProperty {

  public constructor( particle: DiffusionParticle,
                      modelViewTransform: ModelViewTransform2,
                      radiusProperty: TReadOnlyProperty<number> ) {

    super( particle, modelViewTransform );

    radiusProperty.link( radius => {
      particle.setRadius( radius );
      ParticlesNode.particleToCanvas( particle, modelViewTransform, this.particleCanvasProperty );
    } );
  }
}

gasProperties.register( 'DiffusionParticleCanvasProperty', DiffusionParticleCanvasProperty );