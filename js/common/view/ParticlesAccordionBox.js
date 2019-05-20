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
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const NumberOfParticlesControl = require( 'GAS_PROPERTIES/common/view/NumberOfParticlesControl' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
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

      options = _.extend( {
        fixedWidth: 100,
        contentXMargin: 0
      }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        // AccordionBox options
        titleNode: new Text( particlesString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } )
      }, options );

      // Limit width of title
      options.titleNode.maxWidth = 0.75 * options.fixedWidth;

      const contentWidth = options.fixedWidth - ( 2 * options.contentXMargin );

      const content = new FixedWidthNode( contentWidth, new VBox( {
        align: 'left',
        spacing: 15,
        children: [

          // Heavy
          new NumberOfParticlesControl( GasPropertiesIconFactory.createHeavyParticleIcon( modelViewTransform ),
            heavyString, numberOfHeavyParticlesProperty ),

          // Light
          new NumberOfParticlesControl( GasPropertiesIconFactory.createLightParticleIcon( modelViewTransform ),
            lightString, numberOfLightParticlesProperty )
        ]
      } ) );

      super( content, options );
    }
  }

  return gasProperties.register( 'ParticlesAccordionBox', ParticlesAccordionBox );
} );
 