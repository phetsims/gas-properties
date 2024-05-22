// Copyright 2018-2024, University of Colorado Boulder

/**
 * EnergyToolsPanel is the panel for controlling visibility of 'tools' in the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import StopwatchCheckbox from '../../common/view/StopwatchCheckbox.js';
import WidthCheckbox from '../../common/view/WidthCheckbox.js';
import gasProperties from '../../gasProperties.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class EnergyToolsPanel extends Panel {

  public constructor( widthVisibleProperty: Property<boolean>, stopwatchVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const options = combineOptions<PanelOptions>(
      {}, GasPropertiesConstants.PANEL_OPTIONS, {
        isDisposable: false,
        xMargin: GasPropertiesConstants.PANEL_OPTIONS.xMargin,
        tandem: tandem
      } );

    const content = new VBox( {
      align: 'left',
      spacing: 12,
      stretch: true,
      children: [
        new WidthCheckbox( widthVisibleProperty, {
          textMaxWidth: 110,
          tandem: tandem.createTandem( 'widthCheckbox' )
        } ),
        new StopwatchCheckbox( stopwatchVisibleProperty, {
          textMaxWidth: 125,
          tandem: tandem.createTandem( 'stopwatchCheckbox' )
        } )
      ]
    } );

    super( content, options );
  }
}

gasProperties.register( 'EnergyToolsPanel', EnergyToolsPanel );