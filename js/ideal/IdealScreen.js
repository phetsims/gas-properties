// Copyright 2018, University of Colorado Boulder

/**
 * The 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  const IdealModel = require( 'GAS_PROPERTIES/ideal/model/IdealModel' );
  const IdealScreenView = require( 'GAS_PROPERTIES/ideal/view/IdealScreenView' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenIdealString = require( 'string!GAS_PROPERTIES/screen.ideal' );

  class IdealScreen extends Screen {

    constructor() {

      const options = {
        name: screenIdealString,
        backgroundColorProperty: new Property( GasPropertiesColors.BACKGROUND_COLOR )
      };

      super(
        () => new IdealModel(),
        model => new IdealScreenView( model ),
        options
      );
    }
  }

  return gasProperties.register( 'IdealScreen', IdealScreen );
} );