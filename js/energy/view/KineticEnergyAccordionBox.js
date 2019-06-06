// Copyright 2019, University of Colorado Boulder

/**
 * KineticEnergyAccordionBox contains the 'Kinetic Energy' histogram and related controls.
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
  const KineticEnergyHistogramNode = require( 'GAS_PROPERTIES/energy/view/KineticEnergyHistogramNode' );

  // strings
  const kineticEnergyString = require( 'string!GAS_PROPERTIES/kineticEnergy' );

  class KineticEnergyAccordionBox extends EnergyAccordionBox {

    /**
     * @param {HistogramsModel} histogramsModel
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( histogramsModel, modelViewTransform, options ) {
      assert && assert( histogramsModel instanceof HistogramsModel, `invalid model: ${histogramsModel}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );

      super( kineticEnergyString, modelViewTransform, new KineticEnergyHistogramNode( histogramsModel ), options );
    }
  }

  return gasProperties.register( 'KineticEnergyAccordionBox', KineticEnergyAccordionBox );
} );