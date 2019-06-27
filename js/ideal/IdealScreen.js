// Copyright 2018-2019, University of Colorado Boulder

/**
 * IdealScreen is the 'Ideal' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const GasPropertiesScreen = require( 'GAS_PROPERTIES/common/GasPropertiesScreen' );
  const IdealModel = require( 'GAS_PROPERTIES/ideal/model/IdealModel' );
  const IdealScreenView = require( 'GAS_PROPERTIES/ideal/view/IdealScreenView' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const screenIdealString = require( 'string!GAS_PROPERTIES/screen.ideal' );

  class IdealScreen extends GasPropertiesScreen {

    /**
     * @param {Tandem} tandem
     * @param {Object} options
     */
    constructor( tandem, options ) {
      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      options = _.extend( {

        // superclass options
        name: screenIdealString,
        homeScreenIcon: GasPropertiesIconFactory.createIdealScreenIcon(),
        hasHoldConstantControls: true
      }, options );

      const createModel = () => new IdealModel( tandem.createTandem( 'model' ) );
      const createView = ( model ) => new IdealScreenView( model, tandem.createTandem( 'view' ), {
        hasHoldConstantControls: options.hasHoldConstantControls
      } );

      super( createModel, createView, tandem, options );
    }
  }

  return gasProperties.register( 'IdealScreen', IdealScreen );
} );