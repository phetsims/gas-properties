// Copyright 2018, University of Colorado Boulder

/**
 * Control panel labeled that appears in the upper-right corner of the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HoldConstantControls = require( 'GAS_PROPERTIES/ideal/view/HoldConstantControls' );
  const HSeparator = require( 'SUN/HSeparator' );
  const Panel = require( 'SUN/Panel' );
  const ToolControls = require( 'GAS_PROPERTIES/common/view/ToolControls' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  class IdealControlPanel extends Panel {

    /**
     * @param {StringProperty} holdConstantProperty
     * @param {BooleanProperty} sizeVisibleProperty
     * @param {BooleanProperty} stopwatchVisibleProperty
     * @param {BooleanProperty} collisionCounterVisibleProperty
     * @param {Object} [options]
     */
    constructor( holdConstantProperty, sizeVisibleProperty,
                 stopwatchVisibleProperty, collisionCounterVisibleProperty, options ) {

      options = _.extend( {

        fixedWidth: 250,

        // Panel options
        align: 'left',
        xMargin: GasPropertiesConstants.PANEL_X_MARGIN,
        yMargin: GasPropertiesConstants.PANEL_Y_MARGIN,
        cornerRadius: GasPropertiesConstants.PANEL_CORNER_RADIUS,
        fill: GasPropertiesColorProfile.panelFillProperty,
        stroke: GasPropertiesColorProfile.panelStrokeProperty

      }, options );

      // force the Panel to be a fixed width
      assert && assert( options.maxWidth === undefined, 'ParticleCountsAccordionBox sets maxWidth' );
      options.maxWidth = options.fixedWidth;
      const separator = new HSeparator( options.fixedWidth - ( 2 * options.xMargin ) );

      const content = new VBox( {
        align: 'left',
        spacing: 10,                      
        children: [
          new HoldConstantControls( holdConstantProperty ),
          separator,
          new ToolControls( sizeVisibleProperty, stopwatchVisibleProperty, collisionCounterVisibleProperty )
        ]
      } );

      super( content, options );
    }
  }

  return gasProperties.register( 'IdealControlPanel', IdealControlPanel );
} );
 