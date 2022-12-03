// Copyright 2018-2022, University of Colorado Boulder

/**
 * NumberOfParticlesControl is a control for changing the number of particles for a specific type of particle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import FineCoarseSpinner from '../../../../scenery-phet/js/FineCoarseSpinner.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';

// const
const X_SPACING = 8;

type SelfOptions = EmptySelfOptions;

type NumberOfParticlesControlOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class NumberOfParticlesControl extends VBox {

  public constructor( icon: Node,
                      titleStringProperty: TReadOnlyProperty<string>,
                      numberOfParticlesProperty: NumberProperty,
                      providedOptions: NumberOfParticlesControlOptions ) {

    const options = optionize<NumberOfParticlesControlOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      align: 'left',
      spacing: 10
    }, providedOptions );

    const labelText = new Text( titleStringProperty, {
      font: GasPropertiesConstants.CONTROL_FONT,
      fill: GasPropertiesColors.textFillProperty,
      maxWidth: 150, // determined empirically,
      tandem: options.tandem.createTandem( 'labelText' )
    } );

    const labelBox = new HBox( {
      spacing: X_SPACING,
      children: [ icon, labelText ]
    } );

    const spinner = new FineCoarseSpinner( numberOfParticlesProperty, {
      deltaFine: 1,
      deltaCoarse: 50,
      numberDisplayOptions: {
        textOptions: {
          font: new PhetFont( 18 )
        }
      },
      maxWidth: 190, // determined empirically
      tandem: options.tandem.createTandem( 'spinner' )
    } );

    // Limit width of text
    labelText.maxWidth = spinner.width - icon.width - X_SPACING;

    options.children = [ labelBox, spinner ];

    super( options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

gasProperties.register( 'NumberOfParticlesControl', NumberOfParticlesControl );