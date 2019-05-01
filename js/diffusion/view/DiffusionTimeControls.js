// Copyright 2019, University of Colorado Boulder

/**
 * Time controls for the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const PlayPauseStepControl = require( 'GAS_PROPERTIES/common/view/PlayPauseStepControl' );
  const TimescaleControl = require( 'GAS_PROPERTIES/diffusion/view/TimescaleControl' );

  class DiffusionTimeControls extends HBox {

    /**
     * @param {DiffusionModel} model narrower interface?
     * @param {Object} [options]
     * @constructor
     */
    constructor( model, options ) {

      options = _.extend( {
        spacing: 25,
        align: 'center'
      }, options );

      // play/pause and step buttons
      const playPauseStepControl = new PlayPauseStepControl( model );

      // normal and slow radio buttons
      const timescaleControl = new TimescaleControl( model.timescaleProperty );

      assert && assert( !options.children, 'DiffusionTimeControls sets children' );
      options = _.extend( {
        children: [ playPauseStepControl, timescaleControl ]
      }, options );

      super( options );
    }
  }

  return gasProperties.register( 'DiffusionTimeControls', DiffusionTimeControls );
} );