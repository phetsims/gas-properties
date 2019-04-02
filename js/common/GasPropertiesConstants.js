// Copyright 2018-2019, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );

  // for all panel-like containers
  const PANEL_CORNER_RADIUS = 5;
  const PANEL_X_MARGIN = 15;
  const PANEL_Y_MARGIN = 10;

  const GasPropertiesConstants = {

    SCREEN_VIEW_X_MARGIN: 20,
    SCREEN_VIEW_Y_MARGIN: 20,

    MODEL_TIME_STEP: 0.2, // ps

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
        sideLength: 20
      }
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

    HEAVY_PARTICLES_RANGE: new RangeWithValue( 0, 1000, 0 ),
    LIGHT_PARTICLES_RANGE: new RangeWithValue( 0, 1000, 0 ),

    TITLE_FONT: new PhetFont( { size: 18, weight: 'bold' } ),
    CONTROL_FONT: new PhetFont( 16 ),
    AXIS_LABEL_FONT: new PhetFont( 14 ),

    // physics quantities
    BOLTZMANN: 8.316E-3, // Boltzmann constant k, converted to (nm^2 * AMU)/(ps^2 * K) by @arouinfar
    KG_PER_AMU: 1.66E-27, // mass conversion: kg per 1 AMU (atomic mass unit)
    ATM_PER_KPA: 0.00986923 // pressure conversion: atm (atmospheres) per 1 kPa (kilopascal)
  };

  return gasProperties.register( 'GasPropertiesConstants', GasPropertiesConstants );
} );
