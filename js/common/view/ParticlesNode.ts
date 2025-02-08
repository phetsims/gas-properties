// Copyright 2019-2025, University of Colorado Boulder

/**
 * ParticlesNode is the base class for rendering a collection of particles using Sprites. It is used in all screens.
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Sprites from '../../../../scenery/js/nodes/Sprites.js';
import Sprite from '../../../../scenery/js/util/Sprite.js';
import SpriteImage from '../../../../scenery/js/util/SpriteImage.js';
import SpriteInstance, { SpriteInstanceTransformType } from '../../../../scenery/js/util/SpriteInstance.js';
import gasProperties from '../../gasProperties.js';
import Particle from '../model/Particle.js';
import ParticleNode from './ParticleNode.js';

// Padding around the HTMLCanvasElement created using toCanvas, so we can reliably center it.
const CANVAS_PADDING = 2;

// Scale particles up by this much to improve resolution.
const PARTICLE_RESOLUTION_SCALE = 8;

// Inverse scale to apply when rendering particles.
const PARTICLE_INVERSE_SCALE = 1 / PARTICLE_RESOLUTION_SCALE;

export default class ParticlesNode extends Sprites {

  // Arrays of particles to render, one array for each particle species. This does not need to be stateful because
  // the arrays are serialized elsewhere. See IdealGasLawParticleSystemIO and DiffusionParticleSystemIO.
  private readonly particleArrays: Particle[][];

  private readonly modelViewTransform: ModelViewTransform2;
  private readonly sprites: Sprite[];
  private readonly spriteInstances: SpriteInstance[];

  /**
   * @param particleArrays - arrays of particles to render, one array for each particle species
   * @param canvasProperties - an HTMLCanvasElement for each array in particleArrays
   * @param modelViewTransform
   */
  public constructor( particleArrays: Particle[][],
                      canvasProperties: TReadOnlyProperty<HTMLCanvasElement>[],
                      modelViewTransform: ModelViewTransform2 ) {

    assert && assert( particleArrays.length === canvasProperties.length );

    // a Sprite for each Particle array, indexed the same as particleArrays and canvasProperties
    const sprites: Sprite[] = canvasProperties.map( canvasProperty => {
      const canvasToSpriteImage = ( canvas: HTMLCanvasElement ) => {
        return new SpriteImage( canvas, new Vector2( canvas.width / 2, canvas.height / 2 ), {
          mipmap: true, // To make particles crisper when zooming in using pan-and-zoom feature.
          mipmapBias: -0.7 // Use a negative value to increase the displayed resolution. See Imageable.setMipmapBias.
        } );
      };
      const sprite = new Sprite( canvasToSpriteImage( canvasProperty.value ) );
      canvasProperty.lazyLink( canvas => {
        sprite.imageProperty.value = canvasToSpriteImage( canvas );
      } );
      return sprite;
    } );

    // a SpriteInstance for each Particle
    const spriteInstances: SpriteInstance[] = [];

    super( {
      isDisposable: false,
      sprites: sprites,
      spriteInstances: spriteInstances,
      renderer: 'webgl',
      pickable: false
    } );

    this.particleArrays = particleArrays;
    this.modelViewTransform = modelViewTransform;
    this.sprites = sprites;
    this.spriteInstances = spriteInstances;
    this.spriteInstances = spriteInstances;
  }

  /**
   * Redraws the particle system.
   */
  public update(): void {

    // Index into this.spriteInstances
    let spriteInstancesIndex = 0;

    // For each array of Particles...
    for ( let i = this.particleArrays.length - 1; i >= 0; i-- ) {

      const particleArray = this.particleArrays[ i ];
      const sprite = this.sprites[ i ];

      // For each Particle...
      for ( let j = particleArray.length - 1; j >= 0; j-- ) {

        const particle = particleArray[ j ];

        // If we've run out of SpriteInstances, allocate one.
        if ( this.spriteInstances.length === spriteInstancesIndex ) {
          const newInstance = SpriteInstance.pool.fetch();
          newInstance.alpha = 1;
          newInstance.transformType = SpriteInstanceTransformType.AFFINE;
          newInstance.matrix.setToScale( PARTICLE_INVERSE_SCALE );
          this.spriteInstances.push( newInstance );
        }

        // For the next SpriteInstance, set its Sprite, and transform it to the particle's position.
        const spriteInstance = this.spriteInstances[ spriteInstancesIndex++ ];
        spriteInstance.sprite = sprite;
        spriteInstance.matrix.set02( this.modelViewTransform.modelToViewX( particle.x ) );
        spriteInstance.matrix.set12( this.modelViewTransform.modelToViewY( particle.y ) );
      }
    }

    // SpriteInstances that are not being used are freed to the pool.
    while ( this.spriteInstances.length > spriteInstancesIndex ) {
      const spriteInstance = this.spriteInstances.pop()!;
      assert && assert( spriteInstance );
      spriteInstance.freeToPool();
    }

    this.invalidatePaint(); // results in a call to paintCanvas
  }

  /**
   * Converts a Particle to an HTMLCanvasElement.
   */
  public static particleToCanvas( particle: Particle, modelViewTransform: ModelViewTransform2,
                                  particleCanvasProperty: Property<HTMLCanvasElement | null> ): void {

    // Create a particle Node, scaled up to improve quality.
    const particleNode = new ParticleNode( particle, modelViewTransform );
    particleNode.setScaleMagnitude( PARTICLE_RESOLUTION_SCALE );

    // Provide our own integer width and height, so that we can reliably center the image.
    const canvasWidth = Math.ceil( particleNode.width + CANVAS_PADDING );
    const canvasHeight = Math.ceil( particleNode.height + CANVAS_PADDING );

    // Convert the ParticleNode to an HTMLCanvasElement.
    particleNode.toCanvas( ( canvas, x, y, width, height ) => { particleCanvasProperty.value = canvas; },
      canvasWidth / 2, canvasHeight / 2, canvasWidth, canvasHeight );
  }
}

gasProperties.register( 'ParticlesNode', ParticlesNode );