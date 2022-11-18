// Copyright 2019-2021, University of Colorado Boulder

/**
 * EraseParticlesButton is the button for erasing (deleting) all particles from the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import ParticleSystem from '../model/ParticleSystem.js';

export default class EraseParticlesButton extends EraserButton {

  /**
   * @param {ParticleSystem} particleSystem
   * @param {Object} [options]
   */
  constructor( particleSystem, options ) {
    assert && assert( particleSystem instanceof ParticleSystem, `invalid particleSystem: ${particleSystem}` );

    options = merge( {

      // superclass options
      baseColor: GasPropertiesColors.eraserButtonColorProperty
    }, options );

    // Deletes all particles when the button fires.
    assert && assert( !options.listener, 'EraseParticlesButton sets listener' );
    options.listener = () => {
      particleSystem.removeAllParticles();
    };

    super( options );

    // Disables the button when the container is empty.
    particleSystem.numberOfParticlesProperty.link( numberOfParticles => {
      this.enabled = ( numberOfParticles !== 0 );
    } );
  }
}

gasProperties.register( 'EraseParticlesButton', EraseParticlesButton );