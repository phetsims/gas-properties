// Copyright 2018-2019, University of Colorado Boulder

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

      if ( options ) {
        assert && assert( !options.text, 'StopwatchCheckbox sets text' );
        assert && assert( !options.icon, 'StopwatchCheckbox sets icon' );
      }

      options = _.extend( {
        text: stopwatchString,
        icon: GasPropertiesIconFactory.createStopwatchIcon()
      }, options );

      super( stopwatchVisibleProperty, options );
    }
  }

  return gasProperties.register( 'StopwatchCheckbox', StopwatchCheckbox );
} ); 