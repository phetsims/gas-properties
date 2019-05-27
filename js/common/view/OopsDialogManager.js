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

      // Oops! Temperature cannot be held constant when the container is empty.
      let temperatureWithEmptyContainerDialog = null;
      oops.temperatureWithEmptyContainerEmitter.addListener( () => {
        temperatureWithEmptyContainerDialog = temperatureWithEmptyContainerDialog || 
                                              new OopsDialog( oopsTemperatureWithEmptyContainerString, GasPropertiesConstants.OOPS_DIALOG_OPTIONS );
        temperatureWithEmptyContainerDialog.show();
      } );

      // Oops! Pressure cannot be held constant when the container is empty.
      let pressureWithEmptyContainerDialog = null;
      oops.pressureWithEmptyContainerEmitter.addListener( () => {
        pressureWithEmptyContainerDialog = pressureWithEmptyContainerDialog || 
                                           new OopsDialog( oopsPressureWithEmptyContainerString, GasPropertiesConstants.OOPS_DIALOG_OPTIONS );
        pressureWithEmptyContainerDialog.show();
      } );

      // Oops! Pressure cannot be held constant. Volume would be too large.
      let pressureWithLargeVolumeDialog = null;
      oops.pressureWithLargeVolumeEmitter.addListener( () => {
        pressureWithLargeVolumeDialog = pressureWithLargeVolumeDialog || 
                                        new OopsDialog( oopsPressureWithLargeVolumeString, GasPropertiesConstants.OOPS_DIALOG_OPTIONS );
        pressureWithLargeVolumeDialog.show();
      } );

      // Oops! Pressure cannot be held constant. Volume would be too small.
      let pressureWithSmallVolumeDialog = null;
      oops.pressureWithSmallVolumeEmitter.addListener( () => {
        pressureWithSmallVolumeDialog = pressureWithSmallVolumeDialog || 
                                        new OopsDialog( oopsPressureWithSmallVolumeString, GasPropertiesConstants.OOPS_DIALOG_OPTIONS );
        pressureWithSmallVolumeDialog.show();
      } );
    }
  }

  return gasProperties.register( 'OopsDialogManager', OopsDialogManager );
} ); 