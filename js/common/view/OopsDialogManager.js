// Copyright 2019, University of Colorado Boulder

/**
 * Manages the set of 'Oops!' dialogs that are related to the 'Hold Constant' feature.
 * When holding a quantity constant would break the model, the model puts itself in a sane configurations,
 * the model notifies the view via an Emitter, and the view notifies the user via a dialog.
 * Dialogs are created on demand, then cached for reuse.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const OopsDialog = require( 'SCENERY_PHET/OopsDialog' );

  // string
  const oopsTemperatureWithEmptyContainerString = require( 'string!GAS_PROPERTIES/oopsTemperatureWithEmptyContainer' );
  const oopsPressureWithEmptyContainerString = require( 'string!GAS_PROPERTIES/oopsPressureWithEmptyContainer' );
  const oopsPressureWithLargeVolumeString = require( 'string!GAS_PROPERTIES/oopsPressureWithLargeVolume' );
  const oopsPressureWithSmallVolumeString = require( 'string!GAS_PROPERTIES/oopsPressureWithSmallVolume' );

  class OopsDialogManager {

    /**
     * @param {Object} oops - see GasPropertiesModel this.oops
     */
    constructor( oops ) {

      // @private dialogs are cached in a map, with {string} key and {OopsDialog} value
      this.dialogCache = {};

      // Oops! Temperature cannot be held constant when the container is empty.
      oops.temperatureWithEmptyContainerEmitter.addListener( () => {
        this.showDialog( oopsTemperatureWithEmptyContainerString );
      } );

      // Oops! Pressure cannot be held constant when the container is empty.
      oops.pressureWithEmptyContainerEmitter.addListener( () => {
        this.showDialog( oopsPressureWithEmptyContainerString );
      } );

      // Oops! Pressure cannot be held constant. Volume would be too large.
      oops.pressureWithLargeVolumeEmitter.addListener( () => {
        this.showDialog( oopsPressureWithLargeVolumeString );
      } );

      // Oops! Pressure cannot be held constant. Volume would be too small.
      oops.pressureWithSmallVolumeEmitter.addListener( () => {
        this.showDialog( oopsPressureWithSmallVolumeString );
      } );
    }

    /**
     * Shows a dialog for the specified message.
     * If a dialog has not previously been shown for the message, a dialog is created and added to the cache.
     * @param {string} message
     * @private
     */
    showDialog( message ) {
      assert && assert( typeof message === 'string', `invalid message: ${message}` );

      let dialog = this.dialogCache[ message ];
      if ( !dialog ) {
        dialog = new OopsDialog( message, GasPropertiesConstants.OOPS_DIALOG_OPTIONS );
        this.dialogCache[ message ] = dialog;
      }
      dialog.show();
    }
  }

  return gasProperties.register( 'OopsDialogManager', OopsDialogManager );
} ); 