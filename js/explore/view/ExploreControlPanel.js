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
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Node = require( 'SCENERY/nodes/Node' );
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
        fixedWidth: 250,
        xMargin: 0 // set by GasPropertiesConstants.PANEL_OPTIONS
      }, GasPropertiesConstants.PANEL_OPTIONS, options );

      const content = new Node();
      content.addChild( new VBox( {
        align: 'left',
        spacing: 10,
        children: [
          new SizeCheckbox( sizeVisibleProperty ),
          new StopwatchCheckbox( stopwatchVisibleProperty ),
          new CollisionCounterCheckbox( collisionCounterVisibleProperty )
        ]
      } ) );

      // force the Panel to be a fixed width
      assert && assert( !options.hasOwnProperty( 'maxWidth' ), 'ParticleCountsAccordionBox sets maxWidth' );
      options = _.extend( {
        maxWidth: options.fixedWidth
      }, options );
      content.addChild( new HStrut( options.fixedWidth - ( 2 * options.xMargin ) ) );

      super( content, options );
    }
  }

  return gasProperties.register( 'ExploreControlPanel', ExploreControlPanel );
} );
 