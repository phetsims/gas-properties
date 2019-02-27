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
     * @param {Object} [options]
     */
    constructor( numberOfHeavyParticlesProperty, numberOfLightParticlesProperty, options ) {

      options = _.extend( {

        fixedWidth: 250,

        // AccordionBox options
        contentXMargin: GasPropertiesConstants.PANEL_X_MARGIN,
        contentYMargin: GasPropertiesConstants.PANEL_Y_MARGIN,
        buttonXMargin: 10,
        buttonYMargin: 10,
        titleXSpacing: 10,
        cornerRadius: GasPropertiesConstants.PANEL_CORNER_RADIUS,
        titleNode: new Text( particleCountsString, {
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.titleTextFillProperty
        } ),
        titleAlignX: 'left',
        buttonLength: 20,
        fill: GasPropertiesColorProfile.panelFillProperty,
        stroke: GasPropertiesColorProfile.panelStrokeProperty

      }, options );

      // Limit width of title
      options.titleNode.maxWidth = options.fixedWidth - options.buttonXMargin - options.titleXSpacing;

      // force the accordion box to be a fixedWidth
      assert && assert( options.maxWidth === undefined, 'ParticleCountsAccordionBox sets maxWidth' );
      options.maxWidth = options.fixedWidth;
      const maxContentWidth = options.fixedWidth - ( 2 * options.contentXMargin );
      const strut = new HStrut( maxContentWidth );

      const content = new VBox( {
        maxWidth: maxContentWidth,
        align: 'left',
        spacing: 15,
        children: [

          // Heavy
          new ParticleCountControl( GasPropertiesIconFactory.createHeavyParticleIcon(), heavyString, numberOfHeavyParticlesProperty ),

          // Light
          new ParticleCountControl( GasPropertiesIconFactory.createLightParticleIcon(), lightString, numberOfLightParticlesProperty )
        ]
      } );

      super( new Node( { children: [ strut, content ] } ), options );
    }
  }

  return gasProperties.register( 'ParticleCountsAccordionBox', ParticleCountsAccordionBox );
} );
 