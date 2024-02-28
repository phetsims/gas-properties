// Copyright 2018-2024, University of Colorado Boulder

/**
 * ParticleTypeRadioButtonGroup is a pair of radio buttons for selecting between heavy and light particle types.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import { ParticleType } from '../model/ParticleType.js';
import GasPropertiesIconFactory from './GasPropertiesIconFactory.js';

type SelfOptions = EmptySelfOptions;

type ParticleTypeRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

export default class ParticleTypeRadioButtonGroup extends RectangularRadioButtonGroup<ParticleType> {

  public constructor( particleTypeProperty: StringUnionProperty<ParticleType>,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: ParticleTypeRadioButtonGroupOptions ) {

    const options = optionize<ParticleTypeRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {

      // RectangularRadioButtonGroupOptions
      orientation: 'horizontal',
      spacing: 8,
      isDisposable: false,
      radioButtonOptions: {
        baseColor: GasPropertiesColors.radioButtonGroupBaseColorProperty,
        xMargin: 15,
        yMargin: 12,
        buttonAppearanceStrategyOptions: {
          selectedStroke: GasPropertiesColors.radioButtonGroupSelectedStrokeProperty,
          deselectedStroke: GasPropertiesColors.radioButtonGroupDeselectedStrokeProperty,
          selectedLineWidth: 3,
          deselectedLineWidth: 1.5
        }
      }
    }, providedOptions );

    const content: RectangularRadioButtonGroupItem<ParticleType>[] = [
      {
        value: 'heavy',
        createNode: () => GasPropertiesIconFactory.createHeavyParticleIcon( modelViewTransform ),
        tandemName: 'heavyParticlesRadioButton'
      },
      {
        value: 'light',
        createNode: () => GasPropertiesIconFactory.createLightParticleIcon( modelViewTransform ),
        tandemName: 'lightParticlesRadioButton'
      }
    ];

    super( particleTypeProperty, content, options );
  }
}

gasProperties.register( 'ParticleTypeRadioButtonGroup', ParticleTypeRadioButtonGroup );