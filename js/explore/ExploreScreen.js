// Copyright 2018, University of Colorado Boulder

/**
 * The 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ExploreModel = require( 'GAS_PROPERTIES/explore/model/ExploreModel' );
  const ExploreScreenView = require( 'GAS_PROPERTIES/explore/view/ExploreScreenView' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenExploreString = require( 'string!GAS_PROPERTIES/screen.explore' );

  class ExploreScreen extends Screen {

    constructor() {

      const options = {
        name: screenExploreString,
        backgroundColorProperty: new Property( GasPropertiesColors.BACKGROUND_COLOR )
      };

      super(
        () => new ExploreModel(),
        model => new ExploreScreenView( model ),
        options
      );
    }
  }

  return gasProperties.register( 'ExploreScreen', ExploreScreen );
} );