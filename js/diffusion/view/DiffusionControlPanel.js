// Copyright 2018-2019, University of Colorado Boulder

/**
 * Control panel that appears on the right side of the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CenterOfMassCheckbox = require( 'GAS_PROPERTIES/diffusion/view/CenterOfMassCheckbox' );
  const DiffusionSettings = require( 'GAS_PROPERTIES/diffusion/model/DiffusionSettings' );
  const DiffusionSettingsNode = require( 'GAS_PROPERTIES/diffusion/view/DiffusionSettingsNode' );
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

  class DiffusionControlPanel extends Panel {

    /**
     * @param {DiffusionSettings} leftSettings - setting for the left side of the container
     * @param {DiffusionSettings} rightSettings - setting for the right side of the container
     * @param {ModelViewTransform2} modelViewTransform
     * @param {BooleanProperty} hasDividerProperty
     * @param {BooleanProperty} particleFlowRateVisibleProperty
     * @param {BooleanProperty} centerOfMassVisibleProperty
     * @param {BooleanProperty} stopwatchVisibleProperty
     * @param {Object} [options]
     */
    constructor( leftSettings, rightSettings,
                 modelViewTransform, hasDividerProperty, particleFlowRateVisibleProperty,
                 centerOfMassVisibleProperty, stopwatchVisibleProperty, options ) {
      assert && assert( leftSettings instanceof DiffusionSettings,
        `invalid leftSettings: ${leftSettings}` );
      assert && assert( rightSettings instanceof DiffusionSettings,
        `invalid rightSettings: ${rightSettings}` );
      assert && assert( hasDividerProperty instanceof BooleanProperty,
        `invalid hasDividerProperty: ${hasDividerProperty}` );
      assert && assert( particleFlowRateVisibleProperty instanceof BooleanProperty,
        `invalid particleFlowRateVisibleProperty: ${particleFlowRateVisibleProperty}` );
      assert && assert( centerOfMassVisibleProperty instanceof BooleanProperty,
        `invalid centerOfMassVisibleProperty: ${centerOfMassVisibleProperty}` );
      assert && assert( stopwatchVisibleProperty instanceof BooleanProperty,
        `invalid stopwatchVisibleProperty: ${stopwatchVisibleProperty}` );

      options = _.extend( {
        fixedWidth: 100,
        xMargin: 0
      }, GasPropertiesConstants.PANEL_OPTIONS, options );

      const contentWidth = options.fixedWidth - ( 2 * options.xMargin );

      const content = new FixedWidthNode( contentWidth, new VBox( {
        align: 'left',
        spacing: 20,
        children: [

          // spinners
          new DiffusionSettingsNode( leftSettings, rightSettings, modelViewTransform, hasDividerProperty ),

          // Remove/Reset Divider button, centered
          new FixedWidthNode( contentWidth, new DividerToggleButton( hasDividerProperty ), {
            align: 'center'
          } ),

          // ------------
          new HSeparator( contentWidth, {
            stroke: GasPropertiesColorProfile.separatorColorProperty,
            maxWidth: contentWidth
          } ),

          // checkboxes
          new VBox( {
            align: 'left',
            spacing: 12,
            children: [
              new CenterOfMassCheckbox( centerOfMassVisibleProperty ),
              new ParticleFlowRateCheckbox( particleFlowRateVisibleProperty ),
              new StopwatchCheckbox( stopwatchVisibleProperty )
            ]
          } )
        ]
      } ) );

      super( content, options );
    }
  }

  return gasProperties.register( 'DiffusionControlPanel', DiffusionControlPanel );
} );