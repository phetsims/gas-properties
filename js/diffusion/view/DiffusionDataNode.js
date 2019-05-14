// Copyright 2019, University of Colorado Boulder

/**
 * Display for one side of the container in the 'Data' accordion box.
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

  class DiffusionDataNode extends VBox {

    /**
     * @param {DiffusionData} data
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     */
    constructor( data, modelViewTransform, options ) {

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

      // number of DiffusionParticle1
      const particle1CountNode = new HBox( {
        spacing: 3,
        children: [
          GasPropertiesIconFactory.createDiffusionParticle1Icon( modelViewTransform ),
          new NumberDisplay( data.numberOfParticles1Property, PARTICLE_COUNT_RANGE, numberDisplayOptions )
        ]
      } );

      // number of DiffusionParticle2
      const particle2CountNode = new HBox( {
        spacing: 3,
        children: [
          GasPropertiesIconFactory.createDiffusionParticle2Icon( modelViewTransform ),
          new NumberDisplay( data.numberOfParticles2Property, PARTICLE_COUNT_RANGE, numberDisplayOptions )
        ]
      } );

      const averageTemperatureNode = new NumberDisplay( data.averageTemperatureProperty, AVERAGE_TEMPERATURE_RANGE,
        _.extend( {}, numberDisplayOptions, {
          align: 'left',
          valuePattern: tAvgKString,
          noValuePattern: tAvgString,
          useRichText: true,
          maxWidth: 100 // determined empirically
        } ) );

      assert && assert( !options.children, 'DiffusionDataNode sets children' );
      options = _.extend( {
        children: [ particle1CountNode, particle2CountNode, averageTemperatureNode ]
      }, options );

      super( options );
    }
  }

  return gasProperties.register( 'DiffusionDataNode', DiffusionDataNode );
} );