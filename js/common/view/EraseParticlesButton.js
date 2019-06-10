// Copyright 2019, University of Colorado Boulder

/**
 * Button for erasing (deleting) all particles from the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  const Property = require( 'AXON/Property' );
  const NumberProperty = require( 'AXON/NumberProperty' );

  class EraseParticlesButton extends EraserButton {

    /**
     * @param {Property.<number>} numberOfParticlesProperty
     * @param {NumberProperty} numberOfHeavyParticlesProperty
     * @param {NumberProperty} numberOfLightParticlesProperty
     * @param {Object} [options]
     */
    constructor( numberOfParticlesProperty, numberOfHeavyParticlesProperty, numberOfLightParticlesProperty, options ) {
      assert && assert( numberOfParticlesProperty instanceof Property,
        `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );
      assert && assert( numberOfHeavyParticlesProperty instanceof NumberProperty,
        `invalid numberOfHeavyParticlesProperty: ${numberOfHeavyParticlesProperty}` );
      assert && assert( numberOfLightParticlesProperty instanceof NumberProperty,
        `invalid numberOfLightParticlesProperty: ${numberOfLightParticlesProperty}` );

      options = _.extend( {

        // superclass options
        baseColor: GasPropertiesColorProfile.eraserButtonColorProperty
      }, options );

      // Deletes all particles when the button fires.
      assert && assert( !options.listener, 'EraseParticlesButton sets listener' );
      options.listener = () => {
        numberOfHeavyParticlesProperty.value = 0;
        numberOfLightParticlesProperty.value = 0;
      };

      super( options );

      // Disables the button when the container is empty.
      numberOfParticlesProperty.link( numberOfParticles => {
        this.enabled = ( numberOfParticles !== 0 );
      } );
    }
  }

  return gasProperties.register( 'EraseParticlesButton', EraseParticlesButton );
} );