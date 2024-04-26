// Copyright 2019-2024, University of Colorado Boulder

/**
 * AverageSpeedAccordionBox displays the average speed (in m/s) for each type of particle in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import { combineOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { AlignGroup, GridBox, Text, VBox } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import SunConstants from '../../../../sun/js/SunConstants.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import GasPropertiesIconFactory from '../../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../../gasProperties.js';
import GasPropertiesStrings from '../../GasPropertiesStrings.js';

type SelfOptions = {
  fixedWidth?: number;
};

type AverageSpeedAccordionBoxOptions = SelfOptions & PickRequired<AccordionBoxOptions, 'expandedProperty' | 'tandem'>;

export default class AverageSpeedAccordionBox extends AccordionBox {

  public constructor( heavyAverageSpeedProperty: Property<number | null>,
                      lightAverageSpeedProperty: Property<number | null>,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: AverageSpeedAccordionBoxOptions ) {

    const options = optionize4<AverageSpeedAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()(
      {}, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        // SelfOptions
        fixedWidth: 100,

        // AccordionBoxOptions
        isDisposable: false,
        contentXMargin: GasPropertiesConstants.ACCORDION_BOX_OPTIONS.contentXMargin,
        contentYSpacing: 0,
        titleNode: new Text( GasPropertiesStrings.averageSpeedStringProperty, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColors.textFillProperty
        } )
      }, providedOptions );

    // Limit width of title
    options.titleNode.maxWidth = 0.75 * options.fixedWidth; // determined empirically

    // Icons for the particles, with same effective size.
    const alignGroup = new AlignGroup();
    const heavyParticleNode = alignGroup.createBox( GasPropertiesIconFactory.createHeavyParticleIcon( modelViewTransform ) );
    const lightParticleNode = alignGroup.createBox( GasPropertiesIconFactory.createLightParticleIcon( modelViewTransform ) );

    // Used for both NumberDisplay instances
    const valuePatternStringProperty = new PatternStringProperty( GasPropertiesStrings.valueUnitsStringProperty, {
      units: GasPropertiesStrings.metersPerSecondStringProperty
    }, {
      tandem: options.tandem.createTandem( 'valuePatternStringProperty' )
    } );
    const numberDisplayRange = new Range( 0, 9999 );
    const numberDisplayOptions: NumberDisplayOptions = {
      valuePattern: valuePatternStringProperty,
      noValuePattern: SunConstants.VALUE_NAMED_PLACEHOLDER,
      decimalPlaces: 0,
      align: 'right',
      noValueAlign: 'left',
      textOptions: {
        font: new PhetFont( 16 ),
        fill: GasPropertiesColors.textFillProperty
      },
      backgroundFill: null,
      backgroundStroke: null,
      maxWidth: 150
    };

    // These Properties are in pm/ps, and we want to display in m/s.  There is no need to convert the values,
    // since the conversion (1E-12) is the same for numerator and denominator.
    const heavyNumberDisplay = new NumberDisplay( heavyAverageSpeedProperty, numberDisplayRange,
      combineOptions<NumberDisplayOptions>( {}, numberDisplayOptions, {
        tandem: options.tandem.createTandem( 'heavyNumberDisplay' )
      } ) );
    const lightNumberDisplay = new NumberDisplay( lightAverageSpeedProperty, numberDisplayRange,
      combineOptions<NumberDisplayOptions>( {}, numberDisplayOptions, {
        tandem: options.tandem.createTandem( 'lightNumberDisplay' )
      } ) );

    // layout icons and NumberDisplays in a grid
    const gridBox = new GridBox( {
      rows: [
        [ heavyParticleNode, heavyNumberDisplay ],
        [ lightParticleNode, lightNumberDisplay ]
      ]
    } );

    const content = new VBox( {
      preferredWidth: options.fixedWidth - ( 2 * options.contentXMargin ),
      widthSizable: false, // so that width will remain preferredWidth
      align: 'center',
      children: [ gridBox ]
    } );

    super( content, options );
  }
}

gasProperties.register( 'AverageSpeedAccordionBox', AverageSpeedAccordionBox );