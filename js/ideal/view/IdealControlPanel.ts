// Copyright 2018-2022, University of Colorado Boulder

/**
 * IdealControlPanel is the control panel that appears in the upper-right corner of the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { HSeparator, NodeTranslationOptions, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import CollisionCounterCheckbox from '../../common/view/CollisionCounterCheckbox.js';
import StopwatchCheckbox from '../../common/view/StopwatchCheckbox.js';
import WidthCheckbox from '../../common/view/WidthCheckbox.js';
import gasProperties from '../../gasProperties.js';
import HoldConstantControl from './HoldConstantControl.js';
import { HoldConstant } from '../../common/model/HoldConstant.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';

type SelfOptions = {
  hasHoldConstantControls?: boolean;
  fixedWidth?: number;
};

type IdealControlPanelOptions = SelfOptions & NodeTranslationOptions & PickRequired<PanelOptions, 'tandem'>;

export default class IdealControlPanel extends Panel {

  public constructor( holdConstantProperty: StringUnionProperty<HoldConstant>,
                      numberOfParticlesProperty: TReadOnlyProperty<number>,
                      pressureProperty: TReadOnlyProperty<number>,
                      isContainerOpenProperty: TReadOnlyProperty<boolean>,
                      widthVisibleProperty: Property<boolean>,
                      stopwatchVisibleProperty: Property<boolean>,
                      collisionCounterVisibleProperty: Property<boolean>,
                      providedOptions: IdealControlPanelOptions ) {

    const options = optionize4<IdealControlPanelOptions, SelfOptions, PanelOptions>()(
      {}, GasPropertiesConstants.PANEL_OPTIONS, {

        // SelfOptions
        hasHoldConstantControls: true,
        fixedWidth: 100,
        xMargin: GasPropertiesConstants.PANEL_OPTIONS.xMargin
      }, providedOptions );

    const contentWidth = options.fixedWidth - ( 2 * options.xMargin );

    const children = [];

    // Optional HoldConstantControl and separator
    if ( options.hasHoldConstantControls ) {
      children.push( new HoldConstantControl(
        holdConstantProperty, numberOfParticlesProperty, pressureProperty, isContainerOpenProperty, {
          maxWidth: contentWidth,
          tandem: options.tandem.createTandem( 'holdConstantControl' )
        } ) );
      children.push( new HSeparator( {
        stroke: GasPropertiesColors.separatorColorProperty,
        minimumWidth: contentWidth
      } ) );
    }

    children.push( new WidthCheckbox( widthVisibleProperty, {
      textMaxWidth: 110,
      tandem: options.tandem.createTandem( 'widthCheckbox' )
    } ) );
    children.push( new StopwatchCheckbox( stopwatchVisibleProperty, {
      textMaxWidth: 125,
      tandem: options.tandem.createTandem( 'stopwatchCheckbox' )
    } ) );
    children.push( new CollisionCounterCheckbox( collisionCounterVisibleProperty, {
      textMaxWidth: 125,
      tandem: options.tandem.createTandem( 'collisionCounterCheckbox' )
    } ) );

    const content = new VBox( {
      preferredWidth: contentWidth,
      widthSizable: false, // so that width will remain preferredWidth
      align: 'left',
      spacing: 12,
      children: children
    } );

    super( content, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'IdealControlPanel', IdealControlPanel );