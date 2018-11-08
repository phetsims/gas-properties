// Copyright 2018, University of Colorado Boulder

/**
 * The accordion box titled 'Particle Counts'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
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
          fill: GasPropertiesColors.FOREGROUND_COLOR
        } ),
        titleAlignX: 'left',
        buttonLength: 20,
        fill: GasPropertiesColors.BACKGROUND_COLOR,
        stroke: GasPropertiesColors.FOREGROUND_COLOR

      }, options );

      assert && assert( options.maxWidth === undefined, 'ParticleCountsAccordionBox sets maxWidth' );
      options.maxWidth = options.fixedWidth;

      const numberControlOptions = {
        titleFont: new PhetFont( 20 ),
        titleFill: 'white',
        valueFont: new PhetFont( 20 ),
        majorTickStroke: GasPropertiesColors.FOREGROUND_COLOR,
        layoutFunction: NumberControl.createLayoutFunction4(),
        trackSize: new Dimension2( 130, 3 )
      };

      const majorTickOptions = {
        font: new PhetFont( 16 ),
        fill: GasPropertiesColors.FOREGROUND_COLOR
      };

      const heavyControl = new NumberControl( heavyString,
        numberOfHeavyParticlesProperty, numberOfHeavyParticlesProperty.range,
        _.extend( {}, numberControlOptions, {
          titleFill: GasPropertiesColors.HEAVY_PARTICLE,
          thumbFillEnabled: GasPropertiesColors.HEAVY_PARTICLE,
          majorTicks: [
            {
              value: numberOfHeavyParticlesProperty.range.min,
              label: new Text( numberOfHeavyParticlesProperty.range.min, majorTickOptions )
            },
            {
              value: numberOfHeavyParticlesProperty.range.max,
              label: new Text( numberOfHeavyParticlesProperty.range.max, majorTickOptions )
            }
          ],
          constrainValue: function( value ) {
            // constrain to multiples of a specific interval
            return Util.roundToInterval( value, GasPropertiesConstants.HEAVY_PARTICLES_THUMB_INTERVAL );
          }
        } ) );

      const lightControl = new NumberControl( lightString,
        numberOfLightParticlesProperty, numberOfLightParticlesProperty.range,
        _.extend( {}, numberControlOptions, {
          titleFill: GasPropertiesColors.LIGHT_PARTICLE,
          thumbFillEnabled: GasPropertiesColors.LIGHT_PARTICLE,
          majorTicks: [
            {
              value: numberOfLightParticlesProperty.range.min,
              label: new Text( numberOfLightParticlesProperty.range.min, majorTickOptions )
            },
            {
              value: numberOfLightParticlesProperty.range.max,
              label: new Text( numberOfLightParticlesProperty.range.max, majorTickOptions )
            }
          ],
          constrainValue: function( value ) {
            // constrain to multiples of a specific interval
            return Util.roundToInterval( value, GasPropertiesConstants.LIGHT_PARTICLES_THUMB_INTERVAL );
          }
        } ) );

      const content = new VBox( {
        align: 'left',
        spacing: 10,
        children: [ heavyControl, lightControl ]
      } );

      const strut = new HStrut( options.fixedWidth - ( 2 * options.contentXMargin ) );

      super( new Node( { children: [ strut, content ] } ), options );
    }
  }

  return gasProperties.register( 'ParticleCountsAccordionBox', ParticleCountsAccordionBox );
} );
 