// Copyright 2019-2020, University of Colorado Boulder

/**
 * DiffusionParticle1 is the model for particle species 1 in the 'Diffusion' screen, referred to as 'cyan particles'
 * in the design doc. Where you see variable names like particles1, centerOfMass1Property, etc., they are related to
 * this species.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import Particle from '../../common/model/Particle.js';
import gasProperties from '../../gasProperties.js';

class DiffusionParticle1 extends Particle {

  /**
   * @param {Object} [options] see Particle
   */
  constructor( options ) {

    if ( options ) {
      assert && assert( options.colorProperty === undefined, 'DiffusionParticle1 sets colorProperty' );
      assert && assert( options.highlightColorProperty === undefined, 'DiffusionParticle1 sets highlightColorProperty' );
    }

    super( merge( {

      // superclass options
      colorProperty: GasPropertiesColors.particle1ColorProperty,
      highlightColorProperty: GasPropertiesColors.particle1HighlightColorProperty
    }, options ) );
  }
}

gasProperties.register( 'DiffusionParticle1', DiffusionParticle1 );
export default DiffusionParticle1;