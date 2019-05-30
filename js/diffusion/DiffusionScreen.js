// Copyright 2018-2019, University of Colorado Boulder

/**
 * The 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DiffusionModel = require( 'GAS_PROPERTIES/diffusion/model/DiffusionModel' );
  const DiffusionScreenView = require( 'GAS_PROPERTIES/diffusion/view/DiffusionScreenView' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const GasPropertiesScreen = require( 'GAS_PROPERTIES/common/GasPropertiesScreen' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const screenDiffusionString = require( 'string!GAS_PROPERTIES/screen.diffusion' );

  class DiffusionScreen extends GasPropertiesScreen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      const createModel = () => new DiffusionModel( tandem.createTandem( 'model' ) );
      const createView = ( model ) => new DiffusionScreenView( model, tandem.createTandem( 'view' ) );

      super( createModel, createView, tandem, {
        name: screenDiffusionString,
        homeScreenIcon: GasPropertiesIconFactory.createDiffusionScreenIcon()
      } );
    }
  }

  return gasProperties.register( 'DiffusionScreen', DiffusionScreen );
} );