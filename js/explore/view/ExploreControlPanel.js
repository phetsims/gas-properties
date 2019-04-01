// Copyright 2018-2019, University of Colorado Boulder

/**
 * Control panel that appears in the upper-right corner of the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CollisionCounterCheckbox = require( 'GAS_PROPERTIES/common/view/CollisionCounterCheckbox' );
  const FixedWidthNode = require( 'GAS_PROPERTIES/common/view/FixedWidthNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const Panel = require( 'SUN/Panel' );
  const SizeCheckbox = require( 'GAS_PROPERTIES/common/view/SizeCheckbox' );
  const StopwatchCheckbox = require( 'GAS_PROPERTIES/common/view/StopwatchCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  class ExploreControlPanel extends Panel {

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

      //TODO use GasPropertiesConstants.VBOX_OPTIONS ?
      const content = new VBox( {
        align: 'left',
        spacing: 10,
        children: [
          new SizeCheckbox( sizeVisibleProperty ),
          new StopwatchCheckbox( stopwatchVisibleProperty ),
          new CollisionCounterCheckbox( collisionCounterVisibleProperty )
        ]
      } );

      const fixedWidthNode = new FixedWidthNode( content, {
        fixedWidth: options.fixedWidth - ( 2 * options.xMargin )
      } );

      super( fixedWidthNode, options );
    }
  }

  return gasProperties.register( 'ExploreControlPanel', ExploreControlPanel );
} );
 