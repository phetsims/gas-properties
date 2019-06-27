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
  const DiffusionViewProperties = require( 'GAS_PROPERTIES/diffusion/view/DiffusionViewProperties' );
  const DividerToggleButton = require( 'GAS_PROPERTIES/diffusion/view/DividerToggleButton' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HSeparator = require( 'SUN/HSeparator' );
  const Panel = require( 'SUN/Panel' );
  const ParticleFlowRateCheckbox = require( 'GAS_PROPERTIES/diffusion/view/ParticleFlowRateCheckbox' );
  const Property = require( 'AXON/Property' );
  const ScaleCheckbox = require( 'GAS_PROPERTIES/diffusion/view/ScaleCheckbox' );
  const StopwatchCheckbox = require( 'GAS_PROPERTIES/common/view/StopwatchCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  class DiffusionControlPanel extends Panel {

    /**
     * @param {DiffusionSettings} leftSettings - setting for the left side of the container
     * @param {DiffusionSettings} rightSettings - setting for the right side of the container
     * @param {ModelViewTransform2} modelViewTransform
     * @param {BooleanProperty} hasDividerProperty
     * @param {Property.<number>} numberOfParticlesProperty
     * @param {BooleanProperty} stopwatchVisibleProperty
     * @param {DiffusionViewProperties} viewProperties
     * @param {Object} [options]
     */
    constructor( leftSettings, rightSettings, modelViewTransform, hasDividerProperty,
                 numberOfParticlesProperty, stopwatchVisibleProperty, viewProperties, options ) {
      assert && assert( leftSettings instanceof DiffusionSettings,
        `invalid leftSettings: ${leftSettings}` );
      assert && assert( rightSettings instanceof DiffusionSettings,
        `invalid rightSettings: ${rightSettings}` );
      assert && assert( hasDividerProperty instanceof BooleanProperty,
        `invalid hasDividerProperty: ${hasDividerProperty}` );
      assert && assert( numberOfParticlesProperty instanceof Property,
        `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );
      assert && assert( stopwatchVisibleProperty instanceof BooleanProperty,
        `invalid stopwatchVisibleProperty: ${stopwatchVisibleProperty}` );
      assert && assert( viewProperties instanceof DiffusionViewProperties,
        `invalid viewProperties: ${viewProperties}` );


      options = _.extend( {
        fixedWidth: 100,
        xMargin: 0
      }, GasPropertiesConstants.PANEL_OPTIONS, options );

      const contentWidth = options.fixedWidth - ( 2 * options.xMargin );

      const dividerToggleButton = new DividerToggleButton( hasDividerProperty );

      const checkboxOptions = {
        textMaxWidth: 175 // determined empirically
      };

      const content = new VBox( {
        align: 'left',
        spacing: 18,
        maxWidth: contentWidth,
        children: [

          // spinners
          new DiffusionSettingsNode( leftSettings, rightSettings, modelViewTransform, hasDividerProperty ),

          new VBox( {
            align: 'center',
            spacing: 15,
            children: [

              // Remove/Reset Divider button
              dividerToggleButton,

              // separator, which effectively determines min content width
              new HSeparator( contentWidth, {
                stroke: GasPropertiesColorProfile.separatorColorProperty,
                maxWidth: contentWidth
              } )
            ]
          } ),

          // checkboxes
          new VBox( {
            align: 'left',
            spacing: 12,
            children: [
              new CenterOfMassCheckbox( viewProperties.centerOfMassVisibleProperty, checkboxOptions ),
              new ParticleFlowRateCheckbox( viewProperties.particleFlowRateVisibleProperty, checkboxOptions ),
              new ScaleCheckbox( viewProperties.scaleVisibleProperty, checkboxOptions ),
              new StopwatchCheckbox( stopwatchVisibleProperty, checkboxOptions )
            ]
          } )
        ]
      } );

      super( content, options );

      // Disable the button when the container is empty.
      numberOfParticlesProperty.link( numberOfParticles => {
        dividerToggleButton.enabled = ( numberOfParticles !== 0 );
      } );
    }
  }

  return gasProperties.register( 'DiffusionControlPanel', DiffusionControlPanel );
} );
