// Copyright 2019, University of Colorado Boulder

/**
 * Control panel that appears in the upper-right corner of the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const Panel = require( 'SUN/Panel' );
  const ToolControls = require( 'GAS_PROPERTIES/common/view/ToolControls' );
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

      // force the Panel to be a fixed width
      assert && assert( !options.hasOwnProperty( 'maxWidth' ), 'ParticleCountsAccordionBox sets maxWidth' );
      options = _.extend( {
        maxWidth: options.fixedWidth
      }, options );
      const separatorWidth = options.fixedWidth - ( 2 * options.xMargin );

      // constrain all parts of content to separatorWidth
      const content = new VBox( {
        align: 'left',
        spacing: 10,                      
        children: [
          new ToolControls( sizeVisibleProperty, stopwatchVisibleProperty, collisionCounterVisibleProperty, {
            maxWidth: separatorWidth
          } )
        ]
      } );

      super( content, options );
    }
  }

  return gasProperties.register( 'ExploreControlPanel', ExploreControlPanel );
} );
 