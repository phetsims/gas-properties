// Copyright 2018-2024, University of Colorado Boulder

/**
 * DiffusionToolsPanel is the panel for controlling the visibility of 'tools' in the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import StopwatchCheckbox from '../../common/view/StopwatchCheckbox.js';
import gasProperties from '../../gasProperties.js';
import CenterOfMassCheckbox from './CenterOfMassCheckbox.js';
import DiffusionViewProperties from './DiffusionViewProperties.js';
import ParticleFlowRateCheckbox from './ParticleFlowRateCheckbox.js';
import ScaleCheckbox from './ScaleCheckbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';

const TEXT_MAX_WIDTH = 175; // determined empirically

export default class DiffusionToolsPanel extends Panel {

  public constructor( viewProperties: DiffusionViewProperties,
                      stopwatchVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {}, GasPropertiesConstants.PANEL_OPTIONS, {
      isDisposable: false,
      xMargin: GasPropertiesConstants.PANEL_OPTIONS.xMargin,
      tandem: tandem
    } );

    const content = new VBox( {
      align: 'left',
      spacing: 12,
      stretch: true,
      children: [
        new CenterOfMassCheckbox( viewProperties.centerOfMassVisibleProperty, {
          textMaxWidth: TEXT_MAX_WIDTH,
          tandem: tandem.createTandem( 'centerOfMassCheckbox' )
        } ),
        new ParticleFlowRateCheckbox( viewProperties.particleFlowRateVisibleProperty, {
          textMaxWidth: TEXT_MAX_WIDTH,
          tandem: tandem.createTandem( 'particleFlowRateCheckbox' )
        } ),
        new ScaleCheckbox( viewProperties.scaleVisibleProperty, {
          textMaxWidth: TEXT_MAX_WIDTH,
          tandem: tandem.createTandem( 'scaleCheckbox' )
        } ),
        new StopwatchCheckbox( stopwatchVisibleProperty, {
          textMaxWidth: TEXT_MAX_WIDTH,
          tandem: tandem.createTandem( 'stopwatchCheckbox' )
        } )
      ]
    } );

    super( content, options );
  }
}

gasProperties.register( 'DiffusionToolsPanel', DiffusionToolsPanel );