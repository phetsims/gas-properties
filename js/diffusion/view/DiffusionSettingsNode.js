// Copyright 2019, University of Colorado Boulder

/**
 * DiffusionSettingsNode is the user interface for setting initial conditions in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DiffusionSettings = require( 'GAS_PROPERTIES/diffusion/model/DiffusionSettings' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const GasPropertiesSpinner = require( 'GAS_PROPERTIES/diffusion/view/GasPropertiesSpinner' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const initialTemperatureKString = require( 'string!GAS_PROPERTIES/initialTemperatureK' );
  const massAMUString = require( 'string!GAS_PROPERTIES/massAMU' );
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const radiusPmString = require( 'string!GAS_PROPERTIES/radiusPm' );

  // constants
  const ICON_SPACING = 10; // space between particle icon and spinner

  class DiffusionSettingsNode extends VBox {

    /**
     * @param {DiffusionSettings} leftSettings - setting for the left side of the container
     * @param {DiffusionSettings} rightSettings - setting for the right side of the container
     * @param {ModelViewTransform2} modelViewTransform
     * @param {BooleanProperty} enabledProperty
     * @param {Object} [options]
     */
    constructor( leftSettings, rightSettings, modelViewTransform, enabledProperty, options ) {
      assert && assert( leftSettings instanceof DiffusionSettings, `invalid leftSettings: ${leftSettings}` );
      assert && assert( rightSettings instanceof DiffusionSettings, `invalid rightSettings: ${rightSettings}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );
      assert && assert( enabledProperty instanceof BooleanProperty, `invalid enabledProperty: ${enabledProperty}` );

      options = _.extend( {

        // superclass options
        spacing: 20,
        align: 'left',

        // phet-io
        tandem: Tandem.required
      }, options );

      // To make all spinners have the same bounds width
      const spinnersAlignGroup = new AlignGroup( {
        matchHorizontal: true
      } );

      // Number of Particles
      const numberOfParticlesControl = new QuantityControl( numberOfParticlesString, modelViewTransform,
        leftSettings.numberOfParticlesProperty, rightSettings.numberOfParticlesProperty, spinnersAlignGroup, {
          spinnerOptions: {
            enabledProperty: enabledProperty,
            deltaValue: DiffusionSettings.DELTAS.numberOfParticles,
            decimalPlaces: 0
          },
          tandem: options.tandem.createTandem( 'numberOfParticlesControl' )
        } );

      // Mass (AMU)
      const massControl = new QuantityControl( massAMUString, modelViewTransform,
        leftSettings.massProperty, rightSettings.massProperty, spinnersAlignGroup, {
          spinnerOptions: {
            enabledProperty: enabledProperty,
            deltaValue: DiffusionSettings.DELTAS.mass,
            decimalPlaces: 0,
            xMargin: 12.45 // mass spinners are narrower because they have fewer digits, compensate empirically
          },
          tandem: options.tandem.createTandem( 'massControl' )
        } );

      // Radius (pm)
      const radiusControl = new QuantityControl( radiusPmString, modelViewTransform,
        leftSettings.radiusProperty, rightSettings.radiusProperty, spinnersAlignGroup, {
          spinnerOptions: {
            enabledProperty: enabledProperty,
            deltaValue: DiffusionSettings.DELTAS.radius,
            decimalPlaces: 0
          },
          tandem: options.tandem.createTandem( 'radiusControl' )
        } );

      // Initial Temperature (K)
      const initialTemperatureControl = new QuantityControl( initialTemperatureKString, modelViewTransform,
        leftSettings.initialTemperatureProperty, rightSettings.initialTemperatureProperty, spinnersAlignGroup, {
          spinnerOptions: {
            enabledProperty: enabledProperty,
            deltaValue: DiffusionSettings.DELTAS.initialTemperature,
            decimalPlaces: 0
          },
          tandem: options.tandem.createTandem( 'initialTemperatureControl' )
        } );

      assert && assert( !options.children, 'DiffusionSettingsNode sets children' );
      options = _.extend( {
        children: [
          numberOfParticlesControl,
          massControl,
          radiusControl,
          initialTemperatureControl
        ]
      }, options );

      super( options );
    }
  }

  gasProperties.register( 'DiffusionSettingsNode', DiffusionSettingsNode );

  /**
   * A title and two spinners, for changing the same quantity for the left and right sides of the container.
   */
  class QuantityControl extends VBox {

    /**
     * @param {string} title
     * @param {ModelViewTransform2} modelViewTransform
     * @param {NumberProperty} leftProperty - quantity for the left side of the container
     * @param {NumberProperty} rightProperty - quantity for the right side of the container
     * @param {AlignGroup} spinnersAlignGroup
     * @param {Object} [options]
     */
    constructor( title, modelViewTransform, leftProperty, rightProperty, spinnersAlignGroup, options ) {
      assert && assert( typeof title === 'string', `invalid title: ${title}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );
      assert && assert( leftProperty instanceof NumberProperty, `invalid leftProperty: ${leftProperty}` );
      assert && assert( rightProperty instanceof NumberProperty, `invalid rightProperty: ${rightProperty}` );
      assert && assert( spinnersAlignGroup instanceof AlignGroup, `invalid spinnersAlignGroup: ${spinnersAlignGroup}` );

      options = _.extend( {
        spinnerOptions: null, // {*} see NumberSpinner

        // VBox options
        spacing: 12,
        align: 'left',

        // phet-io
        tandem: Tandem.required
      }, options );

      // title
      const titleNode = new Text( title, {
        font: GasPropertiesConstants.CONTROL_FONT,
        fill: GasPropertiesColorProfile.textFillProperty,
        maxWidth: 200 // determined empirically
      } );

      // icons
      const leftParticleIcon = GasPropertiesIconFactory.createDiffusionParticle1Icon( modelViewTransform );
      const rightParticleIcon = GasPropertiesIconFactory.createDiffusionParticle2Icon( modelViewTransform );

      // spinners, with uniform bounds width to facilitate layout
      const alignBoxOptions = {
        group: spinnersAlignGroup,
        xAlign: 'left'
      };
      const leftSpinner = new AlignBox( new GasPropertiesSpinner( leftProperty, options.spinnerOptions ), alignBoxOptions );
      const rightSpinner = new AlignBox( new GasPropertiesSpinner( rightProperty, options.spinnerOptions ), alignBoxOptions );

      // left icon and spinner
      const leftBox = new HBox( {
        spacing: ICON_SPACING,
        children: [ leftParticleIcon, leftSpinner ]
      } );

      // right icon and spinner
      const rightBox = new HBox( {
        spacing: ICON_SPACING,
        children: [ rightParticleIcon, rightSpinner ]
      } );

      // both controls, indented
      const hBox = new HBox( {
        spacing: 30,
        children: [ new HStrut( 1 ), leftBox, rightBox ]
      } );

      // title and controls
      assert && assert( !options.children, 'DataNode sets children' );
      options = _.extend( {
        children: [ titleNode, hBox ]
      }, options );

      super( options );
    }
  }

  return DiffusionSettingsNode;
} );