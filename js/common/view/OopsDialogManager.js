// Copyright 2019, University of Colorado Boulder

/**
 * Manages the set of 'Oops!' dialogs that are related to the 'Hold Constant' feature.
 * When holding a quantity constant would break the model, the model puts itself in a sane configuration,
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
  const oopsTemperatureEmptyString = require( 'string!GAS_PROPERTIES/oopsTemperatureEmpty' );
  const oopsPressureEmptyString = require( 'string!GAS_PROPERTIES/oopsPressureEmpty' );
  const oopsPressureLargeString = require( 'string!GAS_PROPERTIES/oopsPressureLarge' );
  const oopsPressureSmallString = require( 'string!GAS_PROPERTIES/oopsPressureSmall' );

  class OopsDialogManager {

    /**
     * @param {Object} oops - see GasPropertiesModel this.oops
     */
    constructor( oops ) {

      // @private {OopsDialog[]} created on demand, cached for the lifetime of the program
      this.dialogCache = [];

      // Oops! Temperature cannot be held constant when the container is empty.
      oops.temperatureEmptyEmitter.addListener( () => {
        this.showDialog( 0, oopsTemperatureEmptyString );
      } );

      // Oops! Pressure cannot be held constant when the container is empty.
      oops.pressureEmptyEmitter.addListener( () => {
        this.showDialog( 1, oopsPressureEmptyString );
      } );

      // Oops! Pressure cannot be held constant. Volume would be too large.
      oops.pressureLargeEmitter.addListener( () => {
        this.showDialog( 2, oopsPressureLargeString );
      } );

      // Oops! Pressure cannot be held constant. Volume would be too small.
      oops.pressureSmallEmitter.addListener( () => {
        this.showDialog( 3, oopsPressureSmallString );
      } );
    }

    /**
     * Shows a modal dialog for the specified message.
     * If a dialog has not previously been shown for the message, a dialog is created and added to the cache.
     * @param {number} dialogCacheIndex
     * @param {string} message
     * @private
     */
    showDialog( dialogCacheIndex, message ) {
      assert && assert( typeof dialogCacheIndex === 'number', `invalid dialogCacheIndex: ${dialogCacheIndex}` );
      assert && assert( typeof message === 'string', `invalid message: ${message}` );

      let dialog = this.dialogCache[ dialogCacheIndex ];
      if ( !dialog ) {
        dialog = new OopsDialog( message, GasPropertiesConstants.OOPS_DIALOG_OPTIONS );
        this.dialogCache[ dialogCacheIndex ] = dialog;
      }
      dialog.show();
    }
  }

  return gasProperties.register( 'OopsDialogManager', OopsDialogManager );
} ); 