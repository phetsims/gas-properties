// Copyright 2018, University of Colorado Boulder

//TODO rename to ParticleTypeRadioButtonGroup
/**
 * Control for selecting between heavy and light particle types.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const HeavyParticleNode = require( 'GAS_PROPERTIES/common/view/HeavyParticleNode' );
  const LightParticleNode = require( 'GAS_PROPERTIES/common/view/LightParticleNode' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  class ParticleTypeControl extends RadioButtonGroup {

    /**
     * @param {StringProperty} particleTypeProperty
     * @param {Object} [options]
     */
    constructor( particleTypeProperty, options ) {

      options = _.extend( {

        // RadioButtonGroup options
        orientation: 'horizontal',
        baseColor: 'black',
        disabledBaseColor: 'black',
        selectedStroke: 'yellow',
        deselectedStroke: 'white',
        selectedLineWidth: 3,
        deselectedLineWidth: 3,
        spacing: 8,
        buttonContentXMargin: 15,
        buttonContentYMargin: 12
      }, options );

      const content = [
        { value: 'heavy', node: new HeavyParticleNode() },
        { value: 'light', node: new LightParticleNode() }
      ];

      super( particleTypeProperty, content, options );
    }
  }

  return gasProperties.register( 'ParticleTypeControl', ParticleTypeControl );
} );
 