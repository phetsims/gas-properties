// Copyright 2018-2019, University of Colorado Boulder

/**
 * The accordion box titled 'Particle Counts'.
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
  const ParticleCountControl = require( 'GAS_PROPERTIES/common/view/ParticleCountControl' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const heavyString = require( 'string!GAS_PROPERTIES/heavy' );
  const lightString = require( 'string!GAS_PROPERTIES/light' );
  const particleCountsString = require( 'string!GAS_PROPERTIES/particleCounts' );

  class ParticleCountsAccordionBox extends AccordionBox {

    /**
     * @param {NumberProperty} numberOfHeavyParticlesProperty
     * @param {NumberProperty} numberOfLightParticlesProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( numberOfHeavyParticlesProperty, numberOfLightParticlesProperty, modelViewTransform, options ) {

      options = _.extend( {}, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, {

        fixedWidth: 100,

        // AccordionBox options
        titleNode: new Text( particleCountsString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } )
      }, options );

      // Limit width of title
      options.titleNode.maxWidth = 0.75 * options.fixedWidth;

      const vBox = new VBox( {
        align: 'left',
        spacing: 15,
        children: [

          // Heavy
          new ParticleCountControl( GasPropertiesIconFactory.createHeavyParticleIcon( modelViewTransform),
            heavyString, numberOfHeavyParticlesProperty ),

          // Light
          new ParticleCountControl( GasPropertiesIconFactory.createLightParticleIcon( modelViewTransform ),
            lightString, numberOfLightParticlesProperty )
        ]
      } );

      const content = new FixedWidthNode( vBox, {
        fixedWidth: options.fixedWidth - ( 2 * options.contentXMargin )
      } );

      super( content, options );
    }
  }

  return gasProperties.register( 'ParticleCountsAccordionBox', ParticleCountsAccordionBox );
} );
 