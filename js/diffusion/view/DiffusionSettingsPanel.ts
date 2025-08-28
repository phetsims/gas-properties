// Copyright 2019-2025, University of Colorado Boulder

/**
 * DiffusionSettingsPanel is the panel for setting initial conditions in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';
import DiffusionSettings from '../model/DiffusionSettings.js';
import DiffusionQuantityControls from './DiffusionQuantityControls.js';
import DividerToggleButton from './DividerToggleButton.js';

export default class DiffusionSettingsPanel extends Panel {

  /**
   * @param particle1Settings - settings for particle type 1
   * @param particle2Settings - settings for particle type 2
   * @param numberOfParticlesProperty
   * @param numberOfParticleTypesProperty
   * @param isDividedProperty
   * @param modelViewTransform
   * @param tandem
   */
  public constructor( particle1Settings: DiffusionSettings,
                      particle2Settings: DiffusionSettings,
                      numberOfParticlesProperty: TReadOnlyProperty<number>,
                      numberOfParticleTypesProperty: TReadOnlyProperty<number>,
                      isDividedProperty: Property<boolean>,
                      modelViewTransform: ModelViewTransform2,
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
    const numberOfParticlesControls = new DiffusionQuantityControls( 'numberOfParticles', GasPropertiesStrings.numberOfParticlesStringProperty,
      modelViewTransform, particle1Settings.numberOfParticlesProperty, particle2Settings.numberOfParticlesProperty, spinnersAlignGroup,
      numberOfParticleTypesProperty, {
        spinnerOptions: {
          enabledProperty: isDividedProperty,
          deltaValue: DiffusionSettings.DELTAS.numberOfParticles
        },
        tandem: tandem.createTandem( 'numberOfParticlesControls' )
      } );

    // Mass (AMU)
    const massControls = new DiffusionQuantityControls( 'mass', GasPropertiesStrings.massAMUStringProperty, modelViewTransform,
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
    const radiusControls = new DiffusionQuantityControls( 'radius', GasPropertiesStrings.radiusPmStringProperty, modelViewTransform,
      particle1Settings.radiusProperty, particle2Settings.radiusProperty, spinnersAlignGroup, numberOfParticleTypesProperty, {
        spinnerOptions: {
          enabledProperty: isDividedProperty,
          deltaValue: DiffusionSettings.DELTAS.radius
        },
        tandem: tandem.createTandem( 'radiusControls' )
      } );

    // Initial Temperature (K)
    const initialTemperatureControls = new DiffusionQuantityControls( 'initialTemperature', GasPropertiesStrings.initialTemperatureKStringProperty,
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

gasProperties.register( 'DiffusionSettingsPanel', DiffusionSettingsPanel );