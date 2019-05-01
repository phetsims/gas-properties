// Copyright 2019, University of Colorado Boulder

/**
 * One side of the display in the 'Data' accordion box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const Range = require( 'DOT/Range' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const tAvgString = require( 'string!GAS_PROPERTIES/tAvg' );
  const tAvgKString = require( 'string!GAS_PROPERTIES/tAvgK' );

  // constants
  const PARTICLE_COUNT_RANGE = new Range( 0, 1000 );
  const AVERAGE_TEMPERATURE_RANGE = new Range( 0, 1000 );

  class DataNode extends VBox {

    /**
     * @param {ModelViewTransform2} modelViewTransform
     * @param {NumberProperty} numberOfParticles1Property
     * @param {NumberProperty} numberOfParticles2Property
     * @param {NumberProperty} averageTemperatureProperty
     * @param {Object} [options]
     */
    constructor( modelViewTransform, numberOfParticles1Property, numberOfParticles2Property, averageTemperatureProperty, options ) {

      options = _.extend( {
        spacing: 10,
        align: 'left'
      }, options );

      const numberDisplayOptions = {
        align: 'right',
        numberFill: GasPropertiesColorProfile.textFillProperty,
        font: GasPropertiesConstants.CONTROL_FONT,
        backgroundFill: null,
        backgroundStroke: null,
        xMargin: 0,
        yMargin: 0
      };

      const particle1CountNode = new HBox( {
        spacing: 3,
        children: [
          GasPropertiesIconFactory.createDiffusionParticle1Icon( modelViewTransform ),
          new NumberDisplay( numberOfParticles1Property, PARTICLE_COUNT_RANGE, numberDisplayOptions )
        ]
      } );

      const particle2CountNode = new HBox( {
        spacing: 3,
        children: [
          GasPropertiesIconFactory.createDiffusionParticle2Icon( modelViewTransform ),
          new NumberDisplay( numberOfParticles2Property, PARTICLE_COUNT_RANGE, numberDisplayOptions )
        ]
      } );

      const averageTemperatureNode = new NumberDisplay( averageTemperatureProperty, AVERAGE_TEMPERATURE_RANGE,
        _.extend( {}, numberDisplayOptions, {
          align: 'left',
          valuePattern: tAvgKString,
          noValuePattern: tAvgString,
          useRichText: true,
          maxWidth: 100 // determined empirically
      } ) );

      assert && assert( !options.children, 'DataNode sets children' );
      options = _.extend( {
        children: [ particle1CountNode, particle2CountNode, averageTemperatureNode ]
      }, options );

      super( options );
    }
  }

  return gasProperties.register( 'DataNode', DataNode );
} );