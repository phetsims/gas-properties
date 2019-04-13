// Copyright 2019, University of Colorado Boulder

/**
 * Control panel that appears on the right side of the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CenterOfMassCheckbox = require( 'GAS_PROPERTIES/diffusion/view/CenterOfMassCheckbox' );
  const DividerToggleButton = require( 'GAS_PROPERTIES/diffusion/view/DividerToggleButton' );
  const FixedWidthNode = require( 'GAS_PROPERTIES/common/view/FixedWidthNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HSeparator = require( 'SUN/HSeparator' );
  const Panel = require( 'SUN/Panel' );
  const ParticleFlowRateCheckbox = require( 'GAS_PROPERTIES/diffusion/view/ParticleFlowRateCheckbox' );
  const StopwatchCheckbox = require( 'GAS_PROPERTIES/common/view/StopwatchCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VStrut = require( 'SCENERY/nodes/VStrut' );

  class DiffusionControlPanel extends Panel {

    /**
     * @param {DiffusionModel} model
     * @param {BooleanProperty} hasDividerProperty
     * @param {BooleanProperty} particleFlowRateVisibleProperty
     * @param {BooleanProperty} centerOfMassVisibleProperty
     * @param {BooleanProperty} stopwatchVisibleProperty
     * @param {Object} [options]
     */
    constructor( model, hasDividerProperty, particleFlowRateVisibleProperty,
                 centerOfMassVisibleProperty, stopwatchVisibleProperty, options ) {

      options = _.extend( {
        fixedWidth: 100,
        xMargin: 0
      }, GasPropertiesConstants.PANEL_OPTIONS, options );

      const separatorWidth = options.fixedWidth - ( 2 * options.xMargin );

      const content = new VBox( {
        align: 'left',
        spacing: 12,
        children: [
          new VStrut( 300 ), //TODO temporary
          new DividerToggleButton( hasDividerProperty ), //TODO center me
          new HSeparator( separatorWidth, {
            stroke: GasPropertiesColorProfile.separatorColorProperty,
            maxWidth: separatorWidth
          } ),
          new ParticleFlowRateCheckbox( particleFlowRateVisibleProperty ),
          new CenterOfMassCheckbox( centerOfMassVisibleProperty ),
          new StopwatchCheckbox( stopwatchVisibleProperty )
        ]
      });

      const fixedWidthNode = new FixedWidthNode( content, {
        fixedWidth: separatorWidth
      } );

      super( fixedWidthNode, options );
    }
  }

  return gasProperties.register( 'DiffusionControlPanel', DiffusionControlPanel );
} );