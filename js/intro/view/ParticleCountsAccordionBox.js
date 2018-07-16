// Copyright 2018, University of Colorado Boulder

/**
 * The accordion box titled 'Particle Counts'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  var GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var particleCountsString = require( 'string!GAS_PROPERTIES/particleCounts' );
  var heavyString = require( 'string!GAS_PROPERTIES/heavy' );
  var lightString = require( 'string!GAS_PROPERTIES/light' );

  /**
   * @param {NumberProperty} numberOfHeavyParticlesProperty
   * @param {NumberProperty} numberOfLightParticlesProperty
   * @param {Object} [options]
   * @constructor
   */
  function ParticleCountsAccordionBox( numberOfHeavyParticlesProperty, numberOfLightParticlesProperty, options ) {

    options = _.extend( {

      // AccordionBox options
      titleNode: new Text( particleCountsString, {
        font: GasPropertiesConstants.TITLE_FONT,
        fill: GasPropertiesColors.FOREGROUND_COLOR
      } ),
      titleAlignX: 'left',
      buttonLength: 20,
      fill: GasPropertiesColors.BACKGROUND_COLOR,
      stroke: GasPropertiesColors.FOREGROUND_COLOR

    }, options );

    var numberControlOptions = {
      titleFont: new PhetFont( 20 ),
      titleFill: 'white',
      valueFont: new PhetFont( 20 ),
      majorTickStroke: GasPropertiesColors.FOREGROUND_COLOR,
      layoutFunction: NumberControl.createLayoutFunction4()
    };

    var majorTickOptions = {
      font: new PhetFont( 16 ),
      fill: GasPropertiesColors.FOREGROUND_COLOR
    };

    var heavyControl = new NumberControl( heavyString,
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

    var lightControl = new NumberControl( lightString,
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
      } ));

    var content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [ heavyControl, lightControl ]
    } );

    AccordionBox.call( this, content, options );
  }

  gasProperties.register( 'ParticleCountsAccordionBox', ParticleCountsAccordionBox );

  return inherit( AccordionBox, ParticleCountsAccordionBox );
} );
 