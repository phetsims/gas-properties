// Copyright 2018, University of Colorado Boulder

/**
 * Singleton color profile for this simulation.
 * Default colors are required. Colors for other profiles are optional.
 * Profile 'projector' is used for Projector Mode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ColorProfile = require( 'SCENERY_PHET/ColorProfile' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  const gasPropertiesColorProfile = new ColorProfile( {
    screenBackgroundColor: {
      default: 'black',
      projector: 'white'
    },
    panelFill: {
      default: 'black',
      projector: 'white'
    },
    panelStroke: {
      default: 'white',
      projector: 'black'
    },
    textFill: {
      default: 'white',
      projector: 'black'
    },
    radioButtonGroupBaseColor: {
      default: 'black',
      projector: 'white'
    },
    radioButtonGroupSelectedStroke: {
      //TODO not digging this color
      default: 'rgb( 105, 195, 231 )' // blue
    },
    radioButtonGroupDeselectedStroke: {
      default: 'rgb( 240, 240, 240 )',
      projector: 'rgb( 180, 180, 180 )'
    },
    containerStroke: {
      default: 'white',
      projector: 'black'
    },
    heavyParticleColor: {
      default: 'rgb( 119, 114, 244 )'
    },
    lightParticleColor: {
      default: 'rgb( 232, 78, 32 )'
    }
  }, [ 'default', 'projector' ] );

  return gasProperties.register( 'gasPropertiesColorProfile', gasPropertiesColorProfile );
} );