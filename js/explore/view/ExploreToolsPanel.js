// Copyright 2018-2019, University of Colorado Boulder

/**
 * ExploreToolsPanel is the panel that appears in the upper-right corner of the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CollisionCounterCheckbox = require( 'GAS_PROPERTIES/common/view/CollisionCounterCheckbox' );
  const FixedWidthNode = require( 'GAS_PROPERTIES/common/view/FixedWidthNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const merge = require( 'PHET_CORE/merge' );
  const Panel = require( 'SUN/Panel' );
  const StopwatchCheckbox = require( 'GAS_PROPERTIES/common/view/StopwatchCheckbox' );
  const Tandem = require( 'TANDEM/Tandem' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const WidthCheckbox = require( 'GAS_PROPERTIES/common/view/WidthCheckbox' );

  class ExploreToolsPanel extends Panel {

    /**
     * @param {BooleanProperty} widthVisibleProperty
     * @param {BooleanProperty} stopwatchVisibleProperty
     * @param {BooleanProperty} collisionCounterVisibleProperty
     * @param {Object} [options]
     */
    constructor( widthVisibleProperty, stopwatchVisibleProperty, collisionCounterVisibleProperty, options ) {
      assert && assert( widthVisibleProperty instanceof BooleanProperty,
        `invalid widthVisibleProperty: ${widthVisibleProperty}` );
      assert && assert( stopwatchVisibleProperty instanceof BooleanProperty,
        `invalid stopwatchVisibleProperty: ${stopwatchVisibleProperty}` );
      assert && assert( collisionCounterVisibleProperty instanceof BooleanProperty,
        `invalid collisionCounterVisibleProperty: ${collisionCounterVisibleProperty}` );

      options = merge( {
        fixedWidth: 100,
        xMargin: 0,

        // phet-io
        tandem: Tandem.REQUIRED
      }, GasPropertiesConstants.PANEL_OPTIONS, options );

      const contentWidth = options.fixedWidth - ( 2 * options.xMargin );

      const checkboxOptions = {
        textMaxWidth: 110 // determined empirically
      };

      const content = new FixedWidthNode( contentWidth, new VBox( {
        align: 'left',
        spacing: 12,
        children: [
          new WidthCheckbox( widthVisibleProperty, merge( {}, checkboxOptions, {
            tandem: options.tandem.createTandem( 'widthCheckbox' )
          } ) ),
          new StopwatchCheckbox( stopwatchVisibleProperty, merge( {}, checkboxOptions, {
            tandem: options.tandem.createTandem( 'stopwatchCheckbox' )
          } ) ),
          new CollisionCounterCheckbox( collisionCounterVisibleProperty, merge( {}, checkboxOptions, {
            tandem: options.tandem.createTandem( 'collisionCounterCheckbox' )
          } ) )
        ]
      } ) );

      super( content, options );
    }
  }

  return gasProperties.register( 'ExploreToolsPanel', ExploreToolsPanel );
} );
