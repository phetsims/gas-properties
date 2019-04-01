// Copyright 2019, University of Colorado Boulder

/**
 * Control panel that appears in the upper-right corner of the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CollisionCounterCheckbox = require( 'GAS_PROPERTIES/common/view/CollisionCounterCheckbox' );
  const FixedWidthPanel = require( 'GAS_PROPERTIES/common/view/FixedWidthPanel' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const SizeCheckbox = require( 'GAS_PROPERTIES/common/view/SizeCheckbox' );
  const StopwatchCheckbox = require( 'GAS_PROPERTIES/common/view/StopwatchCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  class ExploreControlPanel extends FixedWidthPanel {

    /**
     * @param {BooleanProperty} sizeVisibleProperty
     * @param {BooleanProperty} stopwatchVisibleProperty
     * @param {BooleanProperty} collisionCounterVisibleProperty
     * @param {Object} [options]
     */
    constructor( sizeVisibleProperty, stopwatchVisibleProperty, collisionCounterVisibleProperty, options ) {

      options = _.extend( {
        fixedWidth: 250
      }, GasPropertiesConstants.PANEL_OPTIONS, options );

      const content = new VBox( {
        align: 'left',
        spacing: 10,
        children: [
          new SizeCheckbox( sizeVisibleProperty ),
          new StopwatchCheckbox( stopwatchVisibleProperty ),
          new CollisionCounterCheckbox( collisionCounterVisibleProperty )
        ]
      } );

      super( content, options );
    }
  }

  return gasProperties.register( 'ExploreControlPanel', ExploreControlPanel );
} );
 