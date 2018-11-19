// Copyright 2018, University of Colorado Boulder

/**
 * Control for changing for number of particles for a specific type of particle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const NumberSpinner = require( 'SUN/NumberSpinner' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const Property = require( 'AXON/Property' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const MULTIPLIER = 2;

  class ParticleCountControl extends VBox {

    /**
     * @param {string} title
     * @param {Node} icon
     * @param {NumberProperty} numberOfParticlesProperty
     * @param {Object} [options]
     */
    constructor( title, icon, numberOfParticlesProperty, options ) {

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
        fill: GasPropertiesColorProfile.textFillProperty
      } );

      const titleBox = new HBox( {
        spacing: 8,
        children: [ titleNode, icon ]
      } );

      const spinner = new NumberSpinner( numberOfParticlesProperty, new Property( numberOfParticlesProperty.range ), {
        valueAlign: 'right',
        font: GasPropertiesConstants.SPINNER_FONT,
        cornerRadius: 4
      } );

      const multiplierButton = new RectangularPushButton( {
        content: new Text( MathSymbols.TIMES + MULTIPLIER, {
          font: GasPropertiesConstants.CONTROL_FONT
        } ),
        baseColor: PhetColorScheme.BUTTON_YELLOW,
        listener: () => {
          numberOfParticlesProperty.value = numberOfParticlesProperty.value * MULTIPLIER;
        }
      } );

      const controlBox = new HBox( {
        spacing: 15,
        children: [ new HStrut( 25 ), spinner, new HStrut( 20 ), multiplierButton ]
      } );

      assert && assert( !options.children, 'ParticleCountControl sets children' );
      options.children = [ titleBox, controlBox ];

      super( options );

      // disable the multiplier button when pressing it would exceed range
      numberOfParticlesProperty.link( numberOfParticles => {
        multiplierButton.enabled = ( numberOfParticles > 0 ) &&
                                   ( numberOfParticles * MULTIPLIER <= numberOfParticlesProperty.range.max );
      } );
    }
  }

  return gasProperties.register( 'ParticleCountControl', ParticleCountControl );
} );