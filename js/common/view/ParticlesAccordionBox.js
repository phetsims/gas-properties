// Copyright 2018-2019, University of Colorado Boulder

/**
 * The accordion box titled 'Particles'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const FixedWidthNode = require( 'GAS_PROPERTIES/common/view/FixedWidthNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const NumberOfParticlesControl = require( 'GAS_PROPERTIES/common/view/NumberOfParticlesControl' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const collisionsString = require( 'string!GAS_PROPERTIES/collisions' );
  const heavyString = require( 'string!GAS_PROPERTIES/heavy' );
  const lightString = require( 'string!GAS_PROPERTIES/light' );
  const particlesString = require( 'string!GAS_PROPERTIES/particles' );

  class ParticlesAccordionBox extends AccordionBox {

    /**
     * @param {NumberProperty} numberOfHeavyParticlesProperty
     * @param {NumberProperty} numberOfLightParticlesProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( numberOfHeavyParticlesProperty, numberOfLightParticlesProperty, modelViewTransform, options ) {
      assert && assert( numberOfHeavyParticlesProperty instanceof NumberProperty,
        `invalid numberOfHeavyParticlesProperty: ${numberOfHeavyParticlesProperty}` );
      assert && assert( numberOfLightParticlesProperty instanceof NumberProperty,
        `invalid numberOfLightParticlesProperty: ${numberOfLightParticlesProperty}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );

      options = _.extend( {
        fixedWidth: 100,
        contentXMargin: 0,
        collisionsEnabledProperty: null // {null|BooleanProperty} no checkbox if null
      }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        // superclass options
        titleNode: new Text( particlesString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } )
      }, options );

      // Limit width of title
      options.titleNode.maxWidth = 0.75 * options.fixedWidth;

      const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

      const children = [

        // Heavy
        new NumberOfParticlesControl( GasPropertiesIconFactory.createHeavyParticleIcon( modelViewTransform ),
          heavyString, numberOfHeavyParticlesProperty ),

        // Light
        new NumberOfParticlesControl( GasPropertiesIconFactory.createLightParticleIcon( modelViewTransform ),
          lightString, numberOfLightParticlesProperty )
      ];

      if ( options.collisionsEnabledProperty ) {

        // optional Collisions checkbox, prepended so that it appears at top
        children.unshift( new GasPropertiesCheckbox( options.collisionsEnabledProperty, {
          text: collisionsString,
          textMaxWidth: 175 // determined empirically
        } ) );
      }

      const content = new FixedWidthNode( contentWidth, new VBox( {
        align: 'left',
        spacing: 15,
        children: children
      } ) );

      super( content, options );
    }
  }

  return gasProperties.register( 'ParticlesAccordionBox', ParticlesAccordionBox );
} );