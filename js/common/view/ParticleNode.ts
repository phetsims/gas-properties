// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * ParticleNode displays a particle as a shaded sphere.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import gasProperties from '../../gasProperties.js';
import Particle from '../model/Particle.js';

export default class ParticleNode extends ShadedSphereNode {

  /**
   * @param {Particle} particle
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * @constructor
   */
  constructor( particle, modelViewTransform, options ) {
    assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );

    assert && assert( !options || !options.mainColor, 'ParticleNode sets mainColor' );
    options = merge( {

      // superclass options
      mainColor: particle.colorProperty,
      highlightColor: particle.highlightColorProperty
    }, options );

    const diameter = 2 * modelViewTransform.modelToViewDeltaX( particle.radius );

    super( diameter, options );
  }
}

gasProperties.register( 'ParticleNode', ParticleNode );