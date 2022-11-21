// Copyright 2018-2022, University of Colorado Boulder

/**
 * DiffusionControlPanel is the control panel that appears on the right side of the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { HSeparator, NodeOptions, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import FixedWidthNode from '../../common/view/FixedWidthNode.js';
import StopwatchCheckbox from '../../common/view/StopwatchCheckbox.js';
import gasProperties from '../../gasProperties.js';
import DiffusionSettings from '../model/DiffusionSettings.js';
import CenterOfMassCheckbox from './CenterOfMassCheckbox.js';
import DiffusionSettingsNode from './DiffusionSettingsNode.js';
import DiffusionViewProperties from './DiffusionViewProperties.js';
import DividerToggleButton from './DividerToggleButton.js';
import ParticleFlowRateCheckbox from './ParticleFlowRateCheckbox.js';
import ScaleCheckbox from './ScaleCheckbox.js';

type SelfOptions = {
  fixedWidth?: number;
};

type DiffusionControlPanelOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class DiffusionControlPanel extends Panel {

  /**
   * @param leftSettings - setting for the left side of the container
   * @param rightSettings - setting for the right side of the container
   * @param modelViewTransform
   * @param hasDividerProperty
   * @param numberOfParticlesProperty
   * @param stopwatchVisibleProperty
   * @param viewProperties
   * @param providedOptions
   */
  public constructor( leftSettings: DiffusionSettings,
                      rightSettings: DiffusionSettings,
                      modelViewTransform: ModelViewTransform2,
                      hasDividerProperty: Property<boolean>,
                      numberOfParticlesProperty: TReadOnlyProperty<number>,
                      stopwatchVisibleProperty: Property<boolean>,
                      viewProperties: DiffusionViewProperties,
                      providedOptions: DiffusionControlPanelOptions ) {

    const options = optionize4<DiffusionControlPanelOptions, SelfOptions, PanelOptions>()(
      {}, GasPropertiesConstants.PANEL_OPTIONS, {

        // SelfOptions
        fixedWidth: 100,

        // PanelOptions
        xMargin: GasPropertiesConstants.PANEL_OPTIONS.xMargin
      }, providedOptions );

    const contentWidth = options.fixedWidth - ( 2 * options.xMargin );

    const dividerToggleButton = new DividerToggleButton( hasDividerProperty, {
      tandem: options.tandem.createTandem( 'dividerToggleButton' )
    } );

    const checkboxOptions = {
      textMaxWidth: 175 // determined empirically
    };

    const content = new FixedWidthNode( contentWidth, new VBox( {
      align: 'left',
      spacing: 18,
      children: [

        // spinners
        new DiffusionSettingsNode( leftSettings, rightSettings, modelViewTransform, hasDividerProperty, {
          tandem: options.tandem.createTandem( 'settingsNode' )
        } ),

        // Remove/Reset Separator button, centered
        new FixedWidthNode( contentWidth, dividerToggleButton, {
          align: 'center'
        } ),

        // ------------
        new HSeparator( {
          stroke: GasPropertiesColors.separatorColorProperty
        } ),

        // checkboxes
        new VBox( {
          align: 'left',
          spacing: 12,
          children: [
            new CenterOfMassCheckbox( viewProperties.centerOfMassVisibleProperty, merge( {}, checkboxOptions, {
              tandem: options.tandem.createTandem( 'centerOfMassCheckbox' )
            } ) ),
            new ParticleFlowRateCheckbox( viewProperties.particleFlowRateVisibleProperty, merge( {}, checkboxOptions, {
              tandem: options.tandem.createTandem( 'particleFlowRateCheckbox' )
            } ) ),
            new ScaleCheckbox( viewProperties.scaleVisibleProperty, merge( {}, checkboxOptions, {
              tandem: options.tandem.createTandem( 'scaleCheckbox' )
            } ) ),
            new StopwatchCheckbox( stopwatchVisibleProperty, merge( {}, checkboxOptions, {
              tandem: options.tandem.createTandem( 'stopwatchCheckbox' )
            } ) )
          ]
        } )
      ]
    } ) );

    super( content, options );

    // Disable the button when the container is empty.
    numberOfParticlesProperty.link( numberOfParticles => {
      dividerToggleButton.enabled = ( numberOfParticles !== 0 );
    } );
  }
}

gasProperties.register( 'DiffusionControlPanel', DiffusionControlPanel );