// Copyright 2018-2021, University of Colorado Boulder

/**
 * GasPropertiesColorProfile defines the color profiles for this simulation.
 * Default colors are required. Colors for other profiles are optional.
 * Profile 'projector' is used for Projector Mode, which can be set via the Options dialog.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import gasProperties from '../gasProperties.js';

const GasPropertiesColorProfile = {

  //------------------------------------------------------------------------------------------------------------------
  // These colors change based on which profile is selected.
  //------------------------------------------------------------------------------------------------------------------

  screenBackgroundColorProperty: new ProfileColorProperty( 'screenBackgroundColor', {
    default: 'black',
    projector: 'white'
  } ),

  // fill for control panels
  panelFillProperty: new ProfileColorProperty( 'panelFill', {
    default: 'rgb( 40, 40, 40 )',
    projector: 'rgb( 235, 235, 235 )'
  } ),

  // stroke for control panels
  panelStrokeProperty: new ProfileColorProperty( 'panelStroke', {
    default: 'rgb( 55, 55, 55 )',
    projector: 'rgb( 220, 220, 220 )'
  } ),

  // default fill for text
  textFillProperty: new ProfileColorProperty( 'textFill', {
    default: 'white',
    projector: 'black'
  } ),

  // fill for check boxes
  checkboxFillProperty: new ProfileColorProperty( 'checkboxFill', {
    default: 'black',
    projector: 'white'
  } ),

  // stroke for check boxes
  checkboxStrokeProperty: new ProfileColorProperty( 'checkboxStroke', {
    default: 'white',
    projector: 'black'
  } ),

  // radio buttons for choosing particle type
  radioButtonGroupBaseColorProperty: new ProfileColorProperty( 'radioButtonGroupBaseColor', {
    default: 'black',
    projector: 'white'
  } ),

  // radio buttons for choosing particle type
  radioButtonGroupDeselectedStrokeProperty: new ProfileColorProperty( 'radioButtonGroupDeselectedStroke', {
    default: 'rgb( 240, 240, 240 )',
    projector: 'rgb( 180, 180, 180 )'
  } ),

  // walls of the container
  containerBoundsStrokeProperty: new ProfileColorProperty( 'containerBoundsStroke', {
    default: 'white',
    projector: 'black'
  } ),

  // bounds of the previous container size, shown while the container is being resized
  containerPreviousBoundsStrokeProperty: new ProfileColorProperty( 'containerPreviousBoundsStroke', {
    default: 'rgb( 100, 100, 100 )',
    projector: 'rgb( 220, 220, 220 )'
  } ),

  // base of the lid, the part that the handle attaches to
  lidBaseFillProperty: new ProfileColorProperty( 'lidBaseFill', {
    default: 'rgb( 180, 180, 180 )',
    projector: 'rgb( 128, 128, 128 )'
  } ),

  // dimensional arrow that appears below the container
  sizeArrowColorProperty: new ProfileColorProperty( 'sizeArrowColor', {
    default: 'white',
    projector: 'black'
  } ),

  // icon for the 'Width' checkbox
  widthIconColorProperty: new ProfileColorProperty( 'widthIconColor', {
    default: 'white',
    projector: 'black'
  } ),

  // stroke around center-of-mass indicators
  centerOfMassStrokeProperty: new ProfileColorProperty( 'centerOfMassStroke', {
    default: 'white',
    projector: 'black'
  } ),

  // the scale that appears below the container in the Diffusion screen
  scaleColorProperty: new ProfileColorProperty( 'scaleColor', {
    default: 'rgb( 220, 220, 220 )',
    projector: 'rgb( 100, 100, 100 )'
  } ),

  // enabled with ?grid query parameter
  gridColorProperty: new ProfileColorProperty( 'gridColor', {
    default: 'white',
    projector: 'black'
  } ),

  // enabled with ?pointerCoordinates query parameter
  pointerCoordinatesTextColorProperty: new ProfileColorProperty( 'pointerCoordinatesTextColor', {
    default: 'white',
    projector: 'black'
  } ),

  // enabled with ?pointerCoordinates query parameter
  pointerCoordinatesBackgroundColorProperty: new ProfileColorProperty( 'pointerCoordinatesBackgroundColor', {
    default: 'rgba( 0, 0, 0, 0.5 )',
    projector: 'rgba( 255, 255, 255, 0.5 )'
  } ),

  //------------------------------------------------------------------------------------------------------------------
  // These colors currently do NOT change in projector mode. They are included here for future-proofing,
  // and to facilitate experimenting with colors in gas-properties-colors.html.
  //------------------------------------------------------------------------------------------------------------------

  // primary color for heavy particles
  heavyParticleColorProperty: new ProfileColorProperty( 'heavyParticleColor', {
    default: 'rgb( 119, 114, 244 )' // purple
  } ),

  // specular highlight for heavy particles
  heavyParticleHighlightColorProperty: new ProfileColorProperty( 'heavyParticleHighlightColor', {
    default: 'rgb( 220, 220, 255 )' // lighter shade of heavyParticleColor
  } ),

  // primary color for light particles
  lightParticleColorProperty: new ProfileColorProperty( 'lightParticleColor', {
    default: 'rgb( 232, 78, 32 )' // red
  } ),

  // specular highlight for light particles
  lightParticleHighlightColorProperty: new ProfileColorProperty( 'lightParticleHighlightColor', {
    default: 'rgb( 255, 170, 170 )' // lighter shade of lightParticleColor
  } ),

  // primary color for 1st particle type in Diffusion screen
  particle1ColorProperty: new ProfileColorProperty( 'particle1Color', {
    default: 'rgb( 0, 230, 255)' // cyan
  } ),

  // specular highlight for 1st particle type in Diffusion screen
  particle1HighlightColorProperty: new ProfileColorProperty( 'particle1HighlightColor', {
    default: 'rgb( 203, 247, 252 )' // lighter shade of particle1Color
  } ),

  // primary color for 2nd particle type in Diffusion screen
  particle2ColorProperty: new ProfileColorProperty( 'particle2Color', {
    default: 'rgb( 232, 78, 32 )' // red
  } ),

  // specular highlight for 2nd particle type in Diffusion screen
  particle2HighlightColorProperty: new ProfileColorProperty( 'particle2HighlightColor', {
    default: 'rgb( 255, 170, 170 )' // lighter shade of particle2Color
  } ),

  stopwatchBackgroundColorProperty: new ProfileColorProperty( 'stopwatchBackgroundColor', {
    default: 'rgb(  80, 130, 230  )' // blue
  } ),

  collisionCounterBackgroundColorProperty: new ProfileColorProperty( 'collisionCounterBackgroundColor', {
    default: 'rgb( 254, 212, 131 )' // yellowish
  } ),

  // pseudo-3D bezel around the outer edge of the collision counter
  collisionCounterBezelColorProperty: new ProfileColorProperty( 'collisionCounterBezelColor', {
    default: 'rgb( 90, 90, 90 )'
  } ),

  // horizontal separator in control panels
  separatorColorProperty: new ProfileColorProperty( 'separatorColor', {
    default: 'rgb( 100, 100, 100)'
  } ),

  // radio buttons for choosing particle type
  radioButtonGroupSelectedStrokeProperty: new ProfileColorProperty( 'radioButtonGroupSelectedStroke', {
    default: 'rgb( 105, 195, 231 )' // blue
  } ),

  // grip on the container's lid
  lidGripColorProperty: new ProfileColorProperty( 'lidGripColor', {
    default: 'rgb( 160, 160, 160 )'
  } ),

  // default grip on the container's resize handle
  resizeGripColorProperty: new ProfileColorProperty( 'resizeGripColor', {
    default: 'rgb( 160, 160, 160 )'
  } ),

  // grip on the container's resize handle in the Ideal screen
  idealResizeGripColorProperty: new ProfileColorProperty( 'idealResizeGripColor', {
    default: 'rgb( 187, 154, 86 )' // gold
  } ),

  // bars in the Speed histogram
  speedHistogramBarColorProperty: new ProfileColorProperty( 'speedHistogramBarColor', {
    default: 'white'
  } ),

  // bars in the Kinetic Energy histogram
  kineticEnergyHistogramBarColorProperty: new ProfileColorProperty( 'kineticEnergyHistogramBarColor', {
    default: PhetColorScheme.KINETIC_ENERGY
  } ),

  // container divider in the Diffusion screen
  dividerColorProperty: new ProfileColorProperty( 'dividerColor', {
    default: 'rgb( 70, 205, 85 )'
  } ),

  // eraser button that is used to clear particles from the container
  eraserButtonColorProperty: new ProfileColorProperty( 'eraserButtonColor', {
    default: 'rgb( 220, 220, 220 )'
  } )
};

gasProperties.register( 'GasPropertiesColorProfile', GasPropertiesColorProfile );
export default GasPropertiesColorProfile;