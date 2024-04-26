// Copyright 2024, University of Colorado Boulder

/**
 * IdealToolsPanel is the panel for controlling visibility of 'tools' in the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import StopwatchCheckbox from '../../common/view/StopwatchCheckbox.js';
import WidthCheckbox from '../../common/view/WidthCheckbox.js';
import gasProperties from '../../gasProperties.js';
import CollisionCounterCheckbox from '../../common/view/CollisionCounterCheckbox.js';

type SelfOptions = {
  fixedWidth?: number;
};

type IdealToolsPanelOptions = SelfOptions & PickRequired<PanelOptions, 'tandem'>;

export default class IdealToolsPanel extends Panel {

  public constructor( widthVisibleProperty: Property<boolean>,
                      stopwatchVisibleProperty: Property<boolean>,
                      collisionCounterVisibleProperty: Property<boolean>,
                      providedOptions: IdealToolsPanelOptions ) {

    const options = optionize4<IdealToolsPanelOptions, SelfOptions, PanelOptions>()(
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
        new WidthCheckbox( widthVisibleProperty, {
          textMaxWidth: 110,
          tandem: options.tandem.createTandem( 'widthCheckbox' )
        } ),
        new StopwatchCheckbox( stopwatchVisibleProperty, {
          textMaxWidth: 125,
          tandem: options.tandem.createTandem( 'stopwatchCheckbox' )
        } ),
        new CollisionCounterCheckbox( collisionCounterVisibleProperty, {
          textMaxWidth: 125,
          tandem: options.tandem.createTandem( 'collisionCounterCheckbox' )
        } )
      ]
    } );

    super( content, options );
  }
}

gasProperties.register( 'IdealToolsPanel', IdealToolsPanel );