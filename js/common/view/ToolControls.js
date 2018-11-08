// Copyright 2018, University of Colorado Boulder

/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const SizeCheckbox = require( 'GAS_PROPERTIES/common/view/SizeCheckbox' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const collisionCounterString = require( 'string!GAS_PROPERTIES/collisionCounter' );
  const stopwatchString = require( 'string!GAS_PROPERTIES/stopwatch' );

  // constants
  const TEXT_OPTIONS = {
    font: GasPropertiesConstants.CONTROL_FONT,
    fill: GasPropertiesColors.FOREGROUND_COLOR
  };

  class ToolControls extends VBox {

    /**
     * @param {BooleanProperty} sizeVisibleProperty
     * @param {BooleanProperty} stopwatchVisibleProperty
     * @param {BooleanProperty} collisionCounterVisibleProperty
     * @param {Object} [options]
     */
    constructor( sizeVisibleProperty, stopwatchVisibleProperty, collisionCounterVisibleProperty, options ) {

      options = _.extend( {

        // VBox options
        align: 'left',
        spacing: 15
      }, options );

      const sizeCheckbox = new SizeCheckbox( sizeVisibleProperty );

      const stopwatchCheckbox = new Checkbox( new Text( stopwatchString, TEXT_OPTIONS ),
        stopwatchVisibleProperty );

      const collisionControlCheckbox = new Checkbox( new Text( collisionCounterString, TEXT_OPTIONS ),
        collisionCounterVisibleProperty );

      assert && assert( !options.children, 'ToolControls sets children' );
      options.children = [ sizeCheckbox, stopwatchCheckbox, collisionControlCheckbox ];

      super( options );
    }
  }

  return gasProperties.register( 'ToolControls', ToolControls );
} );