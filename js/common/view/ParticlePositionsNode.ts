// Copyright 2024, University of Colorado Boulder

/**
 * ParticlePositionsNode is a debugging tool, used to confirm that the particles are properly positioned. Running with
 * ?showParticlePositions adds this Node to the scene graph, and renders a yellow dot (small circle) where the center
 * of each particle. If the dots are not centered on the particles, then positioning in ParticlesNode is incorrect.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Path } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import Particle from '../model/Particle.js';

export default class ParticlePositionsNode extends Path {

  private readonly particleArrays: Particle[][];
  private readonly modelViewTransform: ModelViewTransform2;

  public constructor( particleArrays: Particle[][], modelViewTransform: ModelViewTransform2 ) {
    super( null, {
      fill: 'yellow'
    } );
    this.particleArrays = particleArrays;
    this.modelViewTransform = modelViewTransform;
  }

  public update(): void {
    const shape = new Shape();
    this.particleArrays.forEach( particleArray => particleArray.forEach( particle => {
      const x = this.modelViewTransform.modelToViewX( particle.x );
      const y = this.modelViewTransform.modelToViewY( particle.y );
      shape.circle( x, y, 1 );
    } ) );
    this.shape = shape;
  }
}

gasProperties.register( 'ParticlePositionsNode', ParticlePositionsNode );