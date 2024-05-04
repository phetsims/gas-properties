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

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import HeavyParticle from '../model/HeavyParticle.js';
import LightParticle from '../model/LightParticle.js';
import IdealGasLawParticleSystem from '../model/IdealGasLawParticleSystem.js';
import ParticleCanvasProperty from './ParticleCanvasProperty.js';
import ParticlesNode from './ParticlesNode.js';
import GasPropertiesQueryParameters from '../GasPropertiesQueryParameters.js';
import ParticlePositionsNode from './ParticlePositionsNode.js';

export default class IdealGasLawParticleSystemNode extends Node {

  private readonly insideParticlesNode: ParticlesNode;
  private readonly outsideParticlesNode: ParticlesNode;

  private readonly particlePositionsNode?: ParticlePositionsNode;

  public constructor( particleSystem: IdealGasLawParticleSystem, modelViewTransform: ModelViewTransform2,
                      modelBoundsProperty: TReadOnlyProperty<Bounds2>, containerMaxBounds: Bounds2 ) {

    // generated canvas for HeavyParticle species
    const heavyParticleCanvasProperty = new ParticleCanvasProperty( new HeavyParticle(), modelViewTransform );

    // generated canvas for LightParticle species
    const lightParticleCanvasProperty = new ParticleCanvasProperty( new LightParticle(), modelViewTransform );

    // particles inside the container
    const insideParticlesNode = new ParticlesNode(
      [ particleSystem.heavyParticles, particleSystem.lightParticles ],
      [ heavyParticleCanvasProperty, lightParticleCanvasProperty ],
      modelViewTransform
    );

    // Size the inside canvas to the maximum bounds for the container.
    insideParticlesNode.setCanvasBounds( modelViewTransform.modelToViewBounds( containerMaxBounds ) );

    // particles outside the container
    const outsideParticlesNode = new ParticlesNode(
      [ particleSystem.heavyParticlesOutside, particleSystem.lightParticlesOutside ],
      [ heavyParticleCanvasProperty, lightParticleCanvasProperty ],
      modelViewTransform
    );

    // When particles escape through the container's lid, they float up, since there is no gravity.
    // So size the outside canvas to the portion of the model bounds that is above the container.
    modelBoundsProperty.link( modelBounds => {
      const canvasBounds = modelBounds.withMinY( containerMaxBounds.maxY );
      outsideParticlesNode.setCanvasBounds( modelViewTransform.modelToViewBounds( canvasBounds ) );
    } );

    super( {
      isDisposable: false,
      children: [ insideParticlesNode, outsideParticlesNode ]
    } );

    this.insideParticlesNode = insideParticlesNode;
    this.outsideParticlesNode = outsideParticlesNode;

    // Debug the particle positions.
    if ( GasPropertiesQueryParameters.showParticlePositions ) {
      this.particlePositionsNode = new ParticlePositionsNode(
        [ particleSystem.heavyParticles, particleSystem.lightParticles ],
        modelViewTransform );
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