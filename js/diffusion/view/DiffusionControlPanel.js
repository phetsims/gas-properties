// Copyright 2018-2019, University of Colorado Boulder

/**
 * Control panel that appears on the right side of the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const CenterOfMassCheckbox = require( 'GAS_PROPERTIES/diffusion/view/CenterOfMassCheckbox' );
  const DiffusionSettings = require( 'GAS_PROPERTIES/diffusion/model/DiffusionSettings' );
  const DividerToggleButton = require( 'GAS_PROPERTIES/diffusion/view/DividerToggleButton' );
  const FixedWidthNode = require( 'GAS_PROPERTIES/common/view/FixedWidthNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HSeparator = require( 'SUN/HSeparator' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const ParticleFlowRateCheckbox = require( 'GAS_PROPERTIES/diffusion/view/ParticleFlowRateCheckbox' );
  const QuantityControl = require( 'GAS_PROPERTIES/diffusion/view/QuantityControl' );
  const StopwatchCheckbox = require( 'GAS_PROPERTIES/common/view/StopwatchCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const initialTemperatureKString = require( 'string!GAS_PROPERTIES/initialTemperatureK' );
  const massAMUString = require( 'string!GAS_PROPERTIES/massAMU' );
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const radiusPmString = require( 'string!GAS_PROPERTIES/radiusPm' );

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

      options = _.extend( {}, GasPropertiesConstants.PANEL_OPTIONS, {
        fixedWidth: 100
      }, options );

      const separatorWidth = options.fixedWidth - ( 2 * options.xMargin );

      // Initial Number
      const numberOfParticlesControl = new QuantityControl( numberOfParticlesString, modelViewTransform,
        leftSettings.numberOfParticlesProperty, rightSettings.numberOfParticlesProperty, {
          spinnerOptions: {
            enabledProperty: hasDividerProperty,
            deltaValue: DiffusionSettings.DELTAS.numberOfParticles,
            decimalPlaces: 0
          }
        } );

      // Mass (AMU)
      const massControl = new QuantityControl( massAMUString, modelViewTransform,
        leftSettings.massProperty, rightSettings.massProperty, {
          spinnerOptions: {
            enabledProperty: hasDividerProperty,
            deltaValue: DiffusionSettings.DELTAS.mass,
            decimalPlaces: 0
          }
        } );

      // Radius (pm)
      const radiusControl = new QuantityControl( radiusPmString, modelViewTransform,
        leftSettings.radiusProperty, rightSettings.radiusProperty, {
          spinnerOptions: {
            enabledProperty: hasDividerProperty,
            deltaValue: DiffusionSettings.DELTAS.radius,
            decimalPlaces: 0
          }
        } );

      // Initial Temperature (K)
      const initialTemperatureControl = new QuantityControl( initialTemperatureKString, modelViewTransform,
        leftSettings.initialTemperatureProperty, rightSettings.initialTemperatureProperty, {
          spinnerOptions: {
            enabledProperty: hasDividerProperty,
            deltaValue: DiffusionSettings.DELTAS.initialTemperature,
            decimalPlaces: 0
          }
        } );

      // TODO is there a better way to center the button?
      // to center the button
      const dividerButtonParent = new Node( {
        children: [
          new HStrut( separatorWidth ),
          new DividerToggleButton( hasDividerProperty, { centerX: separatorWidth / 2 } )
        ]
      } );

      const content = new VBox( {
        align: 'left',
        spacing: 20,
        children: [
          new VBox( {
            spacing: 20,
            align: 'left',
            children: [
              //TODO these don't horizontally align because some NumberSpinners are a different width
              numberOfParticlesControl,
              massControl,
              radiusControl,
              initialTemperatureControl,
              dividerButtonParent
            ]
          } ),
          new HSeparator( separatorWidth, {
            stroke: GasPropertiesColorProfile.separatorColorProperty,
            maxWidth: separatorWidth
          } ),
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
      } );

      const fixedWidthNode = new FixedWidthNode( content, {
        fixedWidth: separatorWidth
      } );

      super( fixedWidthNode, options );
    }
  }

  return gasProperties.register( 'DiffusionControlPanel', DiffusionControlPanel );
} );