// Copyright 2019, University of Colorado Boulder

/**
 * Button for clearing all particles from the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );

  class ClearParticlesButton extends EraserButton {

    /**
     * @param {NumberProperty} totalNumberOfParticlesProperty
     * @param {Object} [options]
     */
    constructor( totalNumberOfParticlesProperty, options ) {

      options = _.extend( {
        baseColor: GasPropertiesColorProfile.eraserButtonColorProperty
      }, options );

      super( options );
      
      // Disables the button when the container is empty.
      totalNumberOfParticlesProperty.link( totalNumberOfParticles => {
        this.enabled = ( totalNumberOfParticles !== 0 );
      } );
    }
  }

  return gasProperties.register( 'ClearParticlesButton', ClearParticlesButton );
} );