// Copyright 2019-2024, University of Colorado Boulder

/**
 * DiffusionSettingsPanel is the panel for setting initial conditions in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
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
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import DividerToggleButton from './DividerToggleButton.js';
import Property from '../../../../axon/js/Property.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberSpinner, { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';

const ICON_SPACING = 10; // space between particle icon and spinner

const NUMBER_SPINNER_OPTIONS: NumberSpinnerOptions = {
  isDisposable: false,
  numberDisplayOptions: {
    decimalPlaces: 0,
    xMargin: 8,
    yMargin: 6,
    textOptions: {
      font: GasPropertiesConstants.CONTROL_FONT
    },
    tandem: Tandem.OPT_OUT
  },
  touchAreaXDilation: 15,
  touchAreaYDilation: 15,
  phetioVisiblePropertyInstrumented: false
};

export default class DiffusionSettingsPanel extends Panel {

  /**
   * @param particle1Settings - settings for particle type 1
   * @param particle2Settings - settings for particle type 2
   * @param numberOfParticlesProperty
   * @param isDividedProperty
   * @param modelViewTransform
   * @param numberOfParticleTypesProperty
   * @param tandem
   */
  public constructor( particle1Settings: DiffusionSettings,
                      particle2Settings: DiffusionSettings,
                      numberOfParticlesProperty: TReadOnlyProperty<number>,
                      isDividedProperty: Property<boolean>,
                      modelViewTransform: ModelViewTransform2,
                      numberOfParticleTypesProperty: TReadOnlyProperty<number>,
                      tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {}, GasPropertiesConstants.PANEL_OPTIONS, {
      isDisposable: false,
      tandem: tandem
    } );

    // To make all spinners have the same bounds width
    const spinnersAlignGroup = new AlignGroup( {
      matchHorizontal: true
    } );

    // Number of Particles
    const numberOfParticlesControls = new QuantityControls( 'numberOfParticles', GasPropertiesStrings.numberOfParticlesStringProperty,
      modelViewTransform, particle1Settings.numberOfParticlesProperty, particle2Settings.numberOfParticlesProperty, spinnersAlignGroup,
      numberOfParticleTypesProperty, {
        spinnerOptions: {
          enabledProperty: isDividedProperty,
          deltaValue: DiffusionSettings.DELTAS.numberOfParticles
        },
        tandem: tandem.createTandem( 'numberOfParticlesControls' )
      } );

    // Mass (AMU)
    const massControls = new QuantityControls( 'mass', GasPropertiesStrings.massAMUStringProperty, modelViewTransform,
      particle1Settings.massProperty, particle2Settings.massProperty, spinnersAlignGroup, numberOfParticleTypesProperty, {
        spinnerOptions: {
          enabledProperty: isDividedProperty,
          deltaValue: DiffusionSettings.DELTAS.mass,
          numberDisplayOptions: {
            xMargin: 12.45 // mass spinners are narrower because they have fewer digits, compensate empirically
          }
        },
        tandem: tandem.createTandem( 'massControls' )
      } );

    // Radius (pm)
    const radiusControls = new QuantityControls( 'radius', GasPropertiesStrings.radiusPmStringProperty, modelViewTransform,
      particle1Settings.radiusProperty, particle2Settings.radiusProperty, spinnersAlignGroup, numberOfParticleTypesProperty, {
        spinnerOptions: {
          enabledProperty: isDividedProperty,
          deltaValue: DiffusionSettings.DELTAS.radius
        },
        tandem: tandem.createTandem( 'radiusControls' )
      } );

    // Initial Temperature (K)
    const initialTemperatureControls = new QuantityControls( 'initialTemperature', GasPropertiesStrings.initialTemperatureKStringProperty,
      modelViewTransform, particle1Settings.initialTemperatureProperty, particle2Settings.initialTemperatureProperty, spinnersAlignGroup,
      numberOfParticleTypesProperty, {
        spinnerOptions: {
          enabledProperty: isDividedProperty,
          deltaValue: DiffusionSettings.DELTAS.initialTemperature
        },
        tandem: tandem.createTandem( 'initialTemperatureControls' )
      } );

    const dividerToggleButton = new DividerToggleButton( isDividedProperty, {
      // Enabled when the number of particles is !== 0.
      enabledProperty: new DerivedProperty( [ numberOfParticlesProperty ], numberOfParticles => ( numberOfParticles !== 0 ) ),
      layoutOptions: {
        align: 'center'
      },
      tandem: tandem.createTandem( 'dividerToggleButton' )
    } );

    const content = new VBox( {
      isDisposable: false,
      children: [
        numberOfParticlesControls,
        massControls,
        radiusControls,
        initialTemperatureControls,
        dividerToggleButton
      ],
      spacing: 20,
      align: 'left'
    } );

    super( content, options );
  }
}

/**
 * QuantityControls is label and two spinners, for changing the same quantity for each particle type.
 */

type QuantityControlsSelfOptions = {
  spinnerOptions?: StrictOmit<NumberSpinnerOptions, 'tandem'>;
};

type QuantityControlsOptions = QuantityControlsSelfOptions & PickRequired<VBoxOptions, 'tandem'>;

class QuantityControls extends VBox {

  /**
   * @param spinnerTandemPrefix
   * @param labelStringProperty
   * @param modelViewTransform
   * @param leftProperty - quantity for the left side of the container
   * @param rightProperty - quantity for the right side of the container
   * @param spinnersAlignGroup
   * @param numberOfParticleTypesProperty
   * @param providedOptions
   */
  public constructor( spinnerTandemPrefix: string,
                      labelStringProperty: TReadOnlyProperty<string>,
                      modelViewTransform: ModelViewTransform2,
                      leftProperty: NumberProperty,
                      rightProperty: NumberProperty,
                      spinnersAlignGroup: AlignGroup,
                      numberOfParticleTypesProperty: TReadOnlyProperty<number>,
                      providedOptions: QuantityControlsOptions ) {

    const options = optionize<QuantityControlsOptions, StrictOmit<QuantityControlsSelfOptions, 'spinnerOptions'>, VBoxOptions>()( {

      // VBoxOptions
      spacing: 12,
      align: 'left'
    }, providedOptions );

    // label
    const labelText = new Text( labelStringProperty, {
      font: GasPropertiesConstants.CONTROL_FONT,
      fill: GasPropertiesColors.textFillProperty,
      maxWidth: 225 // determined empirically
    } );

    // icons
    const particle1Icon = GasPropertiesIconFactory.createDiffusionParticle1Icon( modelViewTransform );
    const particle2Icon = GasPropertiesIconFactory.createDiffusionParticle2Icon( modelViewTransform );

    // spinners, with uniform bounds width to facilitate layout
    const alignBoxOptions: AlignBoxOptions = {
      group: spinnersAlignGroup,
      xAlign: 'left'
    };
    const particle1Spinner = new AlignBox( new NumberSpinner( leftProperty, leftProperty.rangeProperty,
      combineOptions<NumberSpinnerOptions>( {}, NUMBER_SPINNER_OPTIONS, {
        tandem: options.tandem.createTandem( `${spinnerTandemPrefix}1Spinner` )
      }, options.spinnerOptions ) ), alignBoxOptions );
    const particle2Spinner = new AlignBox( new NumberSpinner( rightProperty, rightProperty.rangeProperty,
      combineOptions<NumberSpinnerOptions>( {}, NUMBER_SPINNER_OPTIONS, {
        tandem: options.tandem.createTandem( `${spinnerTandemPrefix}2Spinner` )
      }, options.spinnerOptions ) ), alignBoxOptions );

    // icon and spinner for particle type 1
    const box1 = new HBox( {
      spacing: ICON_SPACING,
      children: [ particle1Icon, particle1Spinner ]
    } );

    // icon and spinner for particle type 2
    const box2 = new HBox( {
      spacing: ICON_SPACING,
      children: [ particle2Icon, particle2Spinner ],
      visibleProperty: new DerivedProperty( [ numberOfParticleTypesProperty ], n => n === 2 )
    } );

    // both controls, indented
    const hBox = new HBox( {
      spacing: 30,
      children: [ new HStrut( 1 ), box1, box2 ]
    } );

    options.children = [ labelText, hBox ];

    super( options );
  }
}

gasProperties.register( 'DiffusionSettingsPanel', DiffusionSettingsPanel );