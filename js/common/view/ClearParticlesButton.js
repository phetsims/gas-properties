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
  const EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  const Property = require( 'AXON/Property' );

  class ClearParticlesButton extends EraserButton {

    /**
     * @param {NumberProperty[]} numberProperties
     * @param {Object} [options]
     */
    constructor( numberProperties, options ) {
      assert && assert( Array.isArray( numberProperties ), `invalid numberProperties: ${numberProperties}` );

      options = options || {};

      assert && assert( !options.listener, 'ClearParticlesButton sets listener' );
      options = _.extend( {
        listener: () => {
          for ( let i = 0; i < numberProperties.length; i++ ) {
            numberProperties[ i ].value = 0;
          }
        }
      }, options );

      super( options );
      
      // Enables the button if any of numberProperties is non-zero.
      Property.multilink( numberProperties, () => {
         this.enabled = !!_.find( numberProperties, numberProperty => numberProperty.value !== 0 );
      } );
    }
  }

  return gasProperties.register( 'ClearParticlesButton', ClearParticlesButton );
} );