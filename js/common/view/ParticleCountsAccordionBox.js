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
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Node = require( 'SCENERY/nodes/Node' );
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

      options = _.extend( {

        fixedWidth: 250,

        // AccordionBox options
        buttonXMargin: 0,
        titleXSpacing: 0,
        contentXMargin: 0,
        titleNode: new Text( particleCountsString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } )
      }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, options );

      // Limit width of title
      options.titleNode.maxWidth = options.fixedWidth - options.buttonXMargin - options.titleXSpacing;

      // force the accordion box to be a fixedWidth
      assert && assert( !options.hasOwnProperty( 'maxWidth' ), 'ParticleCountsAccordionBox sets maxWidth' );
      options = _.extend( {
        maxWidth: options.fixedWidth
      }, options );
      const maxContentWidth = options.fixedWidth - ( 2 * options.contentXMargin );
      const strut = new HStrut( maxContentWidth );

      const content = new VBox( {
        maxWidth: maxContentWidth,
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

      super( new Node( { children: [ strut, content ] } ), options );
    }
  }

  return gasProperties.register( 'ParticleCountsAccordionBox', ParticleCountsAccordionBox );
} );
 