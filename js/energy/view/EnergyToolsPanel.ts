// Copyright 2018-2022, University of Colorado Boulder

/**
 * EnergyToolsPanel is the panel that appears in the upper-right corner of the 'Energy' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import FixedWidthNode from '../../common/view/FixedWidthNode.js';
import StopwatchCheckbox from '../../common/view/StopwatchCheckbox.js';
import WidthCheckbox from '../../common/view/WidthCheckbox.js';
import gasProperties from '../../gasProperties.js';

type SelfOptions = {
  fixedWidth?: number;
};

type EnergyToolsPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem'>;

export default class EnergyToolsPanel extends Panel {

  public constructor( widthVisibleProperty: Property<boolean>, stopwatchVisibleProperty: Property<boolean>,
                      providedOptions: EnergyToolsPanelOptions ) {

    const options = optionize4<EnergyToolsPanelOptions, SelfOptions, PanelOptions>()(
      {}, GasPropertiesConstants.PANEL_OPTIONS, {

        // SelfOptions
        fixedWidth: 100,

        // PanelOptions
        xMargin: GasPropertiesConstants.PANEL_OPTIONS.xMargin
      }, providedOptions );

    const contentWidth = options.fixedWidth - ( 2 * options.xMargin );

    const checkboxOptions = {
      textMaxWidth: 110 // determined empirically
    };

    const content = new FixedWidthNode( contentWidth, new VBox( {
      align: 'left',
      spacing: 12,
      children: [
        new WidthCheckbox( widthVisibleProperty, merge( {}, checkboxOptions, {
          tandem: options.tandem.createTandem( 'widthCheckbox' )
        } ) ),
        new StopwatchCheckbox( stopwatchVisibleProperty, merge( {}, checkboxOptions, {
          tandem: options.tandem.createTandem( 'stopwatchCheckbox' )
        } ) )
      ]
    } ) );

    super( content, options );
  }
}

gasProperties.register( 'EnergyToolsPanel', EnergyToolsPanel );