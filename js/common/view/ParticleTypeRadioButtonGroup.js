// Copyright 2018-2020, University of Colorado Boulder

/**
 * ParticleTypeRadioButtonGroup is a pair of radio buttons for selecting between heavy and light particle types.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColorProfile from '../GasPropertiesColorProfile.js';
import ParticleType from '../model/ParticleType.js';
import GasPropertiesIconFactory from './GasPropertiesIconFactory.js';

class ParticleTypeRadioButtonGroup extends RectangularRadioButtonGroup {

  /**
   * @param {EnumerationProperty} particleTypeProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( particleTypeProperty, modelViewTransform, options ) {
    assert && assert( particleTypeProperty instanceof EnumerationProperty,
      `invalid particleTypeProperty: ${particleTypeProperty}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );

    options = merge( {

      // superclass options
      orientation: 'horizontal',
      baseColor: GasPropertiesColorProfile.radioButtonGroupBaseColorProperty,
      selectedStroke: GasPropertiesColorProfile.radioButtonGroupSelectedStrokeProperty,
      deselectedStroke: GasPropertiesColorProfile.radioButtonGroupDeselectedStrokeProperty,
      selectedLineWidth: 3,
      deselectedLineWidth: 1.5,
      spacing: 8,
      buttonContentXMargin: 15,
      buttonContentYMargin: 12
    }, options );

    const content = [
      {
        value: ParticleType.HEAVY,
        node: GasPropertiesIconFactory.createHeavyParticleIcon( modelViewTransform ),
        tandemName: 'heavyParticlesRadioButton'
      },
      {
        value: ParticleType.LIGHT,
        node: GasPropertiesIconFactory.createLightParticleIcon( modelViewTransform ),
        tandemName: 'lightParticlesRadioButton'
      }
    ];

    super( particleTypeProperty, content, options );
  }
}

gasProperties.register( 'ParticleTypeRadioButtonGroup', ParticleTypeRadioButtonGroup );
export default ParticleTypeRadioButtonGroup;