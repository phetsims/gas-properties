// Copyright 2019-2020, University of Colorado Boulder

/**
 * ParticlesNode is the base class for rendering a collection of particles using Sprites. It is used in all screens.
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Sprites from '../../../../scenery/js/nodes/Sprites.js';
import Sprite from '../../../../scenery/js/util/Sprite.js';
import SpriteImage from '../../../../scenery/js/util/SpriteImage.js';
import SpriteInstance from '../../../../scenery/js/util/SpriteInstance.js';
import gasProperties from '../../gasProperties.js';
import Particle from '../model/Particle.js';
import ParticleNode from './ParticleNode.js';

// constants
const IMAGE_SCALE = 2; // scale images to improve quality, see https://github.com/phetsims/gas-properties/issues/55
const IMAGE_PADDING = 2;

class ParticlesNode extends Sprites {

  /**
   * @param {Particle[][]} particleArrays - arrays of particles to render
   * @param {Property.<HTMLCanvasElement>[]} imageProperties - an image for each array in particleArrays
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( particleArrays, imageProperties, modelViewTransform ) {

    assert && assert( Array.isArray( particleArrays ) && particleArrays.length > 0, `invalid particleArrays: ${particleArrays}` );
    assert && assert( particleArrays.length === imageProperties.length, 'must supply an image Property for each particle array' );
    assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );

    // {Sprite[]} a Sprite for each Particle array, indexed the same as particleArrays and imageProperties
    const sprites = imageProperties.map( imageProperty => {
      const imageToSpriteImage = image => {
        return new SpriteImage( image, new Vector2( image.width / 2, image.height / 2 ) );
      };
      const sprite = new Sprite( imageToSpriteImage( imageProperty.value ) );
      imageProperty.lazyLink( image => {
        sprite.imageProperty.value = imageToSpriteImage( image );
      } );
      return sprite;
    } );

    // {SpriteInstance[]} a SpriteInstance for each Particle
    const spriteInstances = [];

    super( {
      sprites: sprites,
      spriteInstances: spriteInstances,
      renderer: 'webgl',
      pickable: false
    } );

    // @private
    this.sprites = sprites;
    this.spriteInstances = spriteInstances;
    this.particleArrays = particleArrays;
    this.modelViewTransform = modelViewTransform;
  }

  /**
   * Redraws the particle system.
   * @public
   */
  update() {

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
          const newInstance = SpriteInstance.dirtyFromPool();
          newInstance.isTranslation = false;
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
      this.spriteInstances.pop().freeToPool();
    }

    this.invalidatePaint(); // results in a call to paintCanvas
  }

  /**
   * Converts a Particle to an HTMLCanvasElement.
   * @param {Particle} particle
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<HTMLCanvasElement>} particleImageProperty
   * @public
   */
  static particleToCanvas( particle, modelViewTransform, particleImageProperty ) {
    assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );
    assert && assert( particleImageProperty instanceof Property,
      `invalid particleImageProperty: ${particleImageProperty}` );

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
}

gasProperties.register( 'ParticlesNode', ParticlesNode );
export default ParticlesNode;