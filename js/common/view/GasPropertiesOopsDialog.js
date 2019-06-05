// Copyright 2019, University of Colorado Boulder

/**
 * Specialization of OopsDialog for this sim, with a custom icon and options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const Image = require( 'SCENERY/nodes/Image' );
  const OopsDialog = require( 'SCENERY_PHET/OopsDialog' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // images
  const phetGirlLabCoatImage = require( 'image!GAS_PROPERTIES/phet-girl-lab-coat.png' );

  class GasPropertiesOopsDialog extends OopsDialog {

    /**
     * @param {string} message
     * @param {Object} [options]
     */
    constructor( message, options ) {

      options = _.extend( {
        iconNode: new Image( phetGirlLabCoatImage, {
          maxHeight: 132 // determined empirically
        } ),
        richTextOptions: {
          font: new PhetFont( 16 )
        }
      }, options );

      super( message, options );
    }
  }

  return gasProperties.register( 'GasPropertiesOopsDialog', GasPropertiesOopsDialog );
} );