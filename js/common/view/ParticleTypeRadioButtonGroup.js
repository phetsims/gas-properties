// Copyright 2018-2019, University of Colorado Boulder

/**
 * Control for selecting between heavy and light particle types.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const ParticleType = require( 'GAS_PROPERTIES/common/model/ParticleType' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  class ParticleTypeRadioButtonGroup extends RadioButtonGroup {

    /**
     * @param {EnumerationProperty} particleTypeProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( particleTypeProperty, modelViewTransform, options ) {
      assert && assert( particleTypeProperty instanceof EnumerationProperty, `invalid particleTypeProperty: ${particleTypeProperty}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );

      options = _.extend( {

        // RadioButtonGroup options
        orientation: 'horizontal',
        baseColor: GasPropertiesColorProfile.radioButtonGroupBaseColorProperty,
        disabledBaseColor: GasPropertiesColorProfile.radioButtonGroupBaseColorProperty,
        selectedStroke: GasPropertiesColorProfile.radioButtonGroupSelectedStrokeProperty,
        deselectedStroke: GasPropertiesColorProfile.radioButtonGroupDeselectedStrokeProperty,
        selectedLineWidth: 3,
        deselectedLineWidth: 1.5,
        spacing: 8,
        buttonContentXMargin: 15,
        buttonContentYMargin: 12
      }, options );

      const content = [
        { value: ParticleType.HEAVY, node: GasPropertiesIconFactory.createHeavyParticleIcon( modelViewTransform ) },
        { value: ParticleType.LIGHT, node: GasPropertiesIconFactory.createLightParticleIcon( modelViewTransform ) }
      ];

      super( particleTypeProperty, content, options );
    }
  }

  return gasProperties.register( 'ParticleTypeRadioButtonGroup', ParticleTypeRadioButtonGroup );
} );
 