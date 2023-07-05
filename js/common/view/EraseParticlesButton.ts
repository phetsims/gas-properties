// Copyright 2019-2023, University of Colorado Boulder

/**
 * EraseParticlesButton is the button for erasing (deleting) all particles from the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
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
      isDisposable: false,
      baseColor: GasPropertiesColors.eraserButtonColorProperty,

      // Deletes all particles when the button fires.
      listener: () => {
        particleSystem.removeAllParticles();
      },

      // Disables the button when the container is empty.
      enabledProperty: new DerivedProperty( [ particleSystem.numberOfParticlesProperty ],
        numberOfParticles => ( numberOfParticles !== 0 ) )
    }, providedOptions );

    super( options );
  }
}

gasProperties.register( 'EraseParticlesButton', EraseParticlesButton );