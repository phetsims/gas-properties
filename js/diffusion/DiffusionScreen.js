// Copyright 2018, University of Colorado Boulder

/**
 * The 'Work' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DiffusionModel = require( 'GAS_PROPERTIES/diffusion/model/DiffusionModel' );
  var DiffusionScreenView = require( 'GAS_PROPERTIES/diffusion/view/DiffusionScreenView' );
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenDiffusionString = require( 'string!GAS_PROPERTIES/screen.diffusion' );

  /**
   * @constructor
   */
  function DiffusionScreen() {

    var options = {
      name: screenDiffusionString,
      backgroundColorProperty: new Property( GasPropertiesColors.BACKGROUND_COLOR )
    };

    Screen.call( this,
      function() { return new DiffusionModel(); },
      function( model ) { return new DiffusionScreenView( model ); },
      options
    );
  }

  gasProperties.register( 'DiffusionScreen', DiffusionScreen );

  return inherit( Screen, DiffusionScreen );
} );