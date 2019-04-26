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
  const initialNumberString = require( 'string!GAS_PROPERTIES/initialNumber' );
  const massAmuString = require( 'string!GAS_PROPERTIES/massAmu' );
  const initialTemperatureKString = require( 'string!GAS_PROPERTIES/initialTemperatureK' );

  class DiffusionControlPanel extends Panel {

    /**
     * @param {DiffusionExperiment} experiment
     * @param {ModelViewTransform2} modelViewTransform
     * @param {BooleanProperty} hasDividerProperty
     * @param {BooleanProperty} particleFlowRateVisibleProperty
     * @param {BooleanProperty} centerOfMassVisibleProperty
     * @param {BooleanProperty} stopwatchVisibleProperty
     * @param {Object} [options]
     */
    constructor( experiment, modelViewTransform, hasDividerProperty, particleFlowRateVisibleProperty,
                 centerOfMassVisibleProperty, stopwatchVisibleProperty, options ) {

      options = _.extend( {
        fixedWidth: 100,
        xMargin: 0
      }, GasPropertiesConstants.PANEL_OPTIONS, options );

      const separatorWidth = options.fixedWidth - ( 2 * options.xMargin );

      // Initial Number
      const initialNumberControl = new QuantityControl( modelViewTransform, initialNumberString,
        experiment.initialNumber1Property, experiment.initialNumber2Property, experiment.initialNumberRange, {
          spinnerOptions: {
            enabledProperty: hasDividerProperty,
            deltaValue: experiment.initialNumberDelta
          }
        } );

      // Mass (AMU)
      const massControl = new QuantityControl( modelViewTransform, massAmuString,
        experiment.mass1Property, experiment.mass2Property, experiment.massRange, {
          spinnerOptions: {
            enabledProperty: hasDividerProperty,
            deltaValue: experiment.massDelta,
            xMargin: 13 //TODO empirical hack to make all spinners the same width
          }
        } );

      // Initial Temperature (K)
      const initialTemperatureControl = new QuantityControl( modelViewTransform, initialTemperatureKString,
        experiment.initialTemperature1Property, experiment.initialTemperature2Property, experiment.initialTemperatureRange, {
          spinnerOptions: {
            enabledProperty: hasDividerProperty,
            deltaValue: experiment.initialTemperatureDelta
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
              //TODO alignment - spinners have different ranges, so different widths
              initialNumberControl,
              massControl,
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
              new ParticleFlowRateCheckbox( particleFlowRateVisibleProperty ),
              new CenterOfMassCheckbox( centerOfMassVisibleProperty ),
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