// Copyright 2018-2019, University of Colorado Boulder

/**
 * Control for selecting between heavy and light particle types.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const ParticleTypeEnum = require( 'GAS_PROPERTIES/common/model/ParticleTypeEnum' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  class ParticleTypeRadioButtonGroup extends RadioButtonGroup {

    /**
     * @param {StringProperty} particleTypeProperty
     * @param {Object} [options]
     */
    constructor( particleTypeProperty, options ) {

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
        { value: ParticleTypeEnum.HEAVY, node: GasPropertiesIconFactory.createHeavyParticleIcon() },
        { value: ParticleTypeEnum.LIGHT, node: GasPropertiesIconFactory.createLightParticleIcon() }
      ];

      super( particleTypeProperty, content, options );
    }
  }

  return gasProperties.register( 'ParticleTypeRadioButtonGroup', ParticleTypeRadioButtonGroup );
} );
 