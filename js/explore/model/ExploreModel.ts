// Copyright 2018-2024, University of Colorado Boulder

/**
 * ExploreModel is the top-level model for the 'Explore' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import IdealGasLawModel from '../../common/model/IdealGasLawModel.js';
import gasProperties from '../../gasProperties.js';

export default class ExploreModel extends IdealGasLawModel {

  public constructor( tandem: Tandem ) {

    super( tandem, {
      holdConstant: 'nothing',
      leftWallDoesWork: true // moving the left wall does work on particles
    } );

    // In case clients attempt to use this feature of the base class
    //TODO https://github.com/phetsims/gas-properties/issues/77 Verify that holdConstantProperty is phetioReadOnly:true
    this.holdConstantProperty.lazyLink( holdConstant => {
      throw new Error( 'holdConstant is fixed in the Explore screen' );
    } );
  }
}

gasProperties.register( 'ExploreModel', ExploreModel );