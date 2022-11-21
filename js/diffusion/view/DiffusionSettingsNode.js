// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * DiffusionSettingsNode is the user interface for setting initial conditions in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { AlignBox, AlignGroup, HBox, HStrut, Text, VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import GasPropertiesIconFactory from '../../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import DiffusionSettings from '../model/DiffusionSettings.js';
import GasPropertiesSpinner from './GasPropertiesSpinner.js';

// constants
const ICON_SPACING = 10; // space between particle icon and spinner

export default class DiffusionSettingsNode extends VBox {

  /**
   * @param {DiffusionSettings} leftSettings - setting for the left side of the container
   * @param {DiffusionSettings} rightSettings - setting for the right side of the container
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} enabledProperty
   * @param {Object} [options]
   */
  constructor( leftSettings, rightSettings, modelViewTransform, enabledProperty, options ) {
    assert && assert( leftSettings instanceof DiffusionSettings, `invalid leftSettings: ${leftSettings}` );
    assert && assert( rightSettings instanceof DiffusionSettings, `invalid rightSettings: ${rightSettings}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );
    assert && assert( enabledProperty instanceof BooleanProperty, `invalid enabledProperty: ${enabledProperty}` );

    options = merge( {

      // superclass options
      spacing: 20,
      align: 'left',

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // To make all spinners have the same bounds width
    const spinnersAlignGroup = new AlignGroup( {
      matchHorizontal: true
    } );

    // Number of Particles
    const numberOfParticlesControl = new QuantityControl( GasPropertiesStrings.numberOfParticles, modelViewTransform,
      leftSettings.numberOfParticlesProperty, rightSettings.numberOfParticlesProperty, spinnersAlignGroup, {
        spinnerOptions: {
          enabledProperty: enabledProperty,
          deltaValue: DiffusionSettings.DELTAS.numberOfParticles
        },
        tandem: options.tandem.createTandem( 'numberOfParticlesControl' )
      } );

    // Mass (AMU)
    const massControl = new QuantityControl( GasPropertiesStrings.massAMU, modelViewTransform,
      leftSettings.massProperty, rightSettings.massProperty, spinnersAlignGroup, {
        spinnerOptions: {
          enabledProperty: enabledProperty,
          deltaValue: DiffusionSettings.DELTAS.mass,
          numberDisplayOptions: {
            xMargin: 12.45 // mass spinners are narrower because they have fewer digits, compensate empirically
          }
        },
        tandem: options.tandem.createTandem( 'massControl' )
      } );

    // Radius (pm)
    const radiusControl = new QuantityControl( GasPropertiesStrings.radiusPm, modelViewTransform,
      leftSettings.radiusProperty, rightSettings.radiusProperty, spinnersAlignGroup, {
        spinnerOptions: {
          enabledProperty: enabledProperty,
          deltaValue: DiffusionSettings.DELTAS.radius
        },
        tandem: options.tandem.createTandem( 'radiusControl' )
      } );

    // Initial Temperature (K)
    const initialTemperatureControl = new QuantityControl( GasPropertiesStrings.initialTemperatureK, modelViewTransform,
      leftSettings.initialTemperatureProperty, rightSettings.initialTemperatureProperty, spinnersAlignGroup, {
        spinnerOptions: {
          enabledProperty: enabledProperty,
          deltaValue: DiffusionSettings.DELTAS.initialTemperature
        },
        tandem: options.tandem.createTandem( 'initialTemperatureControl' )
      } );

    assert && assert( !options.children, 'DiffusionSettingsNode sets children' );
    options = merge( {
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

/**
 * A label and two spinners, for changing the same quantity for the left and right sides of the container.
 */
class QuantityControl extends VBox {

  /**
   * @param {string} label
   * @param {ModelViewTransform2} modelViewTransform
   * @param {NumberProperty} leftProperty - quantity for the left side of the container
   * @param {NumberProperty} rightProperty - quantity for the right side of the container
   * @param {AlignGroup} spinnersAlignGroup
   * @param {Object} [options]
   */
  constructor( label, modelViewTransform, leftProperty, rightProperty, spinnersAlignGroup, options ) {
    assert && assert( typeof label === 'string', `invalid label: ${label}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );
    assert && assert( leftProperty instanceof NumberProperty, `invalid leftProperty: ${leftProperty}` );
    assert && assert( rightProperty instanceof NumberProperty, `invalid rightProperty: ${rightProperty}` );
    assert && assert( spinnersAlignGroup instanceof AlignGroup, `invalid spinnersAlignGroup: ${spinnersAlignGroup}` );

    options = merge( {
      spinnerOptions: null, // {*} see NumberSpinner

      // VBox options
      spacing: 12,
      align: 'left',

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // label
    const labelText = new Text( label, {
      font: GasPropertiesConstants.CONTROL_FONT,
      fill: GasPropertiesColors.textFillProperty,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    // icons
    const leftParticleIcon = GasPropertiesIconFactory.createDiffusionParticle1Icon( modelViewTransform );
    const rightParticleIcon = GasPropertiesIconFactory.createDiffusionParticle2Icon( modelViewTransform );

    // spinners, with uniform bounds width to facilitate layout
    const alignBoxOptions = {
      group: spinnersAlignGroup,
      xAlign: 'left'
    };
    const leftSpinner = new AlignBox( new GasPropertiesSpinner( leftProperty, merge( {
      tandem: options.tandem.createTandem( 'leftSpinner' )
    }, options.spinnerOptions ) ), alignBoxOptions );
    const rightSpinner = new AlignBox( new GasPropertiesSpinner( rightProperty, merge( {
      tandem: options.tandem.createTandem( 'rightSpinner' )
    }, options.spinnerOptions ) ), alignBoxOptions );

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

    // label and controls
    assert && assert( !options.children, 'DataNode sets children' );
    options = merge( {
      children: [ labelText, hBox ]
    }, options );

    super( options );
  }
}

gasProperties.register( 'DiffusionSettingsNode', DiffusionSettingsNode );