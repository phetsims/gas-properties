// Copyright 2018-2023, University of Colorado Boulder

/**
 * HoldConstantPanel is the control panel that appears in the upper-right corner of the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { NodeTranslationOptions, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';
import HoldConstantControl from './HoldConstantControl.js';
import { HoldConstant } from '../../common/model/HoldConstant.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';

type SelfOptions = {
  fixedWidth?: number;
};

type IdealControlPanelOptions = SelfOptions & NodeTranslationOptions & PickRequired<PanelOptions, 'tandem'>;

export default class HoldConstantPanel extends Panel {

  public constructor( holdConstantProperty: StringUnionProperty<HoldConstant>,
                      numberOfParticlesProperty: TReadOnlyProperty<number>,
                      pressureProperty: TReadOnlyProperty<number>,
                      isContainerOpenProperty: TReadOnlyProperty<boolean>,
                      providedOptions: IdealControlPanelOptions ) {

    const options = optionize4<IdealControlPanelOptions, SelfOptions, PanelOptions>()(
      {}, GasPropertiesConstants.PANEL_OPTIONS, {

        // SelfOptions
        fixedWidth: 100,
        xMargin: GasPropertiesConstants.PANEL_OPTIONS.xMargin,

        // PanelOptions
        isDisposable: false
      }, providedOptions );

    const contentWidth = options.fixedWidth - ( 2 * options.xMargin );

    //TODO https://github.com/phetsims/gas-properties/issues/225 move HoldConstantControl into this file
    const holdConstantControl = new HoldConstantControl(
      holdConstantProperty, numberOfParticlesProperty, pressureProperty, isContainerOpenProperty, {
        maxWidth: contentWidth,
        tandem: options.tandem.createTandem( 'holdConstantControl' )
      } );

    const content = new VBox( {
      preferredWidth: contentWidth,
      widthSizable: false, // so that width will remain preferredWidth
      align: 'left',
      spacing: 12,
      children: [ holdConstantControl ]
    } );

    super( content, options );
  }
}

gasProperties.register( 'HoldConstantPanel', HoldConstantPanel );