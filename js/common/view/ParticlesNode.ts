// Copyright 2019-2022, University of Colorado Boulder

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
import { Sprite, SpriteImage, SpriteInstance, Sprites } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import Particle from '../model/Particle.js';
import ParticleNode from './ParticleNode.js';

// constants
const IMAGE_SCALE = 2; // scale images to improve quality, see https://github.com/phetsims/gas-properties/issues/55
const IMAGE_PADDING = 2;

export default class ParticlesNode extends Sprites {

  private readonly particleArrays: Particle[][];
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly sprites: Sprite[];
  private readonly spriteInstances: SpriteInstance[];

  /**
   * @param particleArrays - arrays of particles to render
   * @param imageProperties - an image for each array in particleArrays
   * @param modelViewTransform
   */
  public constructor( particleArrays: Particle[][],
                      imageProperties: TReadOnlyProperty<HTMLCanvasElement>[],
                      modelViewTransform: ModelViewTransform2 ) {
    
    assert && assert( particleArrays.length === imageProperties.length );

    // a Sprite for each Particle array, indexed the same as particleArrays and imageProperties
    const sprites: Sprite[] = imageProperties.map( imageProperty => {
      const imageToSpriteImage = ( image: HTMLCanvasElement ) => {
        return new SpriteImage( image, new Vector2( image.width / 2, image.height / 2 ) );
      };
      const sprite = new Sprite( imageToSpriteImage( imageProperty.value ) );
      imageProperty.lazyLink( image => {
        sprite.imageProperty.value = imageToSpriteImage( image );
      } );
      return sprite;
    } );

    // a SpriteInstance for each Particle
    const spriteInstances: SpriteInstance[] = [];

    super( {
      sprites: sprites,
      spriteInstances: spriteInstances,
      renderer: 'webgl',
      pickable: false
    } );

    this.particleArrays = particleArrays;
    this.modelViewTransform = modelViewTransform;
    this.sprites = sprites;
    this.spriteInstances = spriteInstances;
  }

  /**
   * Redraws the particle system.
   */
  public update(): void {

    // Index into {SpriteInstance[]} this.spriteInstances
    let spriteInstancesIndex = 0;

    // For each array of Particles...
    for ( let i = this.particleArrays.length - 1; i >= 0; i-- ) {

      const particleArray = this.particleArrays[ i ]; // {Particle[]}
      const sprite = this.sprites[ i ];

      // For each Particle...
      for ( let j = particleArray.length - 1; j >= 0; j-- ) {

        const particle = particleArray[ j ]; // {Particle}

        // If we've run out of SpriteInstances, allocate one.
        if ( this.spriteInstances.length === spriteInstancesIndex ) {
          const newInstance = SpriteInstance.pool.fetch();
          newInstance.alpha = 1;
          newInstance.matrix.setToAffine( 1 / IMAGE_SCALE, 0, 0, 0, 1 / IMAGE_SCALE, 0 );
          this.spriteInstances.push( newInstance );
        }

        // For the next SpriteInstance, set its Sprite, and transform it to the particle's position.
        const spriteInstance = this.spriteInstances[ spriteInstancesIndex++ ];
        spriteInstance.sprite = sprite;
        spriteInstance.matrix.set02( this.modelViewTransform.modelToViewX( particle.position.x ) );
        spriteInstance.matrix.set12( this.modelViewTransform.modelToViewY( particle.position.y ) );
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
                                  particleImageProperty: Property<HTMLCanvasElement | null> ): void {

    // Create a particle Node, scaled up to improve quality.
    const particleNode = new ParticleNode( particle, modelViewTransform );
    particleNode.setScaleMagnitude( IMAGE_SCALE, IMAGE_SCALE );

    // Provide our own integer width and height, so that we can reliably center the image
    const canvasWidth = Math.ceil( particleNode.width + IMAGE_PADDING );
    const canvasHeight = Math.ceil( particleNode.height + IMAGE_PADDING );

    // Convert the particle Node to an HTMLCanvasElement
    particleNode.toCanvas( canvas => { particleImageProperty.value = canvas; },
      canvasWidth / 2, canvasHeight / 2, canvasWidth, canvasHeight );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'ParticlesNode', ParticlesNode );