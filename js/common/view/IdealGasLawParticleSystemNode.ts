// Copyright 2019-2024, University of Colorado Boulder

/**
 * IdealGasLawParticleSystemNode renders the particle system for screens that are based on the Ideal Gas Law.
 * To optimize canvasBounds, this consists of 2 instance of ParticlesNode: one for particles inside the container,
 * one for particles outside the container.
 *
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';
import HeavyParticle from '../model/HeavyParticle.js';
import IdealGasLawModel from '../model/IdealGasLawModel.js';
import LightParticle from '../model/LightParticle.js';
import ParticleCanvasProperty from './ParticleCanvasProperty.js';
import ParticlePositionsNode from './ParticlePositionsNode.js';
import ParticlesNode from './ParticlesNode.js';

export default class IdealGasLawParticleSystemNode extends Node {

  private readonly insideParticlesNode: ParticlesNode;
  private readonly outsideParticlesNode: ParticlesNode;

  private readonly particlePositionsNode?: ParticlePositionsNode;

  /**
   * @param model - Passing in the entire model since we use so much of its public API.
   */
  public constructor( model: IdealGasLawModel ) {

    // generated canvas for HeavyParticle species
    const heavyParticleCanvasProperty = new ParticleCanvasProperty( new HeavyParticle(), model.modelViewTransform );

    // generated canvas for LightParticle species
    const lightParticleCanvasProperty = new ParticleCanvasProperty( new LightParticle(), model.modelViewTransform );

    // particles inside the container
    const insideParticlesNode = new ParticlesNode(
      [ model.particleSystem.heavyParticles, model.particleSystem.lightParticles ],
      [ heavyParticleCanvasProperty, lightParticleCanvasProperty ],
      model.modelViewTransform
    );

    // Size the inside canvas to the maximum bounds for the container.
    insideParticlesNode.setCanvasBounds( model.modelViewTransform.modelToViewBounds( model.container.maxBounds ) );

    // particles outside the container
    const outsideParticlesNode = new ParticlesNode(
      [ model.particleSystem.heavyParticlesOutside, model.particleSystem.lightParticlesOutside ],
      [ heavyParticleCanvasProperty, lightParticleCanvasProperty ],
      model.modelViewTransform
    );

    // When particles escape through the container's lid, they float up, since there is no gravity.
    // So size the outside canvas to the portion of the model bounds that is above the container.
    model.modelBoundsProperty.link( modelBounds => {
      const canvasBounds = modelBounds.withMinY( model.container.maxBounds.maxY );
      outsideParticlesNode.setCanvasBounds( model.modelViewTransform.modelToViewBounds( canvasBounds ) );
    } );

    super( {
      isDisposable: false,
      children: [ insideParticlesNode, outsideParticlesNode ]
    } );

    this.insideParticlesNode = insideParticlesNode;
    this.outsideParticlesNode = outsideParticlesNode;

    // If any of these Properties change while the sim is paused, redraw the particle system.
    Multilink.multilink( [ heavyParticleCanvasProperty, lightParticleCanvasProperty, model.particleSystem.numberOfParticlesProperty ],
      () => {
        if ( !model.isPlayingProperty.value ) {
          this.update();
        }
      } );

    // Debug the particle positions.
    if ( GasPropertiesQueryParameters.showParticlePositions ) {
      this.particlePositionsNode = new ParticlePositionsNode(
        [ model.particleSystem.heavyParticles, model.particleSystem.lightParticles ],
        model.modelViewTransform );
      this.addChild( this.particlePositionsNode );
    }
  }

  /**
   * Redraws the particle system.
   */
  public update(): void {
    this.insideParticlesNode.update();
    this.outsideParticlesNode.update();
    this.particlePositionsNode && this.particlePositionsNode.update();
  }
}

gasProperties.register( 'IdealGasLawParticleSystemNode', IdealGasLawParticleSystemNode );