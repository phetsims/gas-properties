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
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );

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
    checkboxFill: {
      default: 'black',
      projector: 'white'
    },

    // stroke for check boxes
    checkboxStroke: {
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

    // Container divider in the Diffusion screen
    dividerColor: {
      default: 'rgb( 243, 235, 87 )',
      projector: 'rgb( 217, 50, 138 )'
    },

    // Stroke around center-of-mass indicators
    centerOfMassStroke: {
      default: 'white',
      projector: 'black'
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

    // primary color for 1st particle type in Diffusion screen
    particle1Color: {
      default: 'rgb( 115, 251, 253 )' // cyan
    },

    // specular highlight for 1st particle type in Diffusion screen
    particle1HighlightColor: {
      default: 'rgb( 203, 247, 252 )' // lighter cyan
    },

    // primary color for 2nd particle type in Diffusion screen
    particle2Color: {
      default: 'rgb( 232, 78, 32 )' // red
    },

    // specular highlight for 2nd particle type in Diffusion screen
    particle2HighlightColor: {
      default: 'rgb( 255, 170, 170 )' // lighter red
    },

    stopwatchBackgroundColor: {
      default: 'rgb(  80, 130, 230  )' // blue
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
      default: 'rgb( 105, 195, 231 )' // blue
    },

    // grip on the container's lid
    lidGripColor: {
      default: 'rgb( 160, 160, 160 )'
    },

    // default grip on the container's resize handle
    resizeGripColor: {
      default: 'rgb( 160, 160, 160 )'
    },

    // Ideal screen, grip on the container's resize handle
    idealResizeGripColor: {
      default: 'rgb( 187, 154, 86 )'
    },

    // bars in the Speed histogram
    speedHistogramBarColor: {
      default: 'white'
    },

    // bars in the Kinetic Energy histogram
    kineticEnergyHistogramBarColor: {
      default: PhetColorScheme.KINETIC_ENERGY
    }
  } );

  return gasProperties.register( 'GasPropertiesColorProfile', GasPropertiesColorProfile );
} );