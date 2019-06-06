// Copyright 2019, University of Colorado Boulder

/**
 * SpeedAccordionBox contains the 'Speed' histogram and related controls.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const EnergyAccordionBox = require( 'GAS_PROPERTIES/energy/view/EnergyAccordionBox' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const HistogramsModel = require( 'GAS_PROPERTIES/energy/model/HistogramsModel' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const SpeedHistogramNode = require( 'GAS_PROPERTIES/energy/view/SpeedHistogramNode' );

  // strings
  const speedString = require( 'string!GAS_PROPERTIES/speed' );

  class SpeedAccordionBox extends EnergyAccordionBox {

    /**
     * @param {HistogramsModel} histogramsModel
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( histogramsModel, modelViewTransform, options ) {
      assert && assert( histogramsModel instanceof HistogramsModel, `invalid model: ${histogramsModel}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );

      super( speedString, modelViewTransform, new SpeedHistogramNode( histogramsModel ), options );
    }
  }

  return gasProperties.register( 'SpeedAccordionBox', SpeedAccordionBox );
} );