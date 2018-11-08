// Copyright 2018, University of Colorado Boulder

/**
 * Control for selecting between heavy and light particle types.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var HeavyParticleNode = require( 'GAS_PROPERTIES/common/view/HeavyParticleNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightParticleNode = require( 'GAS_PROPERTIES/common/view/LightParticleNode' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  /**
   * @param {StringProperty} particleTypeProperty
   * @param {Object} [options]
   * @constructor
   */
  function ParticleTypeControl( particleTypeProperty, options ) {

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

    var content = [
      { value: 'heavy', node: new HeavyParticleNode() },
      { value: 'light', node: new LightParticleNode() }
    ];

    RadioButtonGroup.call( this, particleTypeProperty, content, options );
  }

  gasProperties.register( 'ParticleTypeControl', ParticleTypeControl );

  return inherit( RadioButtonGroup, ParticleTypeControl );
} );
 