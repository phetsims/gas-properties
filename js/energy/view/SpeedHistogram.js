// Copyright 2019, University of Colorado Boulder

//TODO flesh out
/**
 * Speed histogram, shows the distribution of the speeds of the particles in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const speedString = require( 'string!GAS_PROPERTIES/speed' );

  // constants
  const AXIS_LABEL_OPTIONS = {
    fill: GasPropertiesColorProfile.titleTextFillProperty,
    font: GasPropertiesConstants.AXIS_LABEL_FONT
  };

  class SpeedHistogram extends Node {

    /**
     * @param {IdealModel} model
     * @param {BooleanProperty} heavyVisibleProperty
     * @param {BooleanProperty} lightVisibleProperty
     * @param {Object} [options]
     */
    constructor( model, heavyVisibleProperty, lightVisibleProperty, options ) {

      options = _.extend( {
        //TODO
      }, options );

      const rectangle = new Rectangle( 0, 0, 150, 130, {
        fill: 'black',
        stroke: 'white',
        lineWidth: 1
      } );
      
      const xAxisLabel = new Text( speedString, _.extend( {}, AXIS_LABEL_OPTIONS, {
        maxWidth: 0.75 * rectangle.width,
        centerX: rectangle.centerX,
        top: rectangle.bottom + 5
      } ) );

      const yAxisLabel = new Text( numberOfParticlesString, _.extend( {}, AXIS_LABEL_OPTIONS, {
        rotation: -Math.PI / 2,
        maxWidth: rectangle.height,
        right: rectangle.left - 8,
        centerY: rectangle.centerY
      } ) );

      assert && assert( !options.hasOwnProperty( 'children' ), 'SpeedHistogram sets children' );
      options = _.extend( {
        children: [ rectangle, xAxisLabel, yAxisLabel ]
      }, options );

      super( options );
    }
  }

  return gasProperties.register( 'SpeedHistogram', SpeedHistogram );
} );