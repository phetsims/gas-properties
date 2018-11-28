// Copyright 2018, University of Colorado Boulder

/**
 * 'Stopwatch' check box, used to control visibility of the stopwatch.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const StopwatchNode = require( 'GAS_PROPERTIES/common/view/StopwatchNode' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const stopwatchString = require( 'string!GAS_PROPERTIES/stopwatch' );

  class StopwatchCheckbox extends Checkbox {

    /**
     * @param {BooleanProperty} stopwatchVisibleProperty
     * @param {Object} [options]
     */
    constructor( stopwatchVisibleProperty, options ) {

      const textNode = new Text( stopwatchString, {
          font: GasPropertiesConstants.CONTROL_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } );

      const iconNode = StopwatchNode.createIcon( {
        scale: 0.25
      } );

      const content = new HBox( {
        spacing: 8,
        children: [ textNode, iconNode ]
      });

      super( content, stopwatchVisibleProperty, options );
    }
  }

  return gasProperties.register( 'StopwatchCheckbox', StopwatchCheckbox );
} ); 