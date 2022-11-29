// Copyright 2019-2022, University of Colorado Boulder

/**
 * DiffusionParticleSystemNode renders the particle system for the 'Diffusion' screen.  Since all particles are
 * confined to the container, it requires only one Canvas, and therefore uses ParticlesNode via inheritance.
 *
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ParticleImageProperty from '../../common/view/ParticleImageProperty.js';
import ParticlesNode from '../../common/view/ParticlesNode.js';
import gasProperties from '../../gasProperties.js';
import DiffusionModel from '../model/DiffusionModel.js';
import DiffusionParticle1 from '../model/DiffusionParticle1.js';
import DiffusionParticle2 from '../model/DiffusionParticle2.js';

export default class DiffusionParticleSystemNode extends ParticlesNode {

  /**
   * @param model - passing in the entire model since we use so much of its public API
   */
  public constructor( model: DiffusionModel ) {

    // generated image for DiffusionParticle1 species
    const particle1ImageProperty = new ParticleImageProperty(
      () => new DiffusionParticle1(),
      model.modelViewTransform,
      model.leftSettings.radiusProperty
    );

    // generated image for DiffusionParticle2 species
    const particle2ImageProperty = new ParticleImageProperty(
      () => new DiffusionParticle2(),
      model.modelViewTransform,
      model.rightSettings.radiusProperty
    );

    // {Particle[][]} arrays for each particle species
    const particleArrays = [ model.particles1, model.particles2 ];

    // {Property.<HTMLCanvasElement>[]} images for each particle species in particleArrays
    const imageProperties = [ particle1ImageProperty, particle2ImageProperty ];

    super( particleArrays, imageProperties, model.modelViewTransform );

    // Size the canvas to match the container bounds. See https://github.com/phetsims/gas-properties/issues/38
    this.setCanvasBounds( model.modelViewTransform.modelToViewBounds( model.container.bounds ) );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'DiffusionParticleSystemNode', DiffusionParticleSystemNode );