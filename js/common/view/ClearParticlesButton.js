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
  const Property = require( 'AXON/Property' );

  class ClearParticlesButton extends EraserButton {

    /**
     * @param {Property.<number>>} totalNumberOfParticlesProperty
     * @param {Object} [options]
     */
    constructor( totalNumberOfParticlesProperty, options ) {
      assert && assert( totalNumberOfParticlesProperty instanceof Property,
        `invalid totalNumberOfParticlesProperty: ${totalNumberOfParticlesProperty}` );

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