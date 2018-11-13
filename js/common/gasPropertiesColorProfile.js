// Copyright 2018, University of Colorado Boulder

/**
 * Color profile for this simulation, supports default and 'projector mode'.
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
    accordionBoxFill: {
      default: 'black',
      projector: 'white'
    },
    panelFill: {
      default: 'black',
      projector: 'white'
    },
    textFill: {
      default: 'white',
      projector: 'black'
    }
  }, [ 'default', 'projector' ] );

  return gasProperties.register( 'gasPropertiesColorProfile', gasPropertiesColorProfile );
} );