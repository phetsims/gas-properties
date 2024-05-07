// Copyright 2019-2024, University of Colorado Boulder

/**
 * DiffusionParticleSystemNode renders the particle system for the 'Diffusion' screen. Other screens require
 * a separate instance of ParticlesNode for particles inside vs outside the container.  But since all particles are
 * confined to the container in the Diffusion screen, a single instance of DiffusionParticleSystemNode will be needed.
 *
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ParticlesNode from '../../common/view/ParticlesNode.js';
import gasProperties from '../../gasProperties.js';
import DiffusionModel from '../model/DiffusionModel.js';
import DiffusionParticle1 from '../model/DiffusionParticle1.js';
import DiffusionParticle2 from '../model/DiffusionParticle2.js';
import DiffusionParticleCanvasProperty from './DiffusionParticleCanvasProperty.js';

export default class DiffusionParticleSystemNode extends ParticlesNode {

  /**
   * @param model - passing in the entire model since we use so much of its public API
   */
  public constructor( model: DiffusionModel ) {

    // generated canvas for DiffusionParticle1 species
    const particle1CanvasProperty = new DiffusionParticleCanvasProperty(
      new DiffusionParticle1(),
      model.modelViewTransform,
      model.particleSystem.particle1Settings.radiusProperty
    );

    // generated canvas for DiffusionParticle2 species
    const particle2CanvasProperty = new DiffusionParticleCanvasProperty(
      new DiffusionParticle2(),
      model.modelViewTransform,
      model.particleSystem.particle2Settings.radiusProperty
    );

    // Arrays for each particle species
    const particleArrays = [ model.particleSystem.particles1, model.particleSystem.particles2 ];

    // Images for each particle species in particleArrays
    const imageProperties = [ particle1CanvasProperty, particle2CanvasProperty ];

    super( particleArrays, imageProperties, model.modelViewTransform, model.isPlayingProperty );

    // Size the canvas to match the container bounds. See https://github.com/phetsims/gas-properties/issues/38
    this.setCanvasBounds( model.modelViewTransform.modelToViewBounds( model.container.bounds ) );

    // If the number of particles changes while the sim is paused, redraw the particle system.
    model.particleSystem.numberOfParticlesProperty.link( () => {
      if ( !model.isPlayingProperty.value ) {
        this.update();
      }
    } );
  }
}

gasProperties.register( 'DiffusionParticleSystemNode', DiffusionParticleSystemNode );