// Copyright 2018-2025, University of Colorado Boulder

/**
 * GasPropertiesColors defines the colors for this simulation.
 * These colors change based on which profile is selected.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import gasProperties from '../gasProperties.js';

const GasPropertiesColors = {

  // background color for all screens
  screenBackgroundColorProperty: new ProfileColorProperty( gasProperties, 'screenBackgroundColor', {
    default: 'black',
    projector: 'white'
  } ),

  // fill for control panels
  panelFillProperty: new ProfileColorProperty( gasProperties, 'panelFill', {
    default: 'rgb( 40, 40, 40 )',
    projector: 'rgb( 235, 235, 235 )'
  } ),

  // stroke for control panels
  panelStrokeProperty: new ProfileColorProperty( gasProperties, 'panelStroke', {
    default: 'rgb( 55, 55, 55 )',
    projector: 'rgb( 220, 220, 220 )'
  } ),

  // default fill for text
  textFillProperty: new ProfileColorProperty( gasProperties, 'textFill', {
    default: 'white',
    projector: 'black'
  } ),

  // fill for check boxes
  checkboxFillProperty: new ProfileColorProperty( gasProperties, 'checkboxFill', {
    default: 'black',
    projector: 'white'
  } ),

  // stroke for check boxes
  checkboxStrokeProperty: new ProfileColorProperty( gasProperties, 'checkboxStroke', {
    default: 'white',
    projector: 'black'
  } ),

  // radio buttons for choosing particle type
  radioButtonGroupBaseColorProperty: new ProfileColorProperty( gasProperties, 'radioButtonGroupBaseColor', {
    default: 'black',
    projector: 'white'
  } ),

  // radio buttons for choosing particle type
  radioButtonGroupDeselectedStrokeProperty: new ProfileColorProperty( gasProperties, 'radioButtonGroupDeselectedStroke', {
    default: 'rgb( 240, 240, 240 )',
    projector: 'rgb( 180, 180, 180 )'
  } ),

  // walls of the container
  containerBoundsStrokeProperty: new ProfileColorProperty( gasProperties, 'containerBoundsStroke', {
    default: 'white',
    projector: 'black'
  } ),

  // bounds of the previous container size, shown while the container is being resized
  containerPreviousBoundsStrokeProperty: new ProfileColorProperty( gasProperties, 'containerPreviousBoundsStroke', {
    default: 'rgb( 100, 100, 100 )',
    projector: 'rgb( 220, 220, 220 )'
  } ),

  // base of the lid, the part that the handle attaches to
  lidBaseFillProperty: new ProfileColorProperty( gasProperties, 'lidBaseFill', {
    default: 'rgb( 180, 180, 180 )',
    projector: 'rgb( 128, 128, 128 )'
  } ),

  // dimensional arrow that appears below the container
  sizeArrowColorProperty: new ProfileColorProperty( gasProperties, 'sizeArrowColor', {
    default: 'white',
    projector: 'black'
  } ),

  // icon for the 'Width' checkbox
  widthIconColorProperty: new ProfileColorProperty( gasProperties, 'widthIconColor', {
    default: 'white',
    projector: 'black'
  } ),

  // stroke around center-of-mass indicators
  centerOfMassStrokeProperty: new ProfileColorProperty( gasProperties, 'centerOfMassStroke', {
    default: 'white',
    projector: 'black'
  } ),

  // the scale that appears below the container in the Diffusion screen
  scaleColorProperty: new ProfileColorProperty( gasProperties, 'scaleColor', {
    default: 'rgb( 220, 220, 220 )',
    projector: 'rgb( 100, 100, 100 )'
  } ),

  // enabled with ?grid query parameter
  gridColorProperty: new ProfileColorProperty( gasProperties, 'gridColor', {
    default: 'white',
    projector: 'black'
  } ),

  // enabled with ?pointerCoordinates query parameter
  pointerCoordinatesTextColorProperty: new ProfileColorProperty( gasProperties, 'pointerCoordinatesTextColor', {
    default: 'white',
    projector: 'black'
  } ),

  // enabled with ?pointerCoordinates query parameter
  pointerCoordinatesBackgroundColorProperty: new ProfileColorProperty( gasProperties, 'pointerCoordinatesBackgroundColor', {
    default: 'rgba( 0, 0, 0, 0.5 )',
    projector: 'rgba( 255, 255, 255, 0.5 )'
  } ),

  // primary color for heavy particles
  heavyParticleColorProperty: new ProfileColorProperty( gasProperties, 'heavyParticleColor', {
    default: 'rgb( 119, 114, 244 )' // purple
  } ),

  // specular highlight for heavy particles
  heavyParticleHighlightColorProperty: new ProfileColorProperty( gasProperties, 'heavyParticleHighlightColor', {
    default: 'rgb( 220, 220, 255 )' // lighter shade of heavyParticleColor
  } ),

  // primary color for light particles
  lightParticleColorProperty: new ProfileColorProperty( gasProperties, 'lightParticleColor', {
    default: 'rgb( 232, 78, 32 )' // red
  } ),

  // specular highlight for light particles
  lightParticleHighlightColorProperty: new ProfileColorProperty( gasProperties, 'lightParticleHighlightColor', {
    default: 'rgb( 255, 170, 170 )' // lighter shade of lightParticleColor
  } ),

  // primary color for particle type 1 in Diffusion screen
  diffusionParticle1ColorProperty: new ProfileColorProperty( gasProperties, 'diffusionParticle1Color', {
    default: 'rgb( 0, 230, 255)' // cyan
  } ),

  // specular highlight for particle type 1 in Diffusion screen
  diffusionParticle1HighlightColorProperty: new ProfileColorProperty( gasProperties, 'diffusionParticle1HighlightColor', {
    default: 'rgb( 203, 247, 252 )' // lighter shade of particle1Color
  } ),

  // primary color for particle type 2 in Diffusion screen
  diffusionParticle2ColorProperty: new ProfileColorProperty( gasProperties, 'diffusionParticle2Color', {
    default: 'rgb( 232, 78, 32 )' // red
  } ),

  // specular highlight for particle type 2 in Diffusion screen
  diffusionParticle2HighlightColorProperty: new ProfileColorProperty( gasProperties, 'diffusionParticle2HighlightColor', {
    default: 'rgb( 255, 170, 170 )' // lighter shade of particle2Color
  } ),

  stopwatchBackgroundColorProperty: new ProfileColorProperty( gasProperties, 'stopwatchBackgroundColor', {
    default: 'rgb(  80, 130, 230  )' // blue
  } ),

  collisionCounterBackgroundColorProperty: new ProfileColorProperty( gasProperties, 'collisionCounterBackgroundColor', {
    default: 'rgb( 254, 212, 131 )' // yellowish
  } ),

  // pseudo-3D bezel around the outer edge of the collision counter
  collisionCounterBezelColorProperty: new ProfileColorProperty( gasProperties, 'collisionCounterBezelColor', {
    default: 'rgb( 90, 90, 90 )'
  } ),

  // radio buttons for choosing particle type
  radioButtonGroupSelectedStrokeProperty: new ProfileColorProperty( gasProperties, 'radioButtonGroupSelectedStroke', {
    default: 'rgb( 105, 195, 231 )' // blue
  } ),

  // handle on the container's lid
  lidHandleColorProperty: new ProfileColorProperty( gasProperties, 'lidHandleColor', {
    default: 'rgb( 160, 160, 160 )'
  } ),

  // handle on the container's resize handle
  resizeHandleColorProperty: new ProfileColorProperty( gasProperties, 'resizeHandleColor', {
    default: 'rgb( 160, 160, 160 )'
  } ),

  // bars in the Speed histogram
  speedHistogramBarColorProperty: new ProfileColorProperty( gasProperties, 'speedHistogramBarColor', {
    default: 'white'
  } ),

  // bars in the Kinetic Energy histogram
  kineticEnergyHistogramBarColorProperty: new ProfileColorProperty( gasProperties, 'kineticEnergyHistogramBarColor', {
    default: PhetColorScheme.KINETIC_ENERGY
  } ),

  // container divider in the Diffusion screen
  dividerColorProperty: new ProfileColorProperty( gasProperties, 'dividerColor', {
    default: 'rgb( 70, 205, 85 )'
  } ),

  // eraser button that is used to clear particles from the container
  eraserButtonColorProperty: new ProfileColorProperty( gasProperties, 'eraserButtonColor', {
    default: 'rgb( 220, 220, 220 )'
  } ),

  // vector for indicating that the velocity of the container's left wall
  velocityVectorColorProperty: new ProfileColorProperty( gasProperties, 'workVectorColor', {
    default: PhetColorScheme.VELOCITY
  } )
};

gasProperties.register( 'GasPropertiesColors', GasPropertiesColors );
export default GasPropertiesColors;