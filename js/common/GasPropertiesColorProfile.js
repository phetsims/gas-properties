// Copyright 2018-2019, University of Colorado Boulder

/**
 * Color profiles for this simulation.
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

  const GasPropertiesColorProfile = new ColorProfile( [ 'default', 'projector' ], {

    //------------------------------------------------------------------------------------------------------------------
    // These colors change based on which profile is selected.
    //------------------------------------------------------------------------------------------------------------------

    screenBackgroundColor: {
      default: 'black',
      projector: 'white'
    },

    gridColor: {
      default: 'white',
      projector: 'black'
    },

    pointerCoordinatesTextColor: {
      default: 'white',
      projector: 'black'
    },

    pointerCoordinatesBackgroundColor: {
      default: 'rgba( 0, 0, 0, 0.5 )',
      projector: 'rgba( 255, 255, 255, 0.5 )'
    },

    panelFill: {
      default: 'black',
      projector: 'white'
    },

    panelStroke: {
      default: 'white',
      projector: 'black'
    },

    titleTextFill: {
      default: 'white',
      projector: 'black'
    },

    checkboxTextFill: {
      default: 'white',
      projector: 'black'
    },

    radioButtonTextFill: {
      default: 'white',
      projector: 'black'
    },

    sizeArrowColor: {
      default: 'white',
      projector: 'black'
    },

    radioButtonGroupBaseColor: {
      default: 'black',
      projector: 'white'
    },

    radioButtonGroupDeselectedStroke: {
      default: 'rgb( 240, 240, 240 )',
      projector: 'rgb( 180, 180, 180 )'
    },

    containerBoundsStroke: {
      default: 'white',
      projector: 'black'
    },

    containerPreviousBoundsStroke: {
      default: 'rgb( 100, 100, 100 )',
      projector: 'rgb( 220, 220, 220 )'
    },

    lidBaseFill: {
      default: 'rgb( 180, 180, 180 )',
      projector: 'rgb( 128, 128, 128 )'
    },

    //------------------------------------------------------------------------------------------------------------------
    // These colors currently do NOT change. They are included here for future-proofing, and to support experimenting
    // with colors in gas-properties-colors.html.
    //------------------------------------------------------------------------------------------------------------------

    heavyParticleColor: {
      default: 'rgb( 119, 114, 244 )' // purple
    },

    heavyParticleHighlightColor: {
      default: 'rgb( 220, 220, 255 )' // lighter purple
    },

    lightParticleColor: {
      default: 'rgb( 232, 78, 32 )' // red
    },

    lightParticleHighlightColor: {
      default: 'rgb( 255, 170, 170 )' // lighter red
    },

    collisionCounterBackgroundColor: {
      default: 'rgb( 254, 212, 131 )' // yellowish
    },

    separatorColor: {
      default: 'rgb( 100, 100, 100)'
    },

    radioButtonGroupSelectedStroke: {
      //TODO DESIGN not digging this color
      default: 'rgb( 105, 195, 231 )' // blue
    }
  } );

  return gasProperties.register( 'GasPropertiesColorProfile', GasPropertiesColorProfile );
} );