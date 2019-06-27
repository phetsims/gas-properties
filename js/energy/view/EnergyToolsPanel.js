// Copyright 2018-2019, University of Colorado Boulder

/**
 * EnergyToolsPanel is the panel that appears in the upper-right corner of the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const FixedWidthNode = require( 'GAS_PROPERTIES/common/view/FixedWidthNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const Panel = require( 'SUN/Panel' );
  const StopwatchCheckbox = require( 'GAS_PROPERTIES/common/view/StopwatchCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const WidthCheckbox = require( 'GAS_PROPERTIES/common/view/WidthCheckbox' );

  class EnergyToolsPanel extends Panel {

    /**
     * @param {BooleanProperty} sizeVisibleProperty
     * @param {BooleanProperty} stopwatchVisibleProperty
     * @param {Object} [options]
     */
    constructor( sizeVisibleProperty, stopwatchVisibleProperty, options ) {
      assert && assert( sizeVisibleProperty instanceof BooleanProperty,
        `invalid sizeVisibleProperty: ${sizeVisibleProperty}` );
      assert && assert( stopwatchVisibleProperty instanceof BooleanProperty,
        `invalid stopwatchVisibleProperty: ${stopwatchVisibleProperty}` );

      options = _.extend( {
        fixedWidth: 100,
        xMargin: 0
      }, GasPropertiesConstants.PANEL_OPTIONS, options );

      const contentWidth = options.fixedWidth - ( 2 * options.xMargin );

      const checkboxOptions = {
        textMaxWidth: 110 // determined empirically
      };

      const content = new FixedWidthNode( contentWidth, new VBox( {
        align: 'left',
        spacing: 12,
        children: [
          new WidthCheckbox( sizeVisibleProperty, checkboxOptions ),
          new StopwatchCheckbox( stopwatchVisibleProperty, checkboxOptions )
        ]
      } ) );

      super( content, options );
    }
  }

  return gasProperties.register( 'EnergyToolsPanel', EnergyToolsPanel );
} );
