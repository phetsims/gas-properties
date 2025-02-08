// Copyright 2018-2025, University of Colorado Boulder

/**
 * ExploreToolsPanel is the panel that appears in the upper-right corner of the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import CollisionCounterCheckbox from '../../common/view/CollisionCounterCheckbox.js';
import StopwatchCheckbox from '../../common/view/StopwatchCheckbox.js';
import WidthCheckbox from '../../common/view/WidthCheckbox.js';
import gasProperties from '../../gasProperties.js';
import WallVelocityCheckbox from './WallVelocityCheckbox.js';

export default class ExploreToolsPanel extends Panel {

  public constructor( wallVelocityVisibleProperty: Property<boolean>,
                      widthVisibleProperty: Property<boolean>,
                      stopwatchVisibleProperty: Property<boolean>,
                      collisionCounterVisibleProperty: Property<boolean>,
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
        new WallVelocityCheckbox( wallVelocityVisibleProperty, {
          textMaxWidth: 125,
          tandem: tandem.createTandem( 'wallVelocityCheckbox' )
        } ),
        new WidthCheckbox( widthVisibleProperty, {
          textMaxWidth: 110,
          tandem: tandem.createTandem( 'widthCheckbox' )
        } ),
        new StopwatchCheckbox( stopwatchVisibleProperty, {
          textMaxWidth: 125,
          tandem: tandem.createTandem( 'stopwatchCheckbox' )
        } ),
        new CollisionCounterCheckbox( collisionCounterVisibleProperty, {
          textMaxWidth: 125,
          tandem: tandem.createTandem( 'collisionCounterCheckbox' )
        } )
      ]
    } );

    super( content, options );
  }
}

gasProperties.register( 'ExploreToolsPanel', ExploreToolsPanel );