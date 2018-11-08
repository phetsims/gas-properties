// Copyright 2018, University of Colorado Boulder

/**
 * The 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IdealModel = require( 'GAS_PROPERTIES/ideal/model/IdealModel' );
  var IdealScreenView = require( 'GAS_PROPERTIES/ideal/view/IdealScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenIdealString = require( 'string!GAS_PROPERTIES/screen.ideal' );

  /**
   * @constructor
   */
  function IdealScreen() {

    var options = {
      name: screenIdealString,
      backgroundColorProperty: new Property( GasPropertiesColors.BACKGROUND_COLOR )
    };

    Screen.call( this,
      function() { return new IdealModel(); },
      function( model ) { return new IdealScreenView( model ); },
      options
    );
  }

  gasProperties.register( 'IdealScreen', IdealScreen );

  return inherit( Screen, IdealScreen );
} );