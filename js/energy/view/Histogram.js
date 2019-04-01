// Copyright 2019, University of Colorado Boulder

//TODO flesh out
/**
 * Base class for histograms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RichText = require( 'SCENERY/nodes/RichText' );

  class Histogram extends Node {

    /**
     * @param {IdealModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = _.extend( {

        size: new Dimension2( 150, 130 ),

        // options for the Rectangle that is the histogram background
        backgroundRectangleOptions: {
          fill: 'black',
          stroke: 'white',
          lineWidth: 1
        },

        //TODO should these be {Node}?
        xAxisString: '',
        yAxisString: '',

        // options for the RichText nodes that label the axes
        axisTextOptions: {
          fill: GasPropertiesColorProfile.textFillProperty,
          font: GasPropertiesConstants.AXIS_LABEL_FONT
        }
      }, options );

      const backgroundRectangle = new Rectangle( 0, 0, options.size.width, options.size.height,
        options.backgroundRectangleOptions );

      const xAxisText = new RichText( options.xAxisString, _.extend( {}, options.axisTextOptions, {
        maxWidth: backgroundRectangle.width,
        centerX: backgroundRectangle.centerX,
        top: backgroundRectangle.bottom + 5
      } ) );

      const yAxisText = new RichText( options.yAxisString, _.extend( {}, options.axisTextOptions, {
        rotation: -Math.PI / 2,
        maxWidth: backgroundRectangle.height,
        right: backgroundRectangle.left - 8,
        centerY: backgroundRectangle.centerY
      } ) );

      assert && assert( !options.hasOwnProperty( 'children' ), 'Histogram sets children' );
      options = _.extend( {
        children: [ backgroundRectangle, xAxisText, yAxisText ]
      }, options );

      super( options );
    }
  }

  return gasProperties.register( 'Histogram', Histogram );
} );