// Copyright 2018-2019, University of Colorado Boulder

/**
 * Control for changing for number of particles for a specific type of particle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const FineCoarseSpinner = require( 'SCENERY_PHET/FineCoarseSpinner' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // const
  const X_SPACING = 8;

  class ParticleCountControl extends VBox {

    /**
     * @param {Node} icon
     * @param {string} title
     * @param {NumberProperty} numberOfParticlesProperty
     * @param {Object} [options]
     */
    constructor( icon, title, numberOfParticlesProperty, options ) {

      options = _.extend( {
        align: 'left',
        spacing: 10
      }, options );

      assert && assert( numberOfParticlesProperty instanceof NumberProperty,
        'invalid numberOfParticlesProperty: ' + numberOfParticlesProperty );
      assert && assert( numberOfParticlesProperty.range,
        'numberOfParticlesProperty missing range' );

      const titleNode = new Text( title, {
        font: GasPropertiesConstants.CONTROL_FONT,
        fill: GasPropertiesColorProfile.titleTextFillProperty
      } );

      const titleBox = new HBox( {
        spacing: X_SPACING,
        children: [ icon, titleNode ]
      } );

      const spinner = new FineCoarseSpinner( numberOfParticlesProperty, {
        deltaFine: 1,
        deltaCoarse: 50,
        numberDisplayOptions: {
          font: new PhetFont( 18 )
        }
      } );

      // Limit width of text
      titleNode.maxWidth = spinner.width - icon.width - X_SPACING;

      assert && assert( !options.hasOwnProperty( 'children' ), 'ParticleCountControl sets children' );
      options = _.extend( {
        children: [ titleBox, spinner ]
      }, options );

      super( options );
    }
  }

  return gasProperties.register( 'ParticleCountControl', ParticleCountControl );
} );