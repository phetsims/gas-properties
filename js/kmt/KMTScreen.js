// Copyright 2018, University of Colorado Boulder

/**
 * The 'Work' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KMTModel = require( 'GAS_PROPERTIES/kmt/model/KMTModel' );
  var KMTScreenView = require( 'GAS_PROPERTIES/kmt/view/KMTScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenKmtString = require( 'string!GAS_PROPERTIES/screen.kmt' );

  /**
   * @constructor
   */
  function KMTScreen() {

    var options = {
      name: screenKmtString,
      backgroundColorProperty: new Property( GasPropertiesColors.BACKGROUND_COLOR )
    };

    Screen.call( this,
      function() { return new KMTModel(); },
      function( model ) { return new KMTScreenView( model ); },
      options
    );
  }

  gasProperties.register( 'KMTScreen', KMTScreen );

  return inherit( Screen, KMTScreen );
} );