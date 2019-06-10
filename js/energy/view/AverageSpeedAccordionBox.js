// Copyright 2019, University of Colorado Boulder

/**
 * Displays the average speed (in m/s) for each type of particle in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const FixedWidthNode = require( 'GAS_PROPERTIES/common/view/FixedWidthNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const Property = require( 'AXON/Property' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Range = require( 'DOT/Range' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const SunConstants = require( 'SUN/SunConstants' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const averageSpeedString = require( 'string!GAS_PROPERTIES/averageSpeed' );
  const metersPerSecondString = require( 'string!GAS_PROPERTIES/metersPerSecond' );
  const valueUnitsString = require( 'string!GAS_PROPERTIES/valueUnits' );

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

      options = _.extend( {
        fixedWidth: 100,
        contentXMargin: 0
      }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        // superclass options
        contentYSpacing: 0,
        titleNode: new Text( averageSpeedString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } )

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
        valuePattern: StringUtils.fillIn( valueUnitsString, { units: metersPerSecondString } ),
        noValuePattern: SunConstants.VALUE_NAMED_PLACEHOLDER,
        decimalPlaces: 0,
        align: 'right',
        noValueAlign: 'left',
        font: new PhetFont( 16 ),
        numberFill: GasPropertiesColorProfile.textFillProperty,
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

  return gasProperties.register( 'AverageSpeedAccordionBox', AverageSpeedAccordionBox );
} );