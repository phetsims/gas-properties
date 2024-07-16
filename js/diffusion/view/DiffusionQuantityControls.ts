// Copyright 2024, University of Colorado Boulder

/**
 * DiffusionQuantityControls is a label and two spinners, for changing the same quantity for each particle type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import NumberSpinner, { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { AlignBox, AlignBoxOptions, AlignGroup, HBox, HStrut, KeyboardListener, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesIconFactory from '../../common/view/GasPropertiesIconFactory.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import gasProperties from '../../gasProperties.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import pushButtonSoundPlayer from '../../../../tambo/js/shared-sound-players/pushButtonSoundPlayer.js';

const ICON_SPACING = 10; // space between particle icon and spinner

const NUMBER_SPINNER_OPTIONS: NumberSpinnerOptions = {
  isDisposable: false,
  numberDisplayOptions: {
    decimalPlaces: 0,
    xMargin: 8,
    yMargin: 6,
    textOptions: {
      font: GasPropertiesConstants.CONTROL_FONT
    },
    tandem: Tandem.OPT_OUT
  },
  touchAreaXDilation: 15,
  touchAreaYDilation: 15,
  phetioVisiblePropertyInstrumented: false
};

type SelfOptions = {
  spinnerOptions?: StrictOmit<NumberSpinnerOptions, 'tandem'>;
};

type DiffusionQuantityControlsOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class DiffusionQuantityControls extends VBox {

  /**
   * @param spinnerTandemPrefix
   * @param labelStringProperty
   * @param modelViewTransform
   * @param leftProperty - quantity for the left side of the container
   * @param rightProperty - quantity for the right side of the container
   * @param spinnersAlignGroup
   * @param numberOfParticleTypesProperty
   * @param providedOptions
   */
  public constructor( spinnerTandemPrefix: string,
                      labelStringProperty: TReadOnlyProperty<string>,
                      modelViewTransform: ModelViewTransform2,
                      leftProperty: NumberProperty,
                      rightProperty: NumberProperty,
                      spinnersAlignGroup: AlignGroup,
                      numberOfParticleTypesProperty: TReadOnlyProperty<number>,
                      providedOptions: DiffusionQuantityControlsOptions ) {

    const options = optionize<DiffusionQuantityControlsOptions, StrictOmit<SelfOptions, 'spinnerOptions'>, VBoxOptions>()( {

      // VBoxOptions
      spacing: 12,
      align: 'left',
      visiblePropertyOptions: {
        phetioFeatured: true // see https://github.com/phetsims/gas-properties/issues/286
      }
    }, providedOptions );

    // label
    const labelText = new Text( labelStringProperty, {
      font: GasPropertiesConstants.CONTROL_FONT,
      fill: GasPropertiesColors.textFillProperty,
      maxWidth: 225 // determined empirically
    } );

    // icons
    const particle1Icon = GasPropertiesIconFactory.createDiffusionParticle1Icon( modelViewTransform );
    const particle2Icon = GasPropertiesIconFactory.createDiffusionParticle2Icon( modelViewTransform );

    // spinners, with uniform bounds width to facilitate layout
    const alignBoxOptions: AlignBoxOptions = {
      group: spinnersAlignGroup,
      xAlign: 'left'
    };
    const particle1Spinner = new AlignBox( new GasPropertiesNumberSpinner( leftProperty, leftProperty.rangeProperty,
      combineOptions<NumberSpinnerOptions>( {}, NUMBER_SPINNER_OPTIONS, {
        tandem: options.tandem.createTandem( `${spinnerTandemPrefix}1Spinner` )
      }, options.spinnerOptions ) ), alignBoxOptions );
    const particle2Spinner = new AlignBox( new GasPropertiesNumberSpinner( rightProperty, rightProperty.rangeProperty,
      combineOptions<NumberSpinnerOptions>( {}, NUMBER_SPINNER_OPTIONS, {
        tandem: options.tandem.createTandem( `${spinnerTandemPrefix}2Spinner` )
      }, options.spinnerOptions ) ), alignBoxOptions );

    // icon and spinner for particle type 1
    const box1 = new HBox( {
      spacing: ICON_SPACING,
      children: [ particle1Icon, particle1Spinner ]
    } );

    // icon and spinner for particle type 2
    const box2 = new HBox( {
      spacing: ICON_SPACING,
      children: [ particle2Icon, particle2Spinner ],
      visibleProperty: new DerivedProperty( [ numberOfParticleTypesProperty ], n => n === 2 )
    } );

    // both controls, indented
    const hBox = new HBox( {
      spacing: 30,
      children: [ new HStrut( 1 ), box1, box2 ]
    } );

    options.children = [ labelText, hBox ];

    super( options );
  }
}

//TODO https://github.com/phetsims/sun/issues/886 Delete this class when Home/End sound has been added to NumberSpinner.
class GasPropertiesNumberSpinner extends NumberSpinner {
  public constructor( numberProperty: Property<number>, rangeProperty: TReadOnlyProperty<Range>, providedOptions?: NumberSpinnerOptions ) {
    super( numberProperty, rangeProperty, providedOptions );

    // Add sound for the Home and End keys.
    this.addInputListener( new KeyboardListener( {
      keys: [ 'home', 'end' ] as const,
      fire: () => pushButtonSoundPlayer.play()
    } ) );
  }
}

gasProperties.register( 'DiffusionQuantityControls', DiffusionQuantityControls );