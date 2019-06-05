// Copyright 2019, University of Colorado Boulder

/**
 * Manages the set of 'Oops!' dialogs that are related to the 'Hold Constant' feature.
 * When holding a quantity constant would break the model, the model puts itself in a sane configuration,
 * the model notifies the view via an Emitter, and the view notifies the user via a dialog.
 *
 * The student is almost certain to encounter these on the Ideal (first) screen, so dialogs are created eagerly
 * and reused.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesOopsDialog = require( 'GAS_PROPERTIES/common/view/GasPropertiesOopsDialog' );

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

      // Oops! Temperature cannot be held constant when the container is empty.
      const oopsTemperatureEmptyDialog = new GasPropertiesOopsDialog( oopsTemperatureEmptyString );
      oops.temperatureEmptyEmitter.addListener( () => { oopsTemperatureEmptyDialog.show(); } );

      // Oops! Pressure cannot be held constant when the container is empty.
      const oopsPressureEmptyDialog = new GasPropertiesOopsDialog( oopsPressureEmptyString );
      oops.pressureEmptyEmitter.addListener( () => { oopsPressureEmptyDialog.show(); } );

      // Oops! Pressure cannot be held constant. Volume would be too large.
      const oopsPressureLargeDialog = new GasPropertiesOopsDialog( oopsPressureLargeString );
      oops.pressureLargeEmitter.addListener( () => { oopsPressureLargeDialog.show(); } );

      // Oops! Pressure cannot be held constant. Volume would be too small.
      const oopsPressureSmallDialog = new GasPropertiesOopsDialog( oopsPressureSmallString );
      oops.pressureSmallEmitter.addListener( () => { oopsPressureSmallDialog.show(); } );
    }
  }

  return gasProperties.register( 'OopsDialogManager', OopsDialogManager );
} ); 