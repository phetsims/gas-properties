// Copyright 2019, University of Colorado Boulder

/**
 * Kinetic Energy histogram, shows the distribution of kinetic energy of the particles in the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const numberOfParticlesString = require( 'string!GAS_PROPERTIES/numberOfParticles' );
  const kineticEnergyString = require( 'string!GAS_PROPERTIES/kineticEnergy' );

  // constants
  const AXIS_LABEL_OPTIONS = {
    fill: GasPropertiesColorProfile.titleTextFillProperty,
    font: new PhetFont( 14 )
  };

  class KineticEnergyHistogram extends Node {

    /**
     * @param {IdealModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = _.extend( {
        //TODO
      }, options );

      const rectangle = new Rectangle( 0, 0, 120, 130, {
        fill: 'black',
        stroke: 'white',
        lineWidth: 1
      } );
      
      const xAxisLabel = new Text( kineticEnergyString, _.extend( {}, AXIS_LABEL_OPTIONS, {
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

      assert && assert( !options.hasOwnProperty( 'children' ), 'KineticEnergyHistogram sets children' );
      options = _.extend( {
        children: [ rectangle, xAxisLabel, yAxisLabel ]
      }, options );

      super( options );
    }
  }

  return gasProperties.register( 'KineticEnergyHistogram', KineticEnergyHistogram );
} );