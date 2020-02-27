// Copyright 2018-2019, University of Colorado Boulder

/**
 * GasPropertiesConstants is a collection of constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RangeWithValue from '../../../dot/js/RangeWithValue.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import gasProperties from '../gasProperties.js';
import GasPropertiesColorProfile from './GasPropertiesColorProfile.js';

// for all panel-like containers
const PANEL_CORNER_RADIUS = 5;
const PANEL_X_MARGIN = 15;
const PANEL_Y_MARGIN = 10;

const GasPropertiesConstants = {

  // Shared by gas-properties-main.js and its derivatives (gases-intro.main.js, and diffusion-main.js)
  // See https://github.com/phetsims/gas-properties/issues/28
  CREDITS: {
    leadDesign: 'Amy Rouinfar',
    softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
    team: 'Jack Barbera, John Blanco, Michael Dubson, Amy Hanson, Linda Koch, Ron LeMaster, Trish Loeblein, ' +
          'Emily B. Moore, Ariel Paul, Kathy Perkins, Carl Wieman',
    qualityAssurance: 'Jaspe Arias, Liam Mulhall, Jacob Romero, Kathryn Woessner',
    graphicArts: '',
    thanks: ''
  },

  // margins for all ScreenView instances
  SCREEN_VIEW_X_MARGIN: 20,
  SCREEN_VIEW_Y_MARGIN: 20,

  // time step used when pressing the Step button, in ps
  MODEL_TIME_STEP: 0.2,

  // number of particles
  HEAVY_PARTICLES_RANGE: new RangeWithValue( 0, 1000, 0 ),
  LIGHT_PARTICLES_RANGE: new RangeWithValue( 0, 1000, 0 ),

  // radii
  HEAVY_PARTICLES_RADIUS: 125, // pm
  LIGHT_PARTICLES_RADIUS: 87.5, // pm

  // Ranges for quantities in a Diffusion experiment
  NUMBER_OF_PARTICLES_RANGE: new RangeWithValue( 0, 200, 0 ),
  MASS_RANGE: new RangeWithValue( 4, 32, 28 ), // AMU
  RADIUS_RANGE: new RangeWithValue( 50, 250, 125 ), // pm
  INITIAL_TEMPERATURE_RANGE: new RangeWithValue( 50, 500, 300 ), // K

  // Defaults for all AccordionBox instances
  ACCORDION_BOX_OPTIONS: {
    cornerRadius: PANEL_CORNER_RADIUS,
    contentXMargin: PANEL_X_MARGIN,
    contentYMargin: PANEL_Y_MARGIN,
    buttonXMargin: 10,
    buttonYMargin: 10,
    titleXSpacing: 10,
    titleAlignX: 'left',
    fill: GasPropertiesColorProfile.panelFillProperty,
    stroke: GasPropertiesColorProfile.panelStrokeProperty,
    expandCollapseButtonOptions: {
      sideLength: 20,
      touchAreaXDilation: 6,
      touchAreaYDilation: 6
    }
  },

  // Defaults for all AquaRadioButton instances
  AQUA_RADIO_BUTTON_OPTIONS: {
    radius: 8,
    xSpacing: 10
  },

  // Defaults for all Panel instances
  PANEL_OPTIONS: {
    align: 'left',
    cornerRadius: PANEL_CORNER_RADIUS,
    xMargin: PANEL_X_MARGIN,
    yMargin: PANEL_Y_MARGIN,
    fill: GasPropertiesColorProfile.panelFillProperty,
    stroke: GasPropertiesColorProfile.panelStrokeProperty
  },

  // Defaults for all ComboBoxDisplay instances
  COMBO_BOX_DISPLAY_OPTIONS: {
    highlightFill: 'rgba( 255, 0, 0, 0.1 )',
    align: 'right',
    cornerRadius: 5,
    xMargin: 5,
    yMargin: 4
  },

  // Defaults for all Checkbox instances
  CHECKBOX_OPTIONS: {
    spacing: 8,
    boxWidth: 16
  },

  // width of panels on the right side of the Ideal, Explore, and Energy screens
  RIGHT_PANEL_WIDTH: 225,

  // default font for titles (accordion boxes, groups of controls, ...)
  TITLE_FONT: new PhetFont( { size: 18, weight: 'bold' } ),

  // default font for controls (buttons, checkboxes, ...)
  CONTROL_FONT: new PhetFont( 16 ),

  // spacing of the horizontal lines in the histograms, in number of particles
  HISTOGRAM_LINE_SPACING: 50,

  // mass conversion: kg per 1 AMU (atomic mass unit)
  KG_PER_AMU: 1.66E-27,

  // pressure conversion: atm (atmospheres) per 1 kPa (kilopascal)
  ATM_PER_KPA: 0.00986923,

  // Boltzmann constant k, converted to (pm^2 * AMU)/(ps^2 * K)
  // see https://github.com/phetsims/gas-properties/blob/master/doc/images/boltzmann-conversion.png
  BOLTZMANN: 8.316E3,

  // multiplier for converting pressure from AMU/(pm * ps^2) to kPa
  // see https://github.com/phetsims/gas-properties/blob/master/doc/images/pressure-conversion.png
  PRESSURE_CONVERSION_SCALE: 1.66E6
};

gasProperties.register( 'GasPropertiesConstants', GasPropertiesConstants );
export default GasPropertiesConstants;