// Copyright 2019-2022, University of Colorado Boulder

/**
 * EraseParticlesButton is the button for erasing (deleting) all particles from the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import EraserButton, { EraserButtonOptions } from '../../../../scenery-phet/js/buttons/EraserButton.js';
import { NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import ParticleSystem from '../model/ParticleSystem.js';

type SelfOptions = EmptySelfOptions;

type EraseParticlesButtonOptions = SelfOptions & NodeTranslationOptions & PickRequired<EraserButtonOptions, 'tandem'>;

export default class EraseParticlesButton extends EraserButton {

  public constructor( particleSystem: ParticleSystem, providedOptions: EraseParticlesButtonOptions ) {

    const options = optionize<EraseParticlesButtonOptions, SelfOptions, EraserButtonOptions>()( {

      // EraserButtonOptions
      baseColor: GasPropertiesColors.eraserButtonColorProperty,
      listener: () => {
        particleSystem.removeAllParticles(); // Deletes all particles when the button fires.
      }
    }, providedOptions );

    super( options );

    // Disables the button when the container is empty.
    particleSystem.numberOfParticlesProperty.link( numberOfParticles => {
      this.enabled = ( numberOfParticles !== 0 );
    } );
  }
}

gasProperties.register( 'EraseParticlesButton', EraseParticlesButton );