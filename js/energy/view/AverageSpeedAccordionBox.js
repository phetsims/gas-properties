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
  const AccordionBox2 = require( 'SUN/AccordionBox2' );
  const FixedWidthNode = require( 'GAS_PROPERTIES/common/view/FixedWidthNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const SunConstants = require( 'SUN/SunConstants' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const averageSpeedString = require( 'string!GAS_PROPERTIES/averageSpeed' );
  const valueMetersPerSecondString = require( 'string!GAS_PROPERTIES/valueMetersPerSecond' );

  class AverageSpeedAccordionBox extends AccordionBox {

    /**
     * @param {NumberProperty} heavyAverageSpeedProperty - average speed of heavy particles, in nm/ps
     * @param {NumberProperty} lightAverageSpeedProperty - average speed of light particles, in nm/ps
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( heavyAverageSpeedProperty, lightAverageSpeedProperty, modelViewTransform, options ) {

      options = _.extend( {

        fixedWidth: 100,

        // AccordionBox options
        buttonXMargin: 0,
        titleXSpacing: 0,
        contentXMargin: 0,
        contentYSpacing: 4,
        titleNode: new Text( averageSpeedString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } )

      }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, options );

      // Limit width of title
      options.titleNode.maxWidth = options.fixedWidth - options.buttonXMargin - options.titleXSpacing;

      // icons for the particles
      const heavyParticleNode = GasPropertiesIconFactory.createHeavyParticleIcon( modelViewTransform );
      const lightParticleNode = GasPropertiesIconFactory.createLightParticleIcon( modelViewTransform );

      // add a horizontal strut so that icons have the same effective width
      const maxWidth = Math.max( heavyParticleNode.width, lightParticleNode.width );
      heavyParticleNode.addChild( new HStrut( maxWidth, { center: heavyParticleNode.center } ) );
      lightParticleNode.addChild( new HStrut( maxWidth, { center: lightParticleNode.center } ) );

      // Adapter Properties, in m/s
      const heavyMetersPerSecondProperty = new Property( null );
      const lightMetersPerSecondProperty = new Property( null );

      const numberDisplayRange = new Range( 0, 9999 );
      const numberDisplayOptions = {
        valuePattern: valueMetersPerSecondString,
        noValuePattern: SunConstants.VALUE_NAMED_PLACEHOLDER,
        decimalPlaces: 0,
        align: 'right',
        noValueAlign: 'left',
        font: new PhetFont( 16 ),
        numberFill: GasPropertiesColorProfile.textFillProperty,
        backgroundFill: null,
        backgroundStroke: null
      };

      const heavyNumberDisplay = new NumberDisplay( heavyMetersPerSecondProperty, numberDisplayRange, numberDisplayOptions );
      const lightNumberDisplay = new NumberDisplay( lightMetersPerSecondProperty, numberDisplayRange, numberDisplayOptions );

      // layout icons and NumberDisplays in a grid
      const vBox = new VBox( {
        align: 'left',
        children: [
          new HBox( { children: [ heavyParticleNode, heavyNumberDisplay ] } ),
          new HBox( { children: [ lightParticleNode, lightNumberDisplay ] } )
        ]
      } );

      const content = new FixedWidthNode( vBox, {
        fixedWidth: options.fixedWidth - ( 2 * options.contentXMargin ),
        align: 'center'
      } );

      super( content, options );

      // Update only when visible.
      Property.multilink(
        [ this.expandedProperty, heavyAverageSpeedProperty ],
        ( expanded, heavyAverageSpeed ) => {
          if ( expanded ) {
            heavyMetersPerSecondProperty.value = convertAverageSpeed( heavyAverageSpeed );
          }
        } );
      Property.multilink(
        [ this.expandedProperty, lightAverageSpeedProperty ],
        ( expanded, lightAverageSpeed ) => {
          if ( expanded ) {
            lightMetersPerSecondProperty.value = convertAverageSpeed( lightAverageSpeed );
          }
        } );
    }
  }

  /**
   * Converts from nm/ps to m/s.
   * @param {number|null} averageSpeed - in nm/ps
   * @returns {number|null}
   */
  const convertAverageSpeed = ( averageSpeed ) => {
    if ( typeof averageSpeed === 'number' ) {
      return 1000 * averageSpeed;
    }
    else {
      return null;
    }
  };

  return gasProperties.register( 'AverageSpeedAccordionBox', AverageSpeedAccordionBox );
} );