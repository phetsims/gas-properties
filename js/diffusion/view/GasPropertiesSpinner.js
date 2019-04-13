// Copyright 2019, University of Colorado Boulder

/**
 * Specialization of NumberSpinner for this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const NumberSpinner = require( 'SUN/NumberSpinner' );
  const Property = require( 'AXON/Property' );

  class GasPropertiesSpinner extends NumberSpinner {

    /**
     * @param {NumberProperty} numberProperty
     * @param {Range} range
     * @param {Object} [options]
     */
    constructor( numberProperty, range, options ) {

      options = _.extend( {
        font: GasPropertiesConstants.CONTROL_FONT,
        xMargin: 8,
        yMargin: 6,
        valueAlign: 'right',
        touchAreaXDilation: 15,
        touchAreaYDilation: 15
      }, options );

      super( numberProperty, new Property( range), options );
    }
  }

  return gasProperties.register( 'GasPropertiesSpinner', GasPropertiesSpinner );
} );