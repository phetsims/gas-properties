// Copyright 2019-2022, University of Colorado Boulder

/**
 * ParticleNode displays a particle as a shaded sphere.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import Particle from '../model/Particle.js';

type SelfOptions = EmptySelfOptions;

export type ParticleNodeOptions = SelfOptions & NodeTranslationOptions;

export default class ParticleNode extends ShadedSphereNode {

  public constructor( particle: Particle, modelViewTransform: ModelViewTransform2, providedOptions?: ParticleNodeOptions ) {

    const options = optionize<ParticleNodeOptions, SelfOptions, ShadedSphereNodeOptions>()( {

      // ShadedSphereNodeOptions
      mainColor: particle.colorProperty,
      highlightColor: particle.highlightColorProperty
    }, providedOptions );

    const diameter = 2 * modelViewTransform.modelToViewDeltaX( particle.radius );

    super( diameter, options );
  }
}

gasProperties.register( 'ParticleNode', ParticleNode );