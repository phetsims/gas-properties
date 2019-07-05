// Copyright 2019, University of Colorado Boulder

/**
 * IdealModel is the top-level model for the 'Ideal' screen.
 * It adds no additional functionality to the base class, but is provided for symmetry in the model-view type hierarchy.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const IdealGasLawModel = require( 'GAS_PROPERTIES/common/model/IdealGasLawModel' );
  const Tandem = require( 'TANDEM/Tandem' );

  class IdealModel extends IdealGasLawModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );
      super( tandem );
    }
  }

  return gasProperties.register( 'IdealModel', IdealModel );
} );