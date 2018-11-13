// Copyright 2018, University of Colorado Boulder

/**
 * Color profile for this simulation, supports default and 'projector mode'.  This is a singleton.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  var ColorProfile = require( 'SCENERY_PHET/ColorProfile' );
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
      default: 'yellow',
      projector: 'rgb( 105, 195, 231 )' // blue
    },
    radioButtonGroupDeselectedStroke: {
      default: 'rgb( 240, 240, 240 )',
      projector: 'rgb( 180, 180, 180 )'
    },
    containerStroke: {
      default: 'white',
      projector: 'black'
    }
  }, [ 'default', 'projector' ] );

  return gasProperties.register( 'gasPropertiesColorProfile', gasPropertiesColorProfile );
} );