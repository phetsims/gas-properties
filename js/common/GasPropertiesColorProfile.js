// Copyright 2018-2019, University of Colorado Boulder

/**
 * Color profiles for this simulation.
 * Default colors are required. Colors for other profiles are optional.
 * Profile 'projector' is used for Projector Mode, which can be set via the Options dialog.
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
      default: 'rgb( 40, 40, 40 )',
      projector: 'rgb( 235, 235, 235 )'
    },

    // stroke for control panels
    panelStroke: {
      default: 'rgb( 55, 55, 55 )',
      projector: 'rgb( 220, 220, 220 )'
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

    // dimensional arrow that appears below the container
    sizeArrowColor: {
      default: 'white',
      projector: 'black'
    },

    // icon for the 'Width' checkbox
    widthIconColor: {
      default: 'white',
      projector: 'black'
    },

    // stroke around center-of-mass indicators
    centerOfMassStroke: {
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
    // These colors currently do NOT change in projector mode. They are included here for future-proofing,
    // and to facilitate experimenting with colors in gas-properties-colors.html.
    //------------------------------------------------------------------------------------------------------------------

    // primary color for heavy particles
    heavyParticleColor: {
      default: 'rgb( 119, 114, 244 )' // purple
    },

    // specular highlight for heavy particles
    heavyParticleHighlightColor: {
      default: 'rgb( 220, 220, 255 )' // lighter shade of heavyParticleColor
    },

    // primary color for light particles
    lightParticleColor: {
      default: 'rgb( 232, 78, 32 )' // red
    },

    // specular highlight for light particles
    lightParticleHighlightColor: {
      default: 'rgb( 255, 170, 170 )' // lighter shade of lightParticleColor
    },

    // primary color for 1st particle type in Diffusion screen
    particle1Color: {
      default: 'rgb( 0, 230, 255)' // cyan
    },

    // specular highlight for 1st particle type in Diffusion screen
    particle1HighlightColor: {
      default: 'rgb( 203, 247, 252 )' // lighter shade of particle1Color
    },

    // primary color for 2nd particle type in Diffusion screen
    particle2Color: {
      default: 'rgb( 232, 78, 32 )' // red
    },

    // specular highlight for 2nd particle type in Diffusion screen
    particle2HighlightColor: {
      default: 'rgb( 255, 170, 170 )' // lighter shade of particle2Color
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

    // grip on the container's resize handle in the Ideal screen
    idealResizeGripColor: {
      default: 'rgb( 187, 154, 86 )' // gold
    },

    // bars in the Speed histogram
    speedHistogramBarColor: {
      default: 'white'
    },

    // bars in the Kinetic Energy histogram
    kineticEnergyHistogramBarColor: {
      default: PhetColorScheme.KINETIC_ENERGY
    },

    // container divider in the Diffusion screen
    dividerColor: {
      default: 'rgb( 70, 205, 85 )'
    },

    // color of the eraser button that is used to clear particles from the container
    eraserButtonColor: {
      default: 'rgb( 242, 242, 242 )'
    }
  } );

  return gasProperties.register( 'GasPropertiesColorProfile', GasPropertiesColorProfile );
} );