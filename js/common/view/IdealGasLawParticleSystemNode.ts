// Copyright 2019-2023, University of Colorado Boulder

/**
 * IdealGasLawParticleSystemNode renders the particle system for screens that are based on the Ideal Gas Law.
 * To optimize canvasBounds, this consists of 2 instance of ParticlesNode: one for particles inside the container,
 * one for particles outside the container.
 *
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import HeavyParticle from '../model/HeavyParticle.js';
import LightParticle from '../model/LightParticle.js';
import ParticleSystem from '../model/ParticleSystem.js';
import ParticleCanvasProperty from './ParticleCanvasProperty.js';
import ParticlesNode from './ParticlesNode.js';

export default class IdealGasLawParticleSystemNode extends Node {

  private readonly insideParticlesNode: ParticlesNode;
  private readonly outsideParticlesNode: ParticlesNode;

  public constructor( particleSystem: ParticleSystem, modelViewTransform: ModelViewTransform2,
                      modelBoundsProperty: TReadOnlyProperty<Bounds2>, containerMaxBounds: Bounds2 ) {

    // generated canvas for HeavyParticle species
    const heavyParticleCanvasProperty = new ParticleCanvasProperty(
      () => new HeavyParticle(),
      modelViewTransform,
      new NumberProperty( GasPropertiesConstants.HEAVY_PARTICLES_RADIUS )
    );

    // generated canvas for LightParticle species
    const lightParticleCanvasProperty = new ParticleCanvasProperty(
      () => new LightParticle(),
      modelViewTransform,
      new NumberProperty( GasPropertiesConstants.LIGHT_PARTICLES_RADIUS )
    );

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
      children: [ insideParticlesNode, outsideParticlesNode ],
      isDisposable: false
    } );

    this.insideParticlesNode = insideParticlesNode;
    this.outsideParticlesNode = outsideParticlesNode;
  }

  /**
   * Redraws the particle system.
   */
  public update(): void {
    this.insideParticlesNode.update();
    this.outsideParticlesNode.update();
  }
}

gasProperties.register( 'IdealGasLawParticleSystemNode', IdealGasLawParticleSystemNode );