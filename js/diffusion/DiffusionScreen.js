// Copyright 2018, University of Colorado Boulder

/**
 * The 'Work' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DiffusionModel = require( 'GAS_PROPERTIES/diffusion/model/DiffusionModel' );
  const DiffusionScreenView = require( 'GAS_PROPERTIES/diffusion/view/DiffusionScreenView' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColors = require( 'GAS_PROPERTIES/common/GasPropertiesColors' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenDiffusionString = require( 'string!GAS_PROPERTIES/screen.diffusion' );

  class DiffusionScreen extends Screen {

    constructor() {

      const options = {
        name: screenDiffusionString,
        backgroundColorProperty: new Property( GasPropertiesColors.BACKGROUND_COLOR )
      };

      super(
        () => new DiffusionModel(),
        model => new DiffusionScreenView( model ),
        options
      );
    }
  }

  return gasProperties.register( 'DiffusionScreen', DiffusionScreen );
} );