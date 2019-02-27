// Copyright 2018, University of Colorado Boulder

/**
 * 'Stopwatch' check box, used to control visibility of the stopwatch.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );

  // strings
  const stopwatchString = require( 'string!GAS_PROPERTIES/stopwatch' );

  class StopwatchCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} stopwatchVisibleProperty
     * @param {Object} [options]
     */
    constructor( stopwatchVisibleProperty, options ) {

      options = options || {};

      assert && assert( !options.icon, 'StopwatchCheckbox sets icon' );
      options.icon = GasPropertiesIconFactory.createStopwatchIcon();

      super( stopwatchString, stopwatchVisibleProperty, options );
    }
  }

  return gasProperties.register( 'StopwatchCheckbox', StopwatchCheckbox );
} ); 