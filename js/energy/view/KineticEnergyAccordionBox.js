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
  const KineticEnergyHistogramNode = require( 'GAS_PROPERTIES/energy/view/KineticEnergyHistogramNode' );
  const merge = require( 'PHET_CORE/merge' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Tandem = require( 'TANDEM/Tandem' );

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

      options = merge( {

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      const histogramNode = new KineticEnergyHistogramNode( histogramsModel, {
        tandem: options.tandem.createTandem( 'histogramNode' )
      } );

      super( kineticEnergyString, modelViewTransform, histogramNode, options );
    }
  }

  return gasProperties.register( 'KineticEnergyAccordionBox', KineticEnergyAccordionBox );
} );