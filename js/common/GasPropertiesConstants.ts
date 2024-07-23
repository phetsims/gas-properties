// Copyright 2018-2024, University of Colorado Boulder

/**
 * GasPropertiesConstants is a collection of constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../dot/js/RangeWithValue.js';
import { CreditsData } from '../../../joist/js/CreditsNode.js';
import { ComboBoxDisplayOptions } from '../../../scenery-phet/js/ComboBoxDisplay.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { AccordionBoxOptions } from '../../../sun/js/AccordionBox.js';
import { AquaRadioButtonOptions } from '../../../sun/js/AquaRadioButton.js';
import { CheckboxOptions } from '../../../sun/js/Checkbox.js';
import { PanelOptions } from '../../../sun/js/Panel.js';
import gasProperties from '../gasProperties.js';
import GasPropertiesColors from './GasPropertiesColors.js';
import { ScreenOptions } from '../../../joist/js/Screen.js';
import { SimOptions } from '../../../joist/js/Sim.js';
import platform from '../../../phet-core/js/platform.js';

// for all panel-like containers
const PANEL_CORNER_RADIUS = 5;
const PANEL_X_MARGIN = 15;
const PANEL_Y_MARGIN = 8;

// Credits are shared by all sims in the gas-properties suite. See https://github.com/phetsims/gas-properties/issues/28.
const CREDITS: CreditsData = {
  leadDesign: 'Amy Rouinfar',
  softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
  team: 'Jack Barbera, John Blanco, Michael Dubson, Amy Hanson, Linda Koch, Ron LeMaster, Trish Loeblein, ' +
        'Emily B. Moore, Ariel Paul, Dennis Perepelitsa, Kathy Perkins, Tom Perkins, Nancy Salpepi, Carl Wieman',
  qualityAssurance: 'Jaspe Arias, Jaron Droder, Clifford Hardin, Matthew Moore, Liam Mulhall, Jacob Romero, Nancy Salpepi, Luisa Vargas, Kathryn Woessner'
};

const SIM_OPTIONS: SimOptions = {
  phetioDesigned: true,
  credits: CREDITS,

  // WebGL is typically enabled for high-performance scenery.Sprites, which are used heavily by this sim.
  // On iPadOS, the sim consistently crashed when WebGL was enabled, and we were unable to determine why.
  // Disabling WebGL uses Canvas as the fallback for Sprites. The problem was not present on iOS, but we
  // have no way to differentiate between Safari on iPadOS vs iOS, so WebGL is disabled on both platforms.
  // See https://github.com/phetsims/gas-properties/issues/289.
  webgl: !platform.mobileSafari
};

const ACCORDION_BOX_OPTIONS: AccordionBoxOptions = {
  cornerRadius: PANEL_CORNER_RADIUS,
  contentXMargin: PANEL_X_MARGIN,
  contentYMargin: PANEL_Y_MARGIN,
  buttonXMargin: 10,
  buttonYMargin: 10,
  titleXSpacing: 10,
  titleAlignX: 'left',
  fill: GasPropertiesColors.panelFillProperty,
  stroke: GasPropertiesColors.panelStrokeProperty,
  expandCollapseButtonOptions: {
    sideLength: 20,
    touchAreaXDilation: 6,
    touchAreaYDilation: 6
  },
  phetioFeatured: true,
  visiblePropertyOptions: {
    phetioFeatured: true
  }
};

const AQUA_RADIO_BUTTON_OPTIONS: AquaRadioButtonOptions = {
  radius: 8,
  xSpacing: 10
};

const CHECKBOX_OPTIONS: CheckboxOptions = {
  spacing: 8,
  boxWidth: 16,
  phetioFeatured: true
};

const COMBO_BOX_DISPLAY_OPTIONS: ComboBoxDisplayOptions = {
  highlightFill: 'rgba( 255, 0, 0, 0.1 )',
  align: 'right',
  cornerRadius: 5,
  xMargin: 5,
  yMargin: 4,
  phetioFeatured: true
};

const PANEL_OPTIONS: PanelOptions = {
  align: 'left',
  cornerRadius: PANEL_CORNER_RADIUS,
  xMargin: PANEL_X_MARGIN,
  yMargin: PANEL_Y_MARGIN,
  fill: GasPropertiesColors.panelFillProperty,
  stroke: GasPropertiesColors.panelStrokeProperty,
  phetioFeatured: true,
  visiblePropertyOptions: {
    phetioFeatured: true
  }
};

const SCREEN_OPTIONS: Partial<ScreenOptions> = {
  backgroundColorProperty: GasPropertiesColors.screenBackgroundColorProperty,
  showUnselectedHomeScreenIconFrame: true, // put a gray border around unselected icons on the home screen
  showScreenIconFrameForNavigationBarFill: 'black' // put a gray border around screen icons when the navigation bar is black
};

const GasPropertiesConstants = {

  SIM_OPTIONS: SIM_OPTIONS,

  // margins for all ScreenView instances
  SCREEN_VIEW_X_MARGIN: 20,
  SCREEN_VIEW_Y_MARGIN: 20,

  // time step used when pressing the Step button, in ps
  MODEL_TIME_STEP: 0.2,

  // the Stopwatch pauses at this value, and the StopwatchNode is sized for this max value
  MAX_TIME: 999.99,

  // number of particles
  NUMBER_OF_HEAVY_PARTICLES_RANGE: new RangeWithValue( 0, 1000, 0 ),
  NUMBER_OF_LIGHT_PARTICLES_RANGE: new RangeWithValue( 0, 1000, 0 ),

  // mass
  HEAVY_PARTICLES_MASS: 28, // AMU, equivalent to N2 (nitrogen)
  LIGHT_PARTICLES_MASS: 4, // AMU, equivalent to He (helium, 4.002602), rounded to the closest integer

  // radii
  HEAVY_PARTICLES_RADIUS: 125, // pm
  LIGHT_PARTICLES_RADIUS: 87.5, // pm

  // Ranges for quantities in a Diffusion experiment
  DIFFUSION_NUMBER_OF_PARTICLES_RANGE: new RangeWithValue( 0, 200, 0 ),
  DIFFUSION_MASS_RANGE: new RangeWithValue( 4, 32, 28 ), // AMU
  DIFFUSION_RADIUS_RANGE: new RangeWithValue( 50, 250, 125 ), // pm
  DIFFUSION_INITIAL_TEMPERATURE_RANGE: new RangeWithValue( 50, 500, 300 ), // K

  // default container width
  DEFAULT_CONTAINER_WIDTH: new RangeWithValue( 5000, 15000, 10000 ),

  // width of panels on the right side of the Ideal, Explore, and Energy screens
  RIGHT_PANEL_WIDTH: 225,

  // default font for titles (accordion boxes, groups of controls, ...)
  TITLE_FONT: new PhetFont( { size: 16, weight: 'bold' } ),

  // default font for controls (buttons, checkboxes, ...)
  CONTROL_FONT: new PhetFont( 16 ),

  // mass conversion: kg per 1 AMU (atomic mass unit)
  KG_PER_AMU: 1.66E-27,

  // pressure conversion: atm (atmospheres) per 1 kPa (kilopascal)
  ATM_PER_KPA: 0.00986923,

  // Boltzmann constant k, converted to (pm^2 * AMU)/(ps^2 * K)
  // see https://github.com/phetsims/gas-properties/blob/main/doc/images/boltzmann-conversion.png
  BOLTZMANN: 8.316E3,

  // multiplier for converting pressure from AMU/(pm * ps^2) to kPa
  // see https://github.com/phetsims/gas-properties/blob/main/doc/images/pressure-conversion.png
  PRESSURE_CONVERSION_SCALE: 1.66E6,

  // Defaults for all AccordionBox instances
  ACCORDION_BOX_OPTIONS: ACCORDION_BOX_OPTIONS,

  // Defaults for all AquaRadioButton instances
  AQUA_RADIO_BUTTON_OPTIONS: AQUA_RADIO_BUTTON_OPTIONS,

  // Defaults for all Checkbox instances
  CHECKBOX_OPTIONS: CHECKBOX_OPTIONS,

  // Defaults for all ComboBoxDisplay instances
  COMBO_BOX_DISPLAY_OPTIONS: COMBO_BOX_DISPLAY_OPTIONS,

  // Defaults for all Panel instances
  PANEL_OPTIONS: PANEL_OPTIONS,

  // Vertical space between panels and accordion boxes.
  PANELS_Y_SPACING: 8,

  // Defaults for all Screens.
  SCREEN_OPTIONS: SCREEN_OPTIONS,

  // Options for the ArrowNode used to indicate the velocity of the container's left wall
  VELOCITY_ARROW_NODE_OPTIONS: {
    headWidth: 30,
    headHeight: 20,
    tailWidth: 10,
    fill: GasPropertiesColors.velocityVectorColorProperty
  }
};

gasProperties.register( 'GasPropertiesConstants', GasPropertiesConstants );
export default GasPropertiesConstants;