// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model for the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );

  class DiffusionModel {

    constructor() {
      //TODO constructor
    }

    reset() {
      //TODO reset
    }

    /**
     * Steps the model using real time units.
     * @param {number} dt - time delta, in seconds
     * @public
     */
    step( dt ) {
      //TODO step
    }

    /**
     * Steps the model using model time units.
     * @param {number} dt - time delta, in ps
     * @private
     */
    stepModelTime( dt ) {
      //TODO
    }
  }

  return gasProperties.register( 'DiffusionModel', DiffusionModel );
} );