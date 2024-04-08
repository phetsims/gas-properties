// Copyright 2018-2023, University of Colorado Boulder

/**
 * DiffusionToolsPanel is the panel for setting the visibility of tools in the Diffusion screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { NodeOptions, NodeTranslationOptions, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import StopwatchCheckbox from '../../common/view/StopwatchCheckbox.js';
import gasProperties from '../../gasProperties.js';
import CenterOfMassCheckbox from './CenterOfMassCheckbox.js';
import DiffusionViewProperties from './DiffusionViewProperties.js';
import ParticleFlowRateCheckbox from './ParticleFlowRateCheckbox.js';
import ScaleCheckbox from './ScaleCheckbox.js';

const TEXT_MAX_WIDTH = 175; // determined empirically

type SelfOptions = {
  fixedWidth?: number;
};

type DiffusionControlPanelOptions = SelfOptions & NodeTranslationOptions & PickRequired<NodeOptions, 'tandem'>;

export default class DiffusionToolsPanel extends Panel {

  public constructor( viewProperties: DiffusionViewProperties,
                      stopwatchVisibleProperty: Property<boolean>,
                      providedOptions: DiffusionControlPanelOptions ) {

    const options = optionize4<DiffusionControlPanelOptions, SelfOptions, PanelOptions>()(
      {}, GasPropertiesConstants.PANEL_OPTIONS, {

        // SelfOptions
        fixedWidth: 100,

        // PanelOptions
        isDisposable: false,
        xMargin: GasPropertiesConstants.PANEL_OPTIONS.xMargin
      }, providedOptions );

    const content = new VBox( {
      preferredWidth: options.fixedWidth - ( 2 * options.xMargin ),
      widthSizable: false, // so that width will remain preferredWidth
      align: 'left',
      spacing: 12,
      children: [
        new CenterOfMassCheckbox( viewProperties.centerOfMassVisibleProperty, {
          textMaxWidth: TEXT_MAX_WIDTH,
          tandem: options.tandem.createTandem( 'centerOfMassCheckbox' )
        } ),
        new ParticleFlowRateCheckbox( viewProperties.particleFlowRateVisibleProperty, {
          textMaxWidth: TEXT_MAX_WIDTH,
          tandem: options.tandem.createTandem( 'particleFlowRateCheckbox' )
        } ),
        new ScaleCheckbox( viewProperties.scaleVisibleProperty, {
          textMaxWidth: TEXT_MAX_WIDTH,
          tandem: options.tandem.createTandem( 'scaleCheckbox' )
        } ),
        new StopwatchCheckbox( stopwatchVisibleProperty, {
          textMaxWidth: TEXT_MAX_WIDTH,
          tandem: options.tandem.createTandem( 'stopwatchCheckbox' )
        } )
      ]
    } );

    super( content, options );
  }
}

gasProperties.register( 'DiffusionToolsPanel', DiffusionToolsPanel );