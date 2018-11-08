// Copyright 2018, University of Colorado Boulder

/**
 * The 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ExploreModel = require( 'GAS_PROPERTIES/explore/model/ExploreModel' );
  var ExploreScreenView = require( 'GAS_PROPERTIES/explore/view/ExploreScreenView' );
  var gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  var GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenExploreString = require( 'string!GAS_PROPERTIES/screen.explore' );

  /**
   * @constructor
   */
  function ExploreScreen() {

    var options = {
      name: screenExploreString,
      backgroundColorProperty: new Property( GasPropertiesColors.BACKGROUND_COLOR )
    };

    Screen.call( this,
      function() { return new ExploreModel(); },
      function( model ) { return new ExploreScreenView( model ); },
      options
    );
  }

  gasProperties.register( 'ExploreScreen', ExploreScreen );

  return inherit( Screen, ExploreScreen );
} );