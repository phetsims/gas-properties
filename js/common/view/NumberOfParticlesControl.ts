// Copyright 2018-2024, University of Colorado Boulder

/**
 * NumberOfParticlesControl is a control for changing the number of particles for a specific type of particle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import FineCoarseSpinner, { FineCoarseSpinnerOptions } from '../../../../scenery-phet/js/FineCoarseSpinner.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, KeyboardListener, Node, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesColors from '../GasPropertiesColors.js';
import GasPropertiesConstants from '../GasPropertiesConstants.js';
import pushButtonSoundPlayer from '../../../../tambo/js/shared-sound-players/pushButtonSoundPlayer.js';

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
      isDisposable: false,
      align: 'left',
      spacing: 10,
      phetioFeatured: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    }, providedOptions );

    const labelText = new Text( titleStringProperty, {
      font: GasPropertiesConstants.CONTROL_FONT,
      fill: GasPropertiesColors.textFillProperty,
      maxWidth: 150 // determined empirically
    } );

    const labelBox = new HBox( {
      spacing: X_SPACING,
      children: [ icon, labelText ]
    } );

    const spinner = new GasPropertiesFineCoarseSpinner( numberOfParticlesProperty, {
      deltaFine: 1,
      deltaCoarse: 50,
      numberDisplayOptions: {
        textOptions: {
          font: new PhetFont( 18 )
        }
      },
      maxWidth: 190, // determined empirically
      tandem: options.tandem.createTandem( 'spinner' ),
      phetioVisiblePropertyInstrumented: false // Clients should hide the entire control.
    } );

    // Limit width of text
    labelText.maxWidth = spinner.width - icon.width - X_SPACING;

    options.children = [ labelBox, spinner ];

    super( options );
  }
}

//TODO https://github.com/phetsims/sun/issues/886 Delete this class when Home/End sound has been added to FineCoarseSpinner.
class GasPropertiesFineCoarseSpinner extends FineCoarseSpinner {
  public constructor( numberProperty: NumberProperty, providedOptions?: FineCoarseSpinnerOptions ) {
    super( numberProperty, providedOptions );

    // Add sound for the Home and End keys.
    this.addInputListener( new KeyboardListener( {
      keys: [ 'home', 'end' ] as const,
      fire: () => pushButtonSoundPlayer.play()
    } ) );
  }
}

gasProperties.register( 'NumberOfParticlesControl', NumberOfParticlesControl );