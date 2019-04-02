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

    // fill for control panels
    panelFill: {
      default: 'black',
      projector: 'white'
    },

    // stroke for control panels
    panelStroke: {
      default: 'white',
      projector: 'black'
    },

    // default fill for text
    textFill: {
      default: 'white',
      projector: 'black'
    },

    // fill for check boxes
    checkBoxFill: {
      default: 'black',
      projector: 'white'
    },

    // stroke for check boxes
    checkBoxStroke: {
      default: 'white',
      projector: 'black'
    },

    // radio buttons for choosing particle type
    radioButtonGroupBaseColor: {
      default: 'black',
      projector: 'white'
    },

    // radio buttons for choosing particle type
    radioButtonGroupDeselectedStroke: {
      default: 'rgb( 240, 240, 240 )',
      projector: 'rgb( 180, 180, 180 )'
    },

    // walls of the container
    containerBoundsStroke: {
      default: 'white',
      projector: 'black'
    },

    // bounds of the previous container size, shown while the container is being resized
    containerPreviousBoundsStroke: {
      default: 'rgb( 100, 100, 100 )',
      projector: 'rgb( 220, 220, 220 )'
    },

    // base of the lid, the part that the handle attaches to
    lidBaseFill: {
      default: 'rgb( 180, 180, 180 )',
      projector: 'rgb( 128, 128, 128 )'
    },

    // dimensional arrow, shown using the 'Size' checkbox
    sizeArrowColor: {
      default: 'white',
      projector: 'black'
    },

    // enabled with ?grid query parameter
    gridColor: {
      default: 'white',
      projector: 'black'
    },

    // enabled with ?pointerCoordinates query parameter
    pointerCoordinatesTextColor: {
      default: 'white',
      projector: 'black'
    },

    // enabled with ?pointerCoordinates query parameter
    pointerCoordinatesBackgroundColor: {
      default: 'rgba( 0, 0, 0, 0.5 )',
      projector: 'rgba( 255, 255, 255, 0.5 )'
    },

    //------------------------------------------------------------------------------------------------------------------
    // These colors currently do NOT change. They are included here for future-proofing, and to support experimenting
    // with colors in gas-properties-colors.html.
    //------------------------------------------------------------------------------------------------------------------

    // primary color for heavy particles
    heavyParticleColor: {
      default: 'rgb( 119, 114, 244 )' // purple
    },

    // specular highlight for heavy particles
    heavyParticleHighlightColor: {
      default: 'rgb( 220, 220, 255 )' // lighter purple
    },

    // primary color for light particles
    lightParticleColor: {
      default: 'rgb( 232, 78, 32 )' // red
    },

    // specular highlight for light particles
    lightParticleHighlightColor: {
      default: 'rgb( 255, 170, 170 )' // lighter red
    },

    collisionCounterBackgroundColor: {
      default: 'rgb( 254, 212, 131 )' // yellowish
    },

    // pseudo-3D bezel around the outer edge of the collision counter
    collisionCounterBezelColor: {
      default: 'rgb( 90, 90, 90 )'
    },

    // horizontal separator in control panels
    separatorColor: {
      default: 'rgb( 100, 100, 100)'
    },

    // radio buttons for choosing particle type
    radioButtonGroupSelectedStroke: {
      //TODO DESIGN not digging this color
      default: 'rgb( 105, 195, 231 )' // blue
    }
  } );

  return gasProperties.register( 'GasPropertiesColorProfile', GasPropertiesColorProfile );
} );