// Copyright 2019-2021, University of Colorado Boulder

/**
 * AverageSpeedAccordionBox displays the average speed (in m/s) for each type of particle in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import SunConstants from '../../../../sun/js/SunConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesColors from '../../common/GasPropertiesColors.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import FixedWidthNode from '../../common/view/FixedWidthNode.js';
import GasPropertiesIconFactory from '../../common/view/GasPropertiesIconFactory.js';
import gasProperties from '../../gasProperties.js';
import gasPropertiesStrings from '../../gasPropertiesStrings.js';

class AverageSpeedAccordionBox extends AccordionBox {

  /**
   * @param {Property.<number|null>} heavyAverageSpeedProperty - average speed of heavy particles, in pm/ps
   * @param {Property.<number|null>} lightAverageSpeedProperty - average speed of light particles, in pm/ps
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( heavyAverageSpeedProperty, lightAverageSpeedProperty, modelViewTransform, options ) {
    assert && assert( heavyAverageSpeedProperty instanceof Property,
      `invalid heavyAverageSpeedProperty: ${heavyAverageSpeedProperty}` );
    assert && assert( lightAverageSpeedProperty instanceof Property,
      `invalid lightAverageSpeedProperty: ${lightAverageSpeedProperty}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );

    options = merge( {
      fixedWidth: 100,
      contentXMargin: 0
    }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

      // superclass options
      contentYSpacing: 0,
      titleNode: new Text( gasPropertiesStrings.averageSpeed, {
        font: GasPropertiesConstants.TITLE_FONT,
        fill: GasPropertiesColors.textFillProperty
      } ),

      // phet-io
      tandem: Tandem.REQUIRED

    }, options );

    // Limit width of title
    options.titleNode.maxWidth = 0.75 * options.fixedWidth; // determined empirically

    // icons for the particles
    const heavyParticleNode = GasPropertiesIconFactory.createHeavyParticleIcon( modelViewTransform );
    const lightParticleNode = GasPropertiesIconFactory.createLightParticleIcon( modelViewTransform );

    // add a horizontal strut so that icons have the same effective width
    const maxWidth = Math.max( heavyParticleNode.width, lightParticleNode.width );
    heavyParticleNode.addChild( new HStrut( maxWidth, { center: heavyParticleNode.center } ) );
    lightParticleNode.addChild( new HStrut( maxWidth, { center: lightParticleNode.center } ) );

    const numberDisplayRange = new Range( 0, 9999 );
    const numberDisplayOptions = {
      valuePattern: StringUtils.fillIn( gasPropertiesStrings.valueUnits, { units: gasPropertiesStrings.metersPerSecond } ),
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
    const heavyNumberDisplay = new NumberDisplay( heavyAverageSpeedProperty, numberDisplayRange, numberDisplayOptions );
    const lightNumberDisplay = new NumberDisplay( lightAverageSpeedProperty, numberDisplayRange, numberDisplayOptions );

    const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

    // layout icons and NumberDisplays in a grid
    const content = new FixedWidthNode( contentWidth, new VBox( {
      align: 'left',
      children: [
        new HBox( { children: [ heavyParticleNode, heavyNumberDisplay ] } ),
        new HBox( { children: [ lightParticleNode, lightNumberDisplay ] } )
      ]
    } ), {
      align: 'center'
    } );

    super( content, options );
  }
}

gasProperties.register( 'AverageSpeedAccordionBox', AverageSpeedAccordionBox );
export default AverageSpeedAccordionBox;