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
     * @param {Property.<number>} totalNumberOfParticlesProperty
     * @param {NumberProperty} numberOfHeavyParticlesProperty
     * @param {NumberProperty} numberOfLightParticlesProperty
     * @param {Object} [options]
     */
    constructor( totalNumberOfParticlesProperty, numberOfHeavyParticlesProperty, numberOfLightParticlesProperty, options ) {
      assert && assert( totalNumberOfParticlesProperty instanceof Property,
        `invalid totalNumberOfParticlesProperty: ${totalNumberOfParticlesProperty}` );
      assert && assert( numberOfHeavyParticlesProperty instanceof NumberProperty,
             `invalid numberOfHeavyParticlesProperty: ${numberOfHeavyParticlesProperty}` );
      assert && assert( numberOfLightParticlesProperty instanceof NumberProperty,
                 `invalid numberOfLightParticlesProperty: ${numberOfLightParticlesProperty}` );

      options = _.extend( {
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
      totalNumberOfParticlesProperty.link( totalNumberOfParticles => {
        this.enabled = ( totalNumberOfParticles !== 0 );
      } );
    }
  }

  return gasProperties.register( 'EraseParticlesButton', EraseParticlesButton );
} );