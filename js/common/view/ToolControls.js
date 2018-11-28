// Copyright 2018, University of Colorado Boulder

/**
 * Controls for making various tools visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CollisionCounterCheckbox = require( 'GAS_PROPERTIES/common/view/CollisionCounterCheckbox' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const SizeCheckbox = require( 'GAS_PROPERTIES/common/view/SizeCheckbox' );
  const StopwatchCheckbox = require( 'GAS_PROPERTIES/common/view/StopwatchCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  class ToolControls extends VBox {

    /**
     * @param {BooleanProperty} sizeVisibleProperty
     * @param {BooleanProperty} stopwatchVisibleProperty
     * @param {BooleanProperty} collisionCounterVisibleProperty
     * @param {Object} [options]
     */
    constructor( sizeVisibleProperty, stopwatchVisibleProperty, collisionCounterVisibleProperty, options ) {

      options = _.extend( {}, GasPropertiesConstants.VBOX_OPTIONS, options );

      const sizeCheckbox = new SizeCheckbox( sizeVisibleProperty );

      const stopwatchCheckbox = new StopwatchCheckbox( stopwatchVisibleProperty );

      const collisionControlCheckbox = new CollisionCounterCheckbox( collisionCounterVisibleProperty );

      assert && assert( !options.children, 'ToolControls sets children' );
      options.children = [ sizeCheckbox, stopwatchCheckbox, collisionControlCheckbox ];

      super( options );
    }
  }

  return gasProperties.register( 'ToolControls', ToolControls );
} );