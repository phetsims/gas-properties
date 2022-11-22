// Copyright 2022, University of Colorado Boulder

/**
 * GasPropertiesPreferencesNode is the user interface for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, and affect all screens.
 *
 * The Preferences dialog is created on demand by joist, using a PhetioCapsule. So GasPropertiesPreferencesNode must
 * implement dispose, and all elements of GasPropertiesPreferencesNode that have tandems must be disposed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesPreferences from '../model/GasPropertiesPreferences.js';
import { PressureNoiseCheckbox } from './PressureNoiseCheckbox.js';
import { Node, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';

type SelfOptions = EmptySelfOptions;

type GasPropertiesPreferencesNodeOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class GasPropertiesPreferencesNode extends VBox {

  private readonly disposeGasPropertiesPreferencesNode: () => void;

  public constructor( providedOptions: GasPropertiesPreferencesNodeOptions ) {

    const options = optionize<GasPropertiesPreferencesNodeOptions, SelfOptions, VBoxOptions>()( {
      // empty optionize, because we're setting options.children below
    }, providedOptions );

    const children: Node[] = [];

    // Pressure Noise checkbox
    const pressureNoiseCheckbox = new PressureNoiseCheckbox( GasPropertiesPreferences.pressureNoiseProperty, {
      tandem: options.tandem.createTandem( 'pressureNoiseCheckbox' )
    } );
    children.push( pressureNoiseCheckbox );

    options.children = children;

    super( options );

    this.disposeGasPropertiesPreferencesNode = () => {
      children.forEach( child => child.dispose() );
    };
  }

  public override dispose(): void {
    this.disposeGasPropertiesPreferencesNode();
    super.dispose();
  }
}

gasProperties.register( 'GasPropertiesPreferencesNode', GasPropertiesPreferencesNode );