// Copyright 2019-2022, University of Colorado Boulder

/**
 * DiffusionParticle2 is the model for particle species 2 in the 'Diffusion' screen, referred to as 'orange particles'
 * in the design doc. Where you see variable names like particles2, centerOfMass2Property, etc., they are related to
 * this species.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import Particle from '../../common/model/Particle.js';
import gasProperties from '../../gasProperties.js';

export default class DiffusionParticle2 extends Particle {

  /**
   * @param {Object} [options] see Particle
   */
  constructor( options ) {

    if ( options ) {
      assert && assert( options.colorProperty === undefined, 'DiffusionParticle2 sets colorProperty' );
      assert && assert( options.highlightColorProperty === undefined, 'DiffusionParticle2 sets highlightColorProperty' );
    }

    super( merge( {

      // superclass options
      colorProperty: GasPropertiesColors.particle2ColorProperty,
      highlightColorProperty: GasPropertiesColors.particle2HighlightColorProperty
    }, options ) );
  }
}

gasProperties.register( 'DiffusionParticle2', DiffusionParticle2 );