// Copyright 2018-2019, University of Colorado Boulder

/**
 * IdealViewProperties defines Properties that are specific to the view in the 'Ideal' screen.
 * It adds no additional Properties to the base class, but is provided for symmetry in the model-view type hierarchy.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const IdealGasLawViewProperties = require( 'GAS_PROPERTIES/common/view/IdealGasLawViewProperties' );

  class IdealViewProperties extends IdealGasLawViewProperties {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      super( tandem );
    }
  }

  return gasProperties.register( 'IdealViewProperties', IdealViewProperties );
} );