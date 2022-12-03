// Copyright 2019-2022, University of Colorado Boulder

/**
 * DiffusionSettingsNode is the user interface for setting initial conditions in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { AlignBox, AlignBoxOptions, AlignGroup, HBox, HStrut, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import GasPropertiesIconFactory from '../../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import DiffusionSettings from '../model/DiffusionSettings.js';
import GasPropertiesSpinner, { GasPropertiesSpinnerOptions } from './GasPropertiesSpinner.js';

// constants
const ICON_SPACING = 10; // space between particle icon and spinner

type SelfOptions = EmptySelfOptions;

type DiffusionSettingsNodeOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class DiffusionSettingsNode extends VBox {

  /**
   * @param leftSettings - setting for the left side of the container
   * @param rightSettings - setting for the right side of the container
   * @param modelViewTransform
   * @param enabledProperty
   * @param providedOptions
   */
  public constructor( leftSettings: DiffusionSettings, rightSettings: DiffusionSettings,
                      modelViewTransform: ModelViewTransform2, enabledProperty: TReadOnlyProperty<boolean>,
                      providedOptions: DiffusionSettingsNodeOptions ) {

    const options = optionize<DiffusionSettingsNodeOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      spacing: 20,
      align: 'left'
    }, providedOptions );

    // To make all spinners have the same bounds width
    const spinnersAlignGroup = new AlignGroup( {
      matchHorizontal: true
    } );

    // Number of Particles
    const numberOfParticlesControl = new QuantityControl( GasPropertiesStrings.numberOfParticlesStringProperty,
      modelViewTransform, leftSettings.numberOfParticlesProperty, rightSettings.numberOfParticlesProperty, spinnersAlignGroup, {
        spinnerOptions: {
          enabledProperty: enabledProperty,
          deltaValue: DiffusionSettings.DELTAS.numberOfParticles
        },
        tandem: options.tandem.createTandem( 'numberOfParticlesControl' )
      } );

    // Mass (AMU)
    const massControl = new QuantityControl( GasPropertiesStrings.massAMUStringProperty, modelViewTransform,
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
    const radiusControl = new QuantityControl( GasPropertiesStrings.radiusPmStringProperty, modelViewTransform,
      leftSettings.radiusProperty, rightSettings.radiusProperty, spinnersAlignGroup, {
        spinnerOptions: {
          enabledProperty: enabledProperty,
          deltaValue: DiffusionSettings.DELTAS.radius
        },
        tandem: options.tandem.createTandem( 'radiusControl' )
      } );

    // Initial Temperature (K)
    const initialTemperatureControl = new QuantityControl( GasPropertiesStrings.initialTemperatureKStringProperty,
      modelViewTransform, leftSettings.initialTemperatureProperty, rightSettings.initialTemperatureProperty, spinnersAlignGroup, {
        spinnerOptions: {
          enabledProperty: enabledProperty,
          deltaValue: DiffusionSettings.DELTAS.initialTemperature
        },
        tandem: options.tandem.createTandem( 'initialTemperatureControl' )
      } );

    options.children = [
      numberOfParticlesControl,
      massControl,
      radiusControl,
      initialTemperatureControl
    ];

    super( options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * A label and two spinners, for changing the same quantity for the left and right sides of the container.
 */

type QuantityControlSelfOptions = {
  spinnerOptions?: StrictOmit<GasPropertiesSpinnerOptions, 'tandem'>;
};

type QuantityControlOptions = QuantityControlSelfOptions & PickRequired<VBoxOptions, 'tandem'>;

class QuantityControl extends VBox {

  /**
   * @param labelStringProperty
   * @param modelViewTransform
   * @param leftProperty - quantity for the left side of the container
   * @param rightProperty - quantity for the right side of the container
   * @param spinnersAlignGroup
   * @param providedOptions
   */
  public constructor( labelStringProperty: TReadOnlyProperty<string>, modelViewTransform: ModelViewTransform2,
                      leftProperty: NumberProperty, rightProperty: NumberProperty,
                      spinnersAlignGroup: AlignGroup,
                      providedOptions: QuantityControlOptions ) {

    const options = optionize<QuantityControlOptions, StrictOmit<QuantityControlSelfOptions, 'spinnerOptions'>, VBoxOptions>()( {

      // VBoxOptions
      spacing: 12,
      align: 'left'
    }, providedOptions );

    // label
    const labelText = new Text( labelStringProperty, {
      font: GasPropertiesConstants.CONTROL_FONT,
      fill: GasPropertiesColors.textFillProperty,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    // icons
    const leftParticleIcon = GasPropertiesIconFactory.createDiffusionParticle1Icon( modelViewTransform );
    const rightParticleIcon = GasPropertiesIconFactory.createDiffusionParticle2Icon( modelViewTransform );

    // spinners, with uniform bounds width to facilitate layout
    const alignBoxOptions: AlignBoxOptions = {
      group: spinnersAlignGroup,
      xAlign: 'left'
    };
    const leftSpinner = new AlignBox( new GasPropertiesSpinner( leftProperty, combineOptions<GasPropertiesSpinnerOptions>( {
      tandem: options.tandem.createTandem( 'leftSpinner' )
    }, options.spinnerOptions ) ), alignBoxOptions );
    const rightSpinner = new AlignBox( new GasPropertiesSpinner( rightProperty, combineOptions<GasPropertiesSpinnerOptions>( {
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

    options.children = [ labelText, hBox ];

    super( options );
  }
}

gasProperties.register( 'DiffusionSettingsNode', DiffusionSettingsNode );